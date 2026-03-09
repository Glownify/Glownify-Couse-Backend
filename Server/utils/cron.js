const cron = require("node-cron");
const axios = require("axios");

// Function to ping your deployed app
const pingApp = async () => {
  try {
    const response = await axios.get("https://glownify-training-backend.onrender.com/");
    console.log("✅ Ping successful at", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("❌ Ping failed:", error.message);
  }
};

// Schedule the cron job to run every 14 minutes
cron.schedule("*/14 * * * *", () => {
  console.log("⏰ Running scheduled ping...");
  pingApp();
});

module.exports = pingApp;
