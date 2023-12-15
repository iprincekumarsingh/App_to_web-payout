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
  const amount = params.get("amount") || "default_order_id";

  const buy = async () => {
    try {
      const response = await axios.post(
        "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-token",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenParam}`, // Replace with your actual API key
          },
        }
      );

      setToken(response.data.data.orderToken);

      if (response.data.data.orderToken !== null) {
        const orderResponse = await axios.post(
          "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-order",
          {
            amount: amount,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenParam}`, // Replace with your actual API key
            },
          }
        );

        setOrder_id(orderResponse.data.order_id);

        const options = {
          access_key: "access_key_81x7BagWlM1Rn05N", // Replace with your actual access key
          order_id: orderResponse.data.order_id,
          // ... other options
        };

        window.checkout = new NimbblCheckout(options);
        window.checkout.open(orderResponse.data.order_id);
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

  return (
    <div className="App">
      <Helmet>
        <script
          src="https://api.nimbbl.tech/static/assets/js/checkout.js"
          async
        />
      </Helmet>
      <header className="App-header">
        <h1 onClick={buy}>Buy</h1>
        <p>Token: {token || tokenParam}</p>
        <p>Order ID: {order_id || orderIdParam}</p>
      </header>
    </div>
  );
};

export default Pay;
