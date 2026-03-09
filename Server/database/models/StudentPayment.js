const mongoose = require("mongoose");

const StudentPaymentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "SubmittedApplication", required: true },
  
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  amount: Number,
  method: String, 

  proofUrl: String,
  note: String,

  status: {
    type: String,
    enum: ["submitted", "verified", "rejected"],
    default: "submitted"
  },

  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verifiedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("StudentPayment", StudentPaymentSchema);
