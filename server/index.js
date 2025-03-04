const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const Transaction = require("./models/user.transaction");
const e = require("express");
const stripe = require("stripe")(
  "sk_test_51QULqI2LZAhhri0WSmbl86pr0PT82H7eA7ewDGlB0wqGXVi04We7W6jnRV7ZllWbu3F8cqvQrbuSRN9K9mVg4Ueg004kbLBt9P"
);

app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/usersdb");

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      country: req.body.country,
      userType: req.body.userType,
      bankAccountDetails: req.body.bankAccountDetails,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userType: user.userType, // Include userType in the token
      },
      "secret123"
    );

    const redirectPath = user.userType === "admin" ? "/admin" : "/dashboard";

    return res.json({ status: "ok", user: token, redirectPath });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.post("/api/pay", async (req, res) => {
  const { amount } = req.body;
  const token = req.headers.authorization;

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, "secret123");
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const senderEmail = decoded.email;

    let user = await User.findOne({ email: senderEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let customerId = user.customer;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: senderEmail,
      });
      customerId = customer.id;

      user.stripeCustomerId = customerId;

      await user.save();
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      customer: customerId,
      setup_future_usage: "off_session",
      automatic_payment_methods: { enabled: true },
    });

    const transaction = new Transaction({
      amount,
      senderEmail,

      transactionId: paymentIntent.id,
      status: paymentIntent.status,
      currency: "USD",

      customer: customerId,
    });

    await transaction.save();

    const users = new User({
      stripeCustomerId: customerId,
    });

    //await users.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process payment." });
  }
});

app.post("/api/retrieve-payment-intent", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve the PaymentIntent with the latest charge expanded
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["latest_charge"],
      }
    );

    const receiptUrl = paymentIntent.latest_charge
      ? paymentIntent.latest_charge.receipt_url
      : null;

    if (receiptUrl) {
      const transaction = await Transaction.findOne({
        transactionId: paymentIntentId,
      });

      if (transaction) {
        transaction.status = paymentIntent.status;
        transaction.receiptUrl = receiptUrl;
        await transaction.save();
      }

      if (paymentIntent.status === "succeeded") {
        res.status(200).json({
          status: "succeeded",
          paymentIntent: paymentIntent,
          receiptUrl: receiptUrl,
        });
      } else {
        res.status(400).json({ status: paymentIntent.status });
      }
    } else {
      res.status(500).json({ error: "Receipt URL not found." });
    }
  } catch (error) {
    console.error("Error retrieving PaymentIntent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Admin route to view transactions
app.get("/api/transactions", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "secret123");

  if (decoded.userType !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.get("/api/user-transactions", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, "secret123"); // Verify token and extract email
    const transactions = await Transaction.find({
      senderEmail: decoded.email,
    }).sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (err) {
    console.error("Error fetching user transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

/*app.post("/api/payout", async (req, res) => {
  const token = req.headers.authorization;
  const { amount, recipientEmail } = req.body;

  try {
    // Validate and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, "secret123");
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const senderEmail = decoded.email;

    // Fetch sender details
    const sender = await User.findOne({ email: senderEmail });
    if (!sender || !sender.stripeCustomerId) {
      return res
        .status(404)
        .json({ error: "Sender not found or not linked to Stripe" });
    }

    const getCustomerBalance = async (customerId) => {
      try {
        const charges = await stripe.charges.list({
          customer: customerId,
          limit: 100,
        });

        let balance = 0;
        charges.data.forEach((charge) => {
          if (charge.paid && !charge.refunded) {
            balance += charge.amount;
          } else if (charge.refunded) {
            balance -= charge.amount_refunded;
          }
        });

        return balance / 100; // Convert from cents to main currency unit
      } catch (error) {
        console.error("Error retrieving customer balance:", error);
        throw error;
      }
    };
    // Check sender's balance
    const customerBalance = await getCustomerBalance(sender.stripeCustomerId);
    if (amount > customerBalance) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Fetch recipient details
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    // Create or fetch a connected account for the recipient
    let stripeAccountId = recipient.stripeAccountId;
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: recipientEmail,
        country: "US", // Update based on your use case
        capabilities: {
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;

      // Save the account ID in the database
      recipient.stripeAccountId = stripeAccountId;
      await recipient.save();
    }

    // Create a transfer to the recipient's connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: "usd", // Update as required
      destination: stripeAccountId,
      description: `Payout to ${recipient.name}`,
    });

    return res.json({ status: "success", transfer });
  } catch (error) {
    console.error("Payout Error:", error);
    return res.status(500).json({ error: error.message });
  }
});*/

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
