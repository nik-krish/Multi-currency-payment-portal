// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/User";
import Admin from "./pages/Admin";
import Payment from "./pages/Payment"; // Updated with Elements provider
import Home from "./pages/Home";
import PaymentSuccess from "./pages/PaymentSuccess";

import ProtectedRoute from "./ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import Payout from "./pages/Payout";

const stripePromise = loadStripe(
  "pk_test_51QULqI2LZAhhri0Wxc1cCpSYst18n1PaM2Yx7Ey3rHYv1Wcc7VnzQm8hB33Dey5x419PYoJn0kMTqpjyp7RxG5MZ00EuALDpLK"
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedUserTypes={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route
          path="/pay"
          element={
            <Elements stripe={stripePromise}>
              <Payment />
            </Elements>
          }
        />
        <Route
          path="/payout"
          element={
            <Elements stripe={stripePromise}>
              <Payout />
            </Elements>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
