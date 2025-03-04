import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css"; // Import CSS for styling
import List from "../components/List";

function Admin() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchTransactions = async () => {
    if (showTransactions) {
      setShowTransactions(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/transactions", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
        setShowTransactions(true);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const headers = [
    { label: "Transaction ID", key: "transactionId" },
    { label: "Amount (USD)", key: "amount" },
    { label: "Sender", key: "senderEmail" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="admin-container">
      <div className="dashboard-header">
        <h1 className="title">Admin Dashboard</h1>
        <div className="button-group">
          <button className="button primary-button" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="button primary-button"
            onClick={fetchTransactions}
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : showTransactions
              ? "Hide Transactions"
              : "View Transactions"}
          </button>
        </div>
      </div>
      <div className="transactions-table">
        {showTransactions && (
          <List
            headers={headers}
            data={transactions}
            uniqueKey="transactionId"
          />
        )}
      </div>
    </div>
  );
}

export default Admin;
