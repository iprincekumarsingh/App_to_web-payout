import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const Pay = () => {
  const [token, setToken] = useState("");
  const [order_id, setOrder_id] = useState("");

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const tokenParam = params.get("token") || "default_token";
  const planIdParam = params.get("planId") || "default_order_id";

  const fetchDataAndBuy = async () => {
    try {
      if (
        tokenParam === "default_token" ||
        planIdParam === "default_order_id"
      ) {
        alert("Please select a plan first");
        return;
      }
      if (tokenParam === null || planIdParam === null) {
        alert("Please select a plan first");
        return;
      }
      const response = await axios.post(
        "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-token",
        {
          plan_id: planIdParam,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenParam}`,
          },
        }
      );

      setToken(response.data.data.orderToken);

      if (response.data.data.orderToken !== null) {
        const orderResponse = await axios
          .post(
            "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-order",
            {
              plan_id: planIdParam,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenParam}`, // Replace with your actual API key
              },
            }
          )
          .then((res) => {
            console.log(res.data.data);
            // setOrder_id(res.data.data.order_id);

            const options = {
              access_key: "access_key_81x7BagWlM1Rn05N",
              order_id: res.data.data.order_id,
              callback_handler: function (response) {
                console.log(response);
                if (response.status === "success") {
                  console.log(response.nimbbl_transaction_id);
                  console.log(response.order_id);
                  console.log(response.order.invoice_id);
                  console.log(response.transaction.transaction_amount);

                  axios
                    .post(
                      "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-payment",
                      {
                        nimbbl_order_id: response.order_id,
                        nimbbl_transaction_id: response.nimbbl_transaction_id,
                        order_invoice: response.order.invoice_id,
                        order_amount: response.transaction.transaction_amount,
                        transaction_id: response.transaction.transaction_id,
                        order_status: response.status,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${tokenParam}`, // Replace with your actual API key
                        },
                      }
                    )
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((err) => {
                      console.log(err);
                    });

                  // if the response is authentic, then only fulfill the order
                } else if (response.status === "failure") {
                  // alert("Payment failed");
                }
              },
            };

            window.checkout = new NimbblCheckout(options);
            window.checkout.open(res.data.order_id);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle the error
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.nimbbl.tech/static/assets/js/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script on unmount
    };
  }, []);

  useEffect(() => {
    if (tokenParam !== "default_token" && planIdParam !== "default_order_id") {
      fetchDataAndBuy();
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <script
          src="https://api.nimbbl.tech/static/assets/js/checkout.js"
          async
        />
      </Helmet>
      <header className="App-header">
        <h1>Click here to pay out</h1>
      </header>
    </div>
  );
};

export default Pay;
