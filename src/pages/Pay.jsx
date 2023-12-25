import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useSearchParams, useNavigate } from "react-router-dom";

const Pay = () => {
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || "default_token";
  const planIdParam = searchParams.get("planId") || "default_order_id";
  const plan_type = searchParams.get("plan_type") || "one_time"

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
          plan_type:plan_type
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
        const orderResponse = await axios.post(
          "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-order",
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

        console.log(orderResponse.data.data);

        const options = {
          access_key: "access_key_81x7BagWlM1Rn05N",
          order_id: orderResponse.data.data.order_id,
          callback_handler: function (response) {
            console.log(response);
            if (response.status === "success") {
              console.log(response.nimbbl_transaction_id);
              console.log(response.order_id);
              console.log(response.order.invoice_id);
              console.log(response.transaction.transaction_amount);

              axios
                .post(
                  "http://127.0.0.1:4000/api/v1/payment/create-payment",
                  {
                    nimbbl_order_id: response.order_id,
                    nimbbl_transaction_id: response.nimbbl_transaction_id,
                    order_invoice: response.order.invoice_id,
                    order_amount: response.transaction.transaction_amount,
                    transaction_id: response.transaction.transaction_id,
                    order_status: response.status,
                    plan_type:plan_type
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${tokenParam}`,
                    },
                  }
                )
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });

              // Add a parameter to the URL if the payment is successful
              // navigate(`/pay/success`);
            } else if (response.status === "failure") {
              alert("Payment failed");
            }
          },
        };

        window.checkout = new NimbblCheckout(options);
        window.checkout.open(orderResponse.data.data.order_id);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.nimbbl.tech/static/assets/js/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
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
        {/* creating a loading screen */}
        {token === "" ? (
          <div className="loading">
            <h2>Loading...</h2>
          </div>
        ) : (
          <div className="App-link">
            {/*loading screen  */}
            {/*  */}
            <p>loading </p>
            <p>don`t refresh or move back</p>
          </div>
        )}
      </header>
    </div>
  );
};

export default Pay;
