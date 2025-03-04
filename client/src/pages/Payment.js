import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./payment.css";

function Payment() {
  const [amount, setAmount] = useState("");
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
      // Initiate payment and get client secret and transaction ID from the backend
      const senderCurrency = "USD";
      const response = await fetch("http://localhost:3001/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // JWT token
        },
        body: JSON.stringify({
          amount,
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

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        console.error("Stripe error:", stripeError);
        setError("Payment confirmation failed. Please try again.");
      } else if (paymentIntent.status === "succeeded") {
        await fetch("http://localhost:3001/api/retrieve-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"), // JWT token
          },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        setSuccess(true);
        navigate("/payment-success");
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        "An error occurred while processing your payment. Please try again."
      );
    }
  }

  return (
    <div className="container">
      <h1>Make a Payment</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Payment successful!</p>}
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
          <label>Card Details</label>
          <div className="card-element-container">
            <CardElement />
          </div>
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

export default Payment;
