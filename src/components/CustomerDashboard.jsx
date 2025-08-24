import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Render backend URL
const BASE_URL = "https://digital-wallet-system-backend-prg5.onrender.com";

function CustomerDashboard() {
  const [customer, setCustomer] = useState(null);
  const [wallet, setWallet] = useState({ walletId: "N/A", balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  // Redirect if not logged in
  useEffect(() => {
    if (!customerId) {
      navigate("/customerAuth");
    }
  }, [customerId, navigate]);

  const fetchDashboard = async () => {
    if (!customerId) return;

    try {
      const resCustomer = await fetch(
        `${BASE_URL}/digitalWalletSystem/customers/${customerId}`
      );
      if (!resCustomer.ok) throw new Error("Customer not found");

      const dataCustomer = await resCustomer.json();
      console.log("Customer Data:", dataCustomer);
      setCustomer(dataCustomer);

      // Wallet check
      if (dataCustomer.wallet && dataCustomer.wallet.walletId) {
        setWallet(dataCustomer.wallet);

        const resTransactions = await fetch(
          `${BASE_URL}/digitalWalletSystem/transactions/${dataCustomer.wallet.walletId}`
        );
        if (resTransactions.ok) {
          const dataTransactions = await resTransactions.json();
          console.log("Transactions:", dataTransactions);
          setTransactions(dataTransactions);
        } else {
          setTransactions([]);
        }
      } else {
        setWallet({ walletId: "N/A", balance: 0 });
        setTransactions([]);
      }
    } catch (err) {
      setMessage(err.message || "Error loading dashboard");
      setMessageType("error");
    }
  };

  const handleAdd = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage("Enter a valid amount");
      setMessageType("error");
      return;
    }
    try {
      const res = await fetch(
        `${BASE_URL}/digitalWalletSystem/wallets/add/${customerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Number(amount)),
        }
      );

      if (res.ok) {
        setMessage("Amount added successfully");
        setMessageType("success");
        setAmount("");
        fetchDashboard();
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to add amount");
        setMessageType("error");
      }
    } catch {
      setMessage("Server error");
      setMessageType("error");
    }
  };

  const handleDeduct = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage("Enter a valid amount");
      setMessageType("error");
      return;
    }
    try {
      const res = await fetch(
        `${BASE_URL}/digitalWalletSystem/wallets/deduct/${customerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Number(amount)),
        }
      );

      if (res.ok) {
        setMessage("Amount deducted successfully");
        setMessageType("success");
        setAmount("");
        fetchDashboard();
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to deduct amount");
        setMessageType("error");
      }
    } catch {
      setMessage("Server error");
      setMessageType("error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    setCustomer(null);
    setWallet({ walletId: "N/A", balance: 0 });
    setTransactions([]);
    navigate("/customerAuth");
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  if (!customer) {
    return (
      <p className="text-center mt-5">
        {messageType === "error" ? message : "Loading..."}
      </p>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Customer Dashboard</h2>

      {message && (
        <div
          className="text-center mb-4"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: messageType === "success" ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5>Welcome, {customer.customerName}</h5>
          <p>Wallet ID: {wallet?.walletId || "N/A"}</p>
          <p>Balance: ₹{wallet?.balance || 0}</p>
        </div>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/updateCustomer")}
          >
            Update Details
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="mb-3">
        <input
          type="number"
          placeholder="Enter amount"
          className="form-control mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn btn-success me-2" onClick={handleAdd}>
          Add Money
        </button>
        <button className="btn btn-warning" onClick={handleDeduct}>
          Deduct Money
        </button>
      </div>

      <div className="mt-4">
        <h5>Transactions</h5>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.transactionId}>
                  <td>{t.transactionId}</td>
                  <td>{t.transactionType}</td>
                  <td>{t.amount}</td>
                  <td>{t.status}</td>
                  <td>
                    {t.transactionTime
                      ? new Date(t.transactionTime).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerDashboard;
