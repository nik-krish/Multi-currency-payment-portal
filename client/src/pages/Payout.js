import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import "./payment.css";

function Payout() {
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  async function handlePayment(e) {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe is not loaded yet.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Use JWT token for authentication
        },
        body: JSON.stringify({
          amount,
          recipientEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "An error occurred while processing your payment. Please try again."
        );
        return;
      }

      const data = await response.json();
      setSuccess(true);
      console.log("Payout successful:", data.payout);
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="container">
      <h1>Make a Payout</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Payout successful!</p>}
      <form onSubmit={handlePayment}>
        <div className="form-group">
          <label>Amount (in USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Recipient Email</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn-primary">
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
}

export default Payout;
