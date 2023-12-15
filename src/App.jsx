import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

function App() {
  const [order_id, setOrder_id] = useState("");
  const [token, setToken] = useState("");

  const buy = async () => {
    try {
      const response = await axios.post(
        "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-token",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NWZhMjRhZTNjNzFlMzBlNzcxODNjNiIsInBob25lTm8iOiI4MDkzNDgzMTE1Iiwicm9sZSI6InBhcnRuZXIiLCJpYXQiOjE3MDI2NjY2OTQsImV4cCI6MTczNDIwMjY5NH0.R4bYQa1ZbS2alygwuyaBHpjOBGlFhud05QOpKuvS6W4`,
          },
        }
      );
      setToken(response.data.data.orderToken);

      if (token) {
        const orderResponse = await axios.post(
          "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-order",
          {
            amount: 4000,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NWZhMjRhZTNjNzFlMzBlNzcxODNjNiIsInBob25lTm8iOiI4MDkzNDgzMTE1Iiwicm9sZSI6InBhcnRuZXIiLCJpYXQiOjE3MDI2NjY2OTQsImV4cCI6MTczNDIwMjY5NH0.R4bYQa1ZbS2alygwuyaBHpjOBGlFhud05QOpKuvS6W4`,
            },
          }
        );

        setOrder_id(orderResponse.data.order_id);

        const options = {
          access_key: "access_key_81x7BagWlM1Rn05N",
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
      </header>
    </div>
  );
}

export default App;
