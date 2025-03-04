import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  // Bank account details
  const [bankCountry, setBankCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  async function registerUser(e) {
    e.preventDefault();

    if (userType === "admin" && secretKey !== "123456") {
      alert("Invalid Secret Key");
      return;
    }

    if (!name || !email || !password || !country) {
      setError("Please fill all fields");
      return;
    }

    const response = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        country,
        userType,
        bankAccountDetails: {
          country: bankCountry,
          currency,
          routingNumber,
          accountNumber,
          accountHolderName,
        },
      }),
    });

    const data = await response.json();

    if (data.status === "ok") {
      navigate("/login");
    } else {
      setError(data.error);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Register</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={registerUser} className="form">
        {/* User Type */}
        <div className="form-group">
          <label>Register as:</label>
          <div>
            <label>
              <input
                type="radio"
                name="userType"
                value="user"
                onChange={(e) => setUserType(e.target.value)}
              />
              User
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="userType"
                value="admin"
                onChange={(e) => setUserType(e.target.value)}
              />
              Admin
            </label>
          </div>
        </div>

        {/* Secret Key for Admin */}
        {userType === "admin" && (
          <div className="form-group">
            <label>Secret Key</label>
            <input
              type="text"
              placeholder="Enter Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="input"
              required
            />
          </div>
        )}

        {/* User Details */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input"
            required
          >
            <option value="" disabled>
              Select your country
            </option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="India">India</option>
          </select>
        </div>

        {/* Bank Account Details */}
        <h3>Bank Account Details</h3>
        <div className="form-group">
          <label>Bank Country</label>
          <input
            type="text"
            value={bankCountry}
            onChange={(e) => setBankCountry(e.target.value)}
            placeholder="Enter bank country"
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Currency</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="Enter currency"
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Routing Number</label>
          <input
            type="text"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            placeholder="Enter routing number"
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Account Holder Name</label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            placeholder="Enter account holder name"
            className="input"
          />
        </div>

        <div className="form-group">
          <input className="btn btn-register" type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
}

export default Register;
