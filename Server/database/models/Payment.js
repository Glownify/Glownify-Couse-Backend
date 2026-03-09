const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    unique: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  upiId: String,

  qrCodeImage: String, 

  paymentLink: String,

  paymentNote: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
