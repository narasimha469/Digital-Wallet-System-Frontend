import { useState } from 'react';
import { Link } from 'react-router-dom';

// Render backend URL
const BASE_URL = "https://digital-wallet-system-backend-prg5.onrender.com";

function ForgotPassword() {
    const [formData, setFormData] = useState({ email: "", newPassword: "" });
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError({ ...error, [e.target.name]: "" }); 
    };

    const validate = () => {
        let textError = {};
        if (!formData.email.trim()) {
            textError.email = "Please enter your email";
        }
        if (!formData.newPassword.trim()) {
            textError.newPassword = "Please enter a new password";
        }
        setError(textError);
        return Object.keys(textError).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        if (!validate()) return;

        try {
            const response = await fetch(
                `${BASE_URL}/digitalWalletSystem/customers/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                const data = await response.text();
                setSuccess(data || "Password updated successfully!");
                setFormData({ email: "", newPassword: "" });
            } else {
                const data = await response.text();
                setError({ general: data || "Something went wrong" });
            }
        } catch (err) {
            setError({ general: "Server error. Try again later." });
        }
    };

    return (
        <div className="container mt-5">
            <form className="card card-style p-4" onSubmit={handleSubmit}>
                <h3 className="text-center mb-4">Forgot Password</h3>

                <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Enter your registered email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {error.email && <p className="text-danger">{error.email}</p>}
                </div>

                <div className="form-group mb-3">
                    <label>New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                    {error.newPassword && <p className="text-danger">{error.newPassword}</p>}
                </div>

                {error.general && <p className="text-danger">{error.general}</p>}
                {success && <p className="text-success">{success}</p>}

                <button type="submit" className="btn btn-primary w-100 mb-2">
                    Reset Password
                </button>

                <div className="text-center">
                    <Link to="/customerAuth" className="text-decoration-none">
                        Back To Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;
