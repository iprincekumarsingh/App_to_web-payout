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
  const orderIdParam = params.get("amount") || "default_order_id";

  const fetchDataAndBuy = async () => {
    try {
      const response = await axios.post(
        "https://clumsy-puce-abalone.cyclic.app/api/v1/payment/create-token",
        {},
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
              amount: 400,
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
            setOrder_id(res.data.order_id);

            const options = {
              access_key: "access_key_81x7BagWlM1Rn05N",
              order_id: res.data.order_id,
              callback_handler: function (response) {
                if (response.status === "success") {
                  alert("Payment successful");
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
    if (tokenParam !== "default_token" && orderIdParam !== "default_order_id") {
      fetchDataAndBuy();
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <script src="https://api.nimbbl.tech/static/assets/js/checkout.js" async />
      </Helmet>
      <header className="App-header">
        <h1>Click here to pay out</h1>
      </header>
    </div>
  );
};

export default Pay;
