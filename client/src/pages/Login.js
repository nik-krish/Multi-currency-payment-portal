import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loginUser(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.user) {
        localStorage.setItem("token", data.user);
        navigate(data.redirectPath); // Use redirectPath from server response
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    }
  }

  return (
    <div className="container">
      <h1 className="title">Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={loginUser} className="form">
        <div className="form-group">
          <label>Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-login" type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
}

export default Login;
