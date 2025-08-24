import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Backend URL from environment variable
const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminLoginForm() {
    const [admin, setAdmin] = useState({ username: "", password: "" });
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
        setError({ ...error, [e.target.name]: "" });
    };

    const validate = () => {
        let textError = {};
        if (!admin.username.trim()) textError.username = "Enter username";
        if (!admin.password.trim()) textError.password = "Enter password";

        setError(textError);
        return Object.keys(textError).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        if (!validate()) return;

        try {
            const res = await fetch(`${BASE_URL}/digitalWalletSystem/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(admin),
            });

            if (res.ok) {
                const data = await res.text();
                setSuccess(data || "Login successful!");
                setAdmin({ username: "", password: "" });
                navigate("/admindashboard"); // Navigate after successful login
            } else {
                const data = await res.text();
                setError({ general: data || "Invalid username or password" });
            }
        } catch (err) {
            setError({ general: "Server error. Try again later." });
        }
    };

    return (
        <div>
            <form className="card card-style p-4 mt-5" onSubmit={handleSubmit}>
                {error.general && <p className='text-danger text-center fs-20'>{error.general}</p>}
                {success && <p className='text-success text-center fs-20'>{success}</p>}

                <h2 className="text-center">Admin Login</h2>

                <div className="form-group mb-2">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='Enter the username'
                        name="username"
                        id="username"
                        value={admin.username}
                        onChange={handleChange}
                    />
                    {error.username && <p className='text-danger'>{error.username}</p>}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='Enter the password'
                        name="password"
                        id="password"
                        value={admin.password}
                        onChange={handleChange}
                    />
                    {error.password && <p className='text-danger'>{error.password}</p>}
                </div>

                <button type="submit" className='btn btn-primary mb-2'>Login</button>
            </form>
        </div>
    );
}

export default AdminLoginForm;
