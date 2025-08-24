import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Render backend URL
const BASE_URL = "https://digital-wallet-system-backend-prg5.onrender.com";

function UpdateCustomerForm() {
    const customerId = localStorage.getItem("customerId");
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhoneNumber: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/digitalWalletSystem/customers/${customerId}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        customerName: data.customerName,
                        customerEmail: data.customerEmail,
                        customerPhoneNumber: data.customerPhoneNumber,
                    });
                } else {
                    setMessage("Failed to load customer details");
                }
            } catch (err) {
                setMessage("Error loading customer details");
            }
        };
        fetchCustomer();
    }, [customerId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `${BASE_URL}/digitalWalletSystem/customers/${customerId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (res.ok) {
                setMessage("Customer updated successfully");
                setTimeout(() => navigate("/customerdashboard"), 1000);
            } else {
                const data = await res.text();
                setMessage(data || "Failed to update customer");
            }
        } catch {
            setMessage("Server error");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Update Your Details</h2>
            {message && <p className="text-center fw-bold">{message}</p>}

            <form onSubmit={handleSubmit} className="p-3 border rounded shadow">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        name="customerPhoneNumber"
                        value={formData.customerPhoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Save Changes
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/customerdashboard")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default UpdateCustomerForm;
