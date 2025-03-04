import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";
import CurrencyConvert from "./CurrencyConvert"; // Correct import for CurrencyConvert component

const Home = () => {
  return (
    <>
      <div className="full-width-header">
        <h1 className="title">Welcome to Payment Solutions</h1>
        <p className="subtitle">
          Convert currencies and manage your payments effortlessly
        </p>
        <div className="button-container">
          <Link to="/register" className="button primary-button">
            Register
          </Link>
          <Link to="/login" className="button primary-button">
            Login
          </Link>
        </div>
      </div>
      <div className="container">
        <main className="text-center mt-4">
          <div>
            <CurrencyConvert /> {/* Correct usage of component name */}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
