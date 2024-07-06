import React, { useEffect, useState } from 'react';
import './DeleteAccount.css'; // Import your CSS file for styles (example: DeleteAccount.css)

const DeleteAccount = () => {
    const [confirmation, setConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const getAuthToken = () => {
        // Implement your function to retrieve the authentication token
        // from local storage, context, or state as per your application's setup
        return localStorage.getItem('token'); // Example for local storage
    };

    useEffect(() => {
        const authToken = getAuthToken();
        if (!authToken) {
            window.location.href = "/login"; // Redirect to login if no token exists
        }
    }, []); // Empty dependency array means this effect runs once, on mount

    const handleDeleteAccount = async () => {
        if (confirmation !== 'DELETE') {
            setError('Please enter "DELETE" to confirm deletion.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const authToken = getAuthToken();

            const response = await fetch('https://api.dorzet.in//api/v1/auth/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Include the token here
                },
                // Add any payload needed for account deletion
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete account');
            }

            setSuccess(true); // Account deletion successful

            // Optional: You can clear token from local storage here if needed
            // localStorage.removeItem('token');

        } catch (error) {
            console.error('Error deleting account:', error);
            setError(error.message || 'Failed to delete account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pageContainer">
            <div className="card">
                <h2 className="title">Delete Account</h2>
                {error && <p className="error">{error}</p>}
                {success ? (
                    <p className="success">Account deleted successfully. Redirecting...</p>
                ) : (
                    <>
                        <p className="info">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <input
                            className="input"
                            type="text"
                            placeholder="Type DELETE to confirm"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                        />
                        <button
                            className="deleteButton"
                            onClick={handleDeleteAccount}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteAccount;
