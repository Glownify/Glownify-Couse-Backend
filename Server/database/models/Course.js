const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: String,

    duration: {
      value: Number,
      unit: { type: String, enum: ["days", "weeks", "months"] },
    },

    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },

    location: {
      address: String,
      city: String,
    },

    price: {
      type: Number,
      required: true,
    },

    youwillLearn: [String],

    requirements: [String],

    startDate: Date,

    poster: String,
  },
  { timestamps: true },
);

courseSchema.index({ category: 1 });
courseSchema.index({ trainerId: 1 });
courseSchema.index({ "location.city": 1 });

module.exports = mongoose.model("Course", courseSchema);
