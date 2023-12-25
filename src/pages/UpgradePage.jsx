import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useSearchParams, useNavigate } from "react-router-dom";

const UpgradePage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || "default_token";
  const planIdParam = searchParams.get("planId") || "default_order_id";
  const plan_type = searchParams.get("plan_type") || "one_time";
  const role = searchParams.get("role") || "default_role";
  const isupgrade = searchParams.get("isupgrade") || "false";
  const [loading, setLoading] = useState(true);

  const fetchDataAndBuy = async () => {
    try {
      if (
        tokenParam === "default_token" ||
        planIdParam === "default_order_id" ||
        role === "default_role"
      ) {
        console.log(tokenParam, planIdParam, role, isupgrade);
        return;
      }

      const response = await axios.post(
        "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-token",
        {
          plan_id: planIdParam,
          plan_type: plan_type,
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
          `https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-order?isupgrade=true&role=${role}`,
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

        if (orderResponse.data.data.paymentInitiated) {
          // Check if payment has already been initiated
          setLoading(false);
          return;
        }

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
                  `https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-payment?role=${role}&isupgrade=true`,
                  {
                    nimbbl_order_id: response.order_id,
                    nimbbl_transaction_id: response.nimbbl_transaction_id,
                    order_invoice: response.order.invoice_id,
                    order_amount: response.transaction.transaction_amount,
                    transaction_id: response.transaction.transaction_id,
                    order_status: response.status,
                    plan_type: plan_type,
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

              // change the url to the success page
              navigate("/pay/success");
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
    if (planIdParam !== "default_order_id") {
      fetchDataAndBuy();
    }

    const script = document.createElement("script");
    script.src = "https://api.nimbbl.tech/static/assets/js/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [planIdParam]);

  return (
    <div className="App">
     
      <header className="App-header">
        {/* creating a loading screen */}
        {loading ? (
          <div className="loading">
            <h2>Loading...</h2>
          </div>
        ) : (
          <div className="App-link">
            {/* loading screen */}
            <p>Loading </p>
            <p>Don't refresh or move back</p>
          </div>
        )}
      </header>
    </div>
  );
};

export default UpgradePage;
