import React, { useEffect, useState } from "react";

const BASE_URL =
  "https://api.exchangeratesapi.io/v1/latest?access_key=1d14c830853b55dbe6722930a765f551&format=1";

function CurrencyConvert() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(Object.keys(data.rates)[0]);
      });
  }, []);

  const handleConversion = () => {
    if (!amount || !fromCurrency || !toCurrency) return;

    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const rate = data.rates[toCurrency] / data.rates[fromCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      })
      .catch((err) => {
        console.error("Error fetching exchange rate:", err);
        setConvertedAmount("Error fetching exchange rate");
      });
  };

  return (
    <div>
      <h2>Currency Converter</h2>
      <p>Convert currencies with ease.</p>
      <div>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencyOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        =
        <input
          type="number"
          placeholder="Changed amount"
          value={convertedAmount || ""}
          readOnly
        />
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencyOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button className="primary-button" onClick={handleConversion}>
          Convert
        </button>
      </div>
    </div>
  );
}

export default CurrencyConvert;
