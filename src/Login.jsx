import React, { useState } from 'react';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenExists, setTokenExists] = useState(false);
    const getBaseURL = () => 'http://localhost:4000/api/v1'; // Replace with your actual base URL
    React.useEffect(() => {
        // Check if token exists in localStorage when component mounts
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = "/delete/account";
        } else {
            setTokenExists(false);
        }
    }, []);
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

            // if (!response.ok) {
            //         console.log(response);
            //     throw new Error('Network response was not ok');
            // }




            const data = await response.json();
            if (data.success === false) {

                setError(true);
                setErrorMsg(data.message);
                return
            }
            else {
                console.log(data.success);
                let token = ""

                if (data.data.token) {
                    token = data.data.token;
                }
                else {
                    token = data.token
                }
                localStorage.setItem('token', token);
            }
            // console.log(data.data.token);

            setIsOtpVisible(true);
        } catch (error) {
            console.error(error);
            setError(true);
            // setErrorMsg(error.data.data);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        if (otp.length !== 4) {
            alert('OTP', 'Please enter a valid OTP');
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

            try {
                await localStorage.setItem('token', data.data.token.toString());
                await localStorage.setItem(
                    'isProfileCompleted',
                    data.data.user.isProfileCompleted.toString()
                );
                await localStorage.setItem(
                    'isAadharCardVerfied',
                    data.data.user.isAadharCardVerfied.toString()
                );
                await localStorage.setItem('user', JSON.stringify(data.data.user));
            } catch (error) {
                console.error('Error saving token to localStorage:', error);
            }

            if (!data.success) {
                alert(data.message);
            }

            if (data.success) {
                alert(data.message);
                console.log(data.data.referCode);
                window.location.href = "/delete/account";
                // Add your logic here to update state and navigate
                // e.g., setUser(data.data.user), setToken(data.data.token), etc.
            }
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
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>
                {error && <p style={styles.error}>{errorMsg}</p>}
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {isOtpVisible && (
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                )}
                <button style={styles.button} onClick={handleClick} disabled={loading}>
                    {loading ? 'Loading...' : isOtpVisible ? 'Verify OTP' : 'Login'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '350px',
        width: '100%',
    },
    title: {
        marginBottom: '15px',
        fontSize: '22px',
        color: '#333333',
    },
    input: {
        margin: '8px 0',
        // padding: '12px',
        height: '35px',
        fontSize: '15px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
    },
    button: {
        marginTop: '15px',
        // paddingVertical: '12px',
        fontSize: '15px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
        width: '100%',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    '@media (max-width: 600px)': {
        card: {
            padding: '20px',
        },
        input: {
            fontSize: '14px',
        },
        button: {
            fontSize: '14px',
        },
    },
};

export default Login;
