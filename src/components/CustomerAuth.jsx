import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Hardcoded backend URL
const BASE_URL = "https://digital-wallet-system-backend-prg5.onrender.com";

function CustomerAuth() {
  const [customer, setCustomer] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "",
    password: "",
    retypePassword: ""
  });

  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");
  const [isRegister, setIsRegister] = useState(true);

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
    setSuccess("");
  };

  const validate = () => {
    let errorText = {};
    if (!customer.customerName.trim()) {
      errorText.customerName = "Please enter the name";
    } else if (customer.customerName.trim().length < 3) {
      errorText.customerName = "Name must be at least 3 characters";
    }

    if (!customer.customerEmail.trim()) {
      errorText.customerEmail = "Please enter the email";
    } else if (!emailRegex.test(customer.customerEmail)) {
      errorText.customerEmail = "Enter a valid email";
    }

    if (!customer.customerPhoneNumber.trim()) {
      errorText.customerPhoneNumber = "Please enter the number";
    } else if (!phoneRegex.test(customer.customerPhoneNumber)) {
      errorText.customerPhoneNumber = "Phone number must be 10 digits (start with 6-9)";
    }

    if (!customer.password.trim()) {
      errorText.password = "Please enter the password";
    } else if (!passwordRegex.test(customer.password)) {
      errorText.password = "Password must be 8+ chars, with upper, lower, number & special char";
    }

    if (!customer.retypePassword.trim()) {
      errorText.retypePassword = "Please re-enter the password";
    } else if (customer.password !== customer.retypePassword) {
      errorText.retypePassword = "Passwords do not match";
    }

    setError(errorText);
    return Object.keys(errorText).length === 0;
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/digitalWalletSystem/customers/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: customer.customerEmail, 
            password: customer.password 
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("customerId", data.customerId);
        setSuccess("Login successful");
        setError({});
        navigate("/customerdashboard");
        window.location.reload();
      } else {
        if (data.errors) setError(data.errors);
        else setError({ general: data.message || "Login failed" });
        setSuccess("");
      }
    } catch (err) {
      setError({ general: "Server error" });
      setSuccess("");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/digitalWalletSystem/customers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: customer.customerName,
            customerEmail: customer.customerEmail,
            customerPhoneNumber: customer.customerPhoneNumber,
            password: customer.password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful. Please login!");
        setError({});
        setCustomer({
          customerName: "",
          customerEmail: "",
          customerPhoneNumber: "",
          password: "",
          retypePassword: ""
        });
        setIsRegister(true);
      } else {
        setError(data.errors || { general: "Registration failed" });
        setSuccess("");
      }
    } catch (err) {
      setError({ general: "Server error" });
      setSuccess("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRegister && !validate()) return;
    if (isRegister) handleLogin();
    else handleRegister();
  };

  return (
    <div>
      <form className="card card-style p-4 mt-5" onSubmit={handleSubmit}>
        {error.general && <p className="text-center text-danger fs-5">{error.general}</p>}
        {success && <p className="text-center text-success fs-5">{success}</p>}

        <h2 className="text-center">{!isRegister ? "Registration Form" : "Login Form"}</h2>

        {!isRegister && (
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="customerName"
              value={customer.customerName}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {error.customerName && <p className="text-danger">{error.customerName}</p>}
          </div>
        )}

        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="text"
            className="form-control"
            name="customerEmail"
            value={customer.customerEmail}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {error.customerEmail && <p className="text-danger">{error.customerEmail}</p>}
        </div>

        {!isRegister && (
          <div className="form-group mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control"
              name="customerPhoneNumber"
              value={customer.customerPhoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            {error.customerPhoneNumber && <p className="text-danger">{error.customerPhoneNumber}</p>}
          </div>
        )}

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={customer.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {error.password && <p className="text-danger">{error.password}</p>}
        </div>

        {!isRegister && (
          <div className="form-group mb-3">
            <label>Retype Password</label>
            <input
              type="password"
              className="form-control"
              name="retypePassword"
              value={customer.retypePassword}
              onChange={handleChange}
              placeholder="Retype your password"
            />
            {error.retypePassword && <p className="text-danger">{error.retypePassword}</p>}
          </div>
        )}

        {isRegister && (
          <Link to="/forgetPassword" className="text-primary text-decoration-none ms-auto mb-1">
            Forget Password?
          </Link>
        )}

        <button type="submit" className="btn btn-primary mt-3">
          {!isRegister ? "Register" : "Login"}
        </button>

        <p className="text-center mt-2">
          {!isRegister ? "Already a member? " : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: "blue", cursor: "pointer" }}
          >
            {!isRegister ? "Login" : "Register"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default CustomerAuth;
