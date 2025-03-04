const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    senderEmail: { type: String, required: true },
    //recipientEmail: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    currency: { type: String, required: true },
    //recipientCurrency: { type: String, required: true },
    //convertedAmount: { type: Number }, // Optional: stores the amount after conversion
    //fxRate: { type: Number },
    customer: { type: String },
    receiptUrl: { type: String, default: null },
  },
  { timestamps: true, collection: "transactions" }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
