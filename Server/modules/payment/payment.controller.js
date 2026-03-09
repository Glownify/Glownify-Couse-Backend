const Payment = require("../../database/models/Payment");

exports.getPaymentDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const payment = await Payment.findOne({ Course: courseId });
    if (!payment) {
      return res.status(404).json({
        message: "Payment details not found for this course",
      });
    }
    res.status(200).json({
      message: "Payment details retrieved successfully",
      payment,
    });
  } catch (error) {
    console.error("GET PAYMENT DETAILS ERROR:", error);
    res.status(500).json({
      message: "Server error during payment details retrieval",
    });
  }
};

exports.deletePaymentDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const payment = await Payment.findOneAndDelete({ Course: courseId });
    if (!payment) {
      return res.status(404).json({
        message: "Payment details not found for this course",
      });
    }
    res.status(200).json({
      message: "Payment details deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PAYMENT DETAILS ERROR:", error);
    res.status(500).json({
      message: "Server error during payment details deletion",
    });
  }
};

exports.updatePaymentDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { upiId, qrCodeImage, paymentLink, paymentNote } = req.body;

    const payment = await Payment.findOne({ Course: courseId });

    if (!payment) {
      return res.status(404).json({
        message: "Payment details not found for this course",
      });
    }
    payment.upiId = upiId || payment.upiId;
    payment.qrCodeImage = qrCodeImage || payment.qrCodeImage;
    payment.paymentLink = paymentLink || payment.paymentLink;
    payment.paymentNote = paymentNote || payment.paymentNote;
    await payment.save();
    res.status(200).json({
      message: "Payment details updated successfully",
      payment,
    });
  } catch (error) {
    console.error("UPDATE PAYMENT DETAILS ERROR:", error);
    res.status(500).json({
      message: "Server error during payment details update",
    });
  }
};
