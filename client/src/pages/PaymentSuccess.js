import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./paymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard after 2 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate]);

  return (
    <div className="success-container">
      <div className="success-message">
        <div className="success-icon">&#10004;</div> {/* Green Tick */}
        <h1>Payment Successful!</h1>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
