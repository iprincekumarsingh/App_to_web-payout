import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

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

  const [error, setIsError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (tokenParam === "default_token" || planIdParam === "default_order_id") {
      setIsError(true);
      setErrorMessage(
        'Error 501 :Something went wrong. Please try again or contact support'
      );
    }
  }, []);

  const fetchDataAndBuy = async () => {

    // console.log("token",tokenParam);
    console.log("Developer", tokenParam, planIdParam, plan_type, isupgrade);
    try {
      if (
        tokenParam === "default_token" ||
        planIdParam === "default_order_id"

      ) {
        return;
      }

      // creating token for
      const response = await axios.post(
        "https://api.dorzet.in/api/v1/payment/create-token",
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
          `https://api.dorzet.in/api/v1/payment/create-order?isupgrade=false&role=${role}`,
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

        // console.log(orderResponse.data.data);

        if (orderResponse.data.data.paymentInitiated) {
          // Check if payment has already been initiated
          setLoading(false);
          return;
        }

        const options = {
          access_key: "access_key_MwvMYLzPNaQ62vry",
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
              `https://api.dorzet.in/api/v1/payment/2/create-payment`,
              payload,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenParam}`,
                },
              }
            );

            console.log("Developer", res);


            // change the url to success page
            // window.location.href = "/pay/success";
            if (res.data.data.order_status !== 'success') {
              window.location.href = "/pay/failed"
            }
            else {
              window.location.href = "/pay/success";
            }
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
      console.log(planIdParam);
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
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="mt-10">
        <img src={logo} alt="Logo" className="w-48 md:w-64" />

      </h1>
      <p className="text-sm mt-2">
        Please wait while we are processing the payment
      </p>
      <span className="text-xs mt-2 text-red-500">
        don`t refresh the page or go back
      </span>
      <span>{
        errorMessage
      }</span>

      {!error && (
        <header className="mt-10 px-4 md:px-0 w-full max-w-md text-center">
          {loading ? (
            // Loading screen
            <div>
              <p className="text-lg font-semibold">Loading...</p>
              <p className="text-sm mt-2">
                Please wait while we are processing the payment
              </p>
              <span className=" 
            text-xs mt-2 text-red-500
            ">
                don`t refresh the page or go back
              </span>
            </div>
          ) : null}

          {orderStatus === "success" ? (
            // Success screen
            <div>
              <Helmet>
                <title>Payment Successful</title>
              </Helmet>
              <p className="text-lg font-semibold">Payment Successful</p>
              <p className="text-sm mt-2">
                Your payment has been successfully processed
              </p>
            </div>
          ) : null}

          {orderStatus === "failed" ? (
            // Failed screen
            <div>
              <Helmet>
                <title>Payment Failed</title>
              </Helmet>
              <p className="text-lg font-semibold">Payment Failed</p>
              <p className="text-sm mt-2">
                Your payment has failed
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => {
                  fetchDataAndBuy();
                }}
              >
                Make the payment again
              </button>
            </div>
          ) : null}
        </header>
      )}
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
    color: 'black'
  },
  loadingDescription: {
    fontSize: "20px",
  },
};

export default UpgradePage;
