const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  academyName: {
    type: String,
    required: true,
    trim: true
  },

  profession: String,
  bio: String,

  city: String,
  address: String,

  contactPhone: String,

  logo: String,
  banner: String,

  experienceYears: Number,

  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active"
  },

  documents: [
    {
      name: String,
      url: String
    }
  ],

  socialLinks: {
    instagram: String,
    youtube: String,
    website: String
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Trainer", trainerSchema);
