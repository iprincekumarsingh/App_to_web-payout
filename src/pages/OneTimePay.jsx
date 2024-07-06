import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Helmet } from "react-helmet";

function OneTimePay() {
    const [token, setToken] = useState('');
    const [coupon, setCoupon] = useState('');
    const [plan_id, setPlanId] = useState('');
    const [order_amount, setOrderAmount] = useState('');
    const [plan_type, setPlanType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch initial data from URL params
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams(window.location.search);
                const initialToken = params.get('token') || '';
                const initialCoupon = params.get('couponCode') || '';
                const initialPlanId = params.get('plan_id') || '';

                setToken(initialToken);
                setCoupon(initialCoupon);
                setPlanId(initialPlanId);
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to buy the plan
    const buyPlan = useCallback(async (token, planId, coupon) => {
        try {
            setLoading(true);
            if (!token || !planId) {
                alert('Please enter a token and plan id');
                return;
            }

            const apiUrl = "https://api.dorzet.in/api/v1/oneTime/create-token";
            const requestData = {
                plan_id: planId,
                couponCode: coupon || null // Pass coupon as null if not provided
            };

            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Token created:', response.data.data.orderToken);
            await createOrder(token);
        } catch (error) {
            setError('Error buying plan: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to create order
    const createOrder = async (token) => {
        try {
            setLoading(true);
            const apiUrl = "http://192.168.1.4:4000/api/v1/oneTime/create-order";

            const response = await axios.post(apiUrl, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            console.log('Order created:', response.data.data);
            setOrderAmount(response.data?.data?.order_amount);
            setPlanType(response.data?.data?.plan_type);

            const options = {
                access_key: "access_key_81x7BagWlM1Rn05N", // Replace with your actual access key
                order_id: response.data.data.order_id,
                callback_handler: async function (response) {
                    console.log('Nimbbl Checkout Response:', response);

                    if (response.status === "failed") {
                        console.log('Payment failed');
                        setError('Payment failed');
                        // Optionally retry payment or handle accordingly
                    }

                    if (response.status === "success") {
                        console.log('Payment successful');
                        await sendOrderAndCreatePayment(response, token);
                    }
                },
            };

            // eslint-disable-next-line no-undef
            window.checkout = new NimbblCheckout(options);
            window.checkout.open(response.data.data.order_id);
        } catch (error) {
            setError('Error creating order: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to create detailed payment
    const sendOrderAndCreatePayment = async (response, token) => {
        try {
            setLoading(true);
            let payload = {
                order_id: response.order_id || "",
                nimbbl_signature: response.nimbbl_signature || "",
                nimbbl_transaction_id: response.nimbbl_transaction_id || "",
                order_invoice: (response.order && response.order.invoice_id) || "",
                payment_partner: response.transaction.payment_partner || "",
                order_amount: (response.transaction && response.transaction.transaction_amount) || "",
                transaction_id: (response.transaction && response.transaction.transaction_id) || "",
                order_status: response.status || "",
                plan_type: plan_type || "",
                payment_mode: response.transaction.payment_mode || "",
            };

            const res = await axios.post(
                "http://192.168.1.4:4000/api/v1/oneTime/create-payment",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Payment details saved:", res.data);
            // Redirect to success page
            window.location.href = "/pay/success";
        } catch (error) {
            setError('Error sending order and creating payment: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Trigger buyPlan when token, plan_id, or coupon change
    useEffect(() => {
        if (token && plan_id) {
            buyPlan(token, plan_id, coupon);
        }
    }, [token, plan_id, coupon, buyPlan]);

    // Load Nimbbl checkout script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://api.nimbbl.tech/static/assets/js/checkout.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Helmet>
                <title>One Time Pay</title>
            </Helmet>
            {loading && (
                <div className="flex items-center justify-center h-screen">
                    <div className="spinner"></div>
                </div>
            )}
            {!loading && (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-2xl font-bold mb-4">One Time Pay</h1>
                    {error && (
                        <div className="mb-4">
                            <p className="text-red-500 text-xs italic">{error}</p>
                        </div>
                    )}
                    <p className="mb-4">Order Amount: {order_amount}</p>
                </div>
            )}
        </div>
    );
}

export default OneTimePay;
