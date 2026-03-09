const mongoose = require("mongoose");

async function generateApplicationId() {
  const count = await mongoose.model("SubmittedApplication").countDocuments();

  const year = new Date().getFullYear();

  const padded = String(count + 1).padStart(4, "0");

  return `GLW-${year}-${padded}`;
}

module.exports = generateApplicationId;