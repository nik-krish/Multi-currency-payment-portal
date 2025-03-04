import React from "react";
import ReactDOM from "react-dom/client"; // Ensure you're importing from 'react-dom/client'
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // Use createRoot
root.render(<App />);
