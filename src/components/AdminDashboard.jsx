import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Use environment variable
const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const navigate = useNavigate();

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/digitalWalletSystem/customers`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      setMessage("Failed to fetch customers");
      setMessageType("error");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/adminLogin");
  };

  // View wallet of a customer
  const handleViewWallet = async (customerId) => {
    try {
      const walletRes = await fetch(
        `${BASE_URL}/digitalWalletSystem/wallets/customer/${customerId}`
      );
      const walletData = await walletRes.json();
      setSelectedWallet(walletData);

      const transactionRes = await fetch(
        `${BASE_URL}/digitalWalletSystem/transactions/${walletData.walletId}`
      );
      const transactionData = await transactionRes.json();
      setTransactions(transactionData);

      setMessage("");
      setMessageType("");
    } catch (err) {
      setMessage("Failed to fetch wallet or transactions");
      setMessageType("error");
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (customerId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/digitalWalletSystem/customers/${customerId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMessage("Customer deleted successfully");
        setMessageType("success");
        fetchCustomers();
      } else {
        setMessage("Failed to delete customer");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server error while deleting customer");
      setMessageType("error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {message && (
        <div
          className={`alert ${
            messageType === "success" ? "alert-success" : "alert-danger"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      {!selectedWallet ? (
        <>
          <h4>Customers</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.customerId}>
                      <td>{customer.customerId}</td>
                      <td>{customer.customerName}</td>
                      <td>{customer.customerEmail}</td>
                      <td>{customer.customerPhoneNumber}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleViewWallet(customer.customerId)}
                        >
                          View Wallet
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCustomer(customer.customerId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>
          <button
            className="btn btn-secondary mb-3"
            onClick={() => setSelectedWallet(null)}
          >
            Back to Dashboard
          </button>

          <div className="card mb-3">
            <div className="card-header">Wallet Details</div>
            <div className="card-body">
              <p>
                <strong>Wallet ID:</strong> {selectedWallet.walletId}
              </p>
              <p>
                <strong>Balance:</strong> ₹{selectedWallet.balance}
              </p>
            </div>
          </div>

          <h5>Transactions</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Transaction ID</th>
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
                      <td>₹{t.amount}</td>
                      <td>{t.status}</td>
                      <td>{new Date(t.transactionTime).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
