import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    if (allowedRoles && !allowedRoles.includes(user.userType)) {
      return <Navigate to="/unauthorized" />; // Redirect if role not allowed
    }
    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
