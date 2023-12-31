import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useSearchParams, useNavigate } from "react-router-dom";

const UpgradePage = () => {
  const [token, setToken] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
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

      // creating token for
      const response = await axios.post(
        "https://vast-red-lizard-tux.cyclic.app/api/v1/payment/create-token",
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
          `https://vast-red-lizard-tux.cyclic.app/api/v1/payment/create-order?isupgrade=false&role=${role}`,
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
          callback_handler: async function (response) {
            // set order status
            setOrderStatus(response.status);
            if (response.status === "failed") {
              // alert("Payment failed");

              // Make the API request even for failed payments
              await sendOrderAndCreatePayment(response);
            }

            if (response.status === "success") {
              console.log(response.nimbbl_transaction_id);
              console.log(response.order_id);
              console.log(response.order.invoice_id);
              console.log(response.transaction.transaction_amount);

              // Make the API request for successful payments
              await sendOrderAndCreatePayment(response);

              // Additional logic for successful payments
            }
          },
        };

        // Function to send order status and create detailed payment
        const sendOrderAndCreatePayment = async (response) => {
          try {


            console.log("Developer", response);
            await createPayment(response);
          } catch (error) {
            console.error("Error:", error.message);
          }
        };

        // Function to create detailed payment
        // Function to create detailed payment
        const createPayment = async (response) => {
          try {
            let payload = {
              nimbbl_order_id: response.order_id || "",
              nimbbl_transaction_id: response.nimbbl_transaction_id || "",
              order_invoice:
                (response.order && response.order.invoice_id) || "",
              order_amount:
                (response.transaction &&
                  response.transaction.transaction_amount) ||
                "",
              transaction_id:
                (response.transaction && response.transaction.transaction_id) ||
                "",
              order_status: response.status || "",
              plan_type: plan_type || "",
            };

            // Example API request
            const res = await axios.post(
              `https://vast-red-lizard-tux.cyclic.app/api/v1/payment/create-payment`,
              payload,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenParam}`,
                },
              }
            );

            console.log("Developer", res);
          } catch (error) {
            console.log("Error generate", error);
          }
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
  <div style={styles.app}>
    <h1 style={styles.heading}>Dorzet</h1>
    <header style={styles.header}>
      {loading ? (
        // Loading screen

        <div>
          <p style={styles.loadingText}>Loading...</p>
          <p style={styles.loadingDescription}>
            Please wait while we are processing the payment
          </p>
        </div>
      ) : null}

      {orderStatus === "success" ? (
        // Success screen
        <div>
          <Helmet>
            <title>Payment Successful</title>
          </Helmet>
          <p style={styles.loadingText}>Payment Successful</p>
          <p style={styles.loadingDescription}>
            Your payment has been successfully processed
          </p>
        </div>
      ) : (
        ""
      )}

      {orderStatus === "failed" ? (
          <div>
          <Helmet>
            <title>Payment Failed</title>
          </Helmet>
          <p style={styles.loadingText}>Payment Failed</p>
          {/*set text to make the payment again */}
          <p style={styles.loadingDescription}>
            Your payment has been failed
          </p>
          <button
            onClick={() => {
              fetchDataAndBuy();
            }}
          >
            Make the payment again by clicking here
          </button>
        </div>) : null}
    </header>
  </div>
  );
};

const styles = {
  app: {
    textAlign: "center",
  },
  heading: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: "20px",
  },
  header: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "black",
  },
  loadingText: {
    fontSize: "30px",
    fontWeight: "bold",
    color:'black'
  },
  loadingDescription: {
    fontSize: "20px",
  },
};

export default UpgradePage;
