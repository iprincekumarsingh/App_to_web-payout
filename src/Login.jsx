import React, { useEffect, useState } from 'react';
import logo from './assets/logo.png';
const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // set title
        document.title = 'Login | Dorzet';
    }, []);



    const getBaseURL = () => 'https://api.dorzet.in/api/v1'; // Replace with your actual base URL

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(false);
            setErrorMsg('');

            if (!phoneNumber) {
                setError(true);
                setErrorMsg('Enter your phone number');
                return;
            }

            const isValidPhoneNumber = /^(\d{10})$/.test(phoneNumber);

            if (phoneNumber.length !== 10) {
                setError(true);
                setErrorMsg('Wrong Number | minimum 10 digits required');
                return;
            }

            if (!isValidPhoneNumber) {
                setError(true);
                setErrorMsg('Only numbers are allowed');
                return;
            }

            const url = `${getBaseURL()}/auth/login`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNo: phoneNumber }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const token = data.data.token || data.token;
            localStorage.setItem('token', token);

            setIsOtpVisible(true);
        } catch (error) {
            console.error(error);
            setError(true);
            setErrorMsg('Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        if (otp.length !== 4) {
            alert('Please enter a valid OTP');
            return;
        }
        try {
            setLoading(true);

            const response = await fetch(
                getBaseURL() + `/auth/verifyOtp/${phoneNumber}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ otp: otp }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            localStorage.setItem('token', data.data.token.toString());
            localStorage.setItem('isProfileCompleted', data.data.user.isProfileCompleted.toString());
            localStorage.setItem('isAadharCardVerfied', data.data.user.isAadharCardVerfied.toString());
            localStorage.setItem('user', JSON.stringify(data.data.user));

            alert(data.message);
            window.location.href = "/delete/account";
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        if (isOtpVisible) {
            handleOtpSubmit();
        } else {
            handleSubmit();
        }
    };

    return (
        <div className="flex justify-center flex-col items-center h-screen bg-white p-4">
            <h1>
                <img src={logo} alt="" className='w-80' />
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{errorMsg}</p>}
                <input
                    className="block w-full border border-gray-800 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {isOtpVisible && (
                    <input
                        className="block w-full border-gray-800 border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                )}
                <button
                    className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg w-full"
                    onClick={handleClick}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : isOtpVisible ? 'Verify OTP' : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;
