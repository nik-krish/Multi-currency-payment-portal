// UpdateBankDetails.js
import React, { useState } from "react";
import axios from "axios";

const UpdateBankDetails = () => {
  const [bankDetails, setBankDetails] = useState({
    country: "",
    currency: "",
    routingNumber: "",
    accountNumber: "",
    accountHolderName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/update-bank-details",
        bankDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.status === "ok") {
        alert("Bank details updated successfully!");
      } else {
        alert("Error: " + response.data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  return (
    <div>
      <h2>Update Bank Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={handleChange}
        />
        <input
          type="text"
          name="currency"
          placeholder="Currency"
          onChange={handleChange}
        />
        <input
          type="text"
          name="routingNumber"
          placeholder="Routing Number"
          onChange={handleChange}
        />
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          onChange={handleChange}
        />
        <input
          type="text"
          name="accountHolderName"
          placeholder="Account Holder Name"
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateBankDetails;
