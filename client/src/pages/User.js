import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "../components/List";
import "./dashboard.css"; // Ensure styles are in a separate CSS file

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/user-transactions",
          {
            method: "GET",
            headers: { Authorization: token },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        const formattedTransactions = data.transactions.map((transaction) => ({
          ...transaction,
          receiptUrl: (
            <a
              href={transaction.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {transaction.status}
            </a>
          ),
        }));

        setTransactions(formattedTransactions);

        const total = data.transactions.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );
        setTotalSpent(total);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user transactions:", err);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const headers = [
    { label: "Date", key: "createdAt" },
    { label: "Amount", key: "amount" },
    { label: "Status/Receipt", key: "receiptUrl" },
  ];

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">User Dashboard</h1>
        {/* Pay Button in Top-Right */}
        <button className="pay-button" onClick={() => navigate("/pay")}>
          Pay
        </button>
      </header>

      <section className="transactions-section">
        <h2>Your Transactions</h2>
        {loading ? (
          <p>Loading your transactions...</p>
        ) : (
          <>
            <p className="total-spent">
              <strong>Total Amount Spent:</strong> {totalSpent.toFixed(2)}{" "}
              {transactions[0]?.currency}
            </p>
            <List headers={headers} data={transactions} uniqueKey="_id" />
          </>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
