const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  fieldId: mongoose.Schema.Types.ObjectId,

  label: String, 

  value: mongoose.Schema.Types.Mixed,

  fileUrl: String
}, { _id: false });

const SubmittedApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["applied", "accepted", "payment_pending", "enrolled", "rejected"],
    default: "applied"
  },

  answers: [AnswerSchema]

}, { timestamps: true });

SubmittedApplicationSchema.pre("save", async function () {

  if (!this.applicationId) {

    const count = await mongoose.model("SubmittedApplication").countDocuments();

    const year = new Date().getFullYear();

    const padded = String(count + 1).padStart(4, "0");

    this.applicationId = `GLW-${year}-${padded}`;
  }

});

module.exports = mongoose.model("SubmittedApplication", SubmittedApplicationSchema);
