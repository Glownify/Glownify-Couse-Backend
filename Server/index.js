const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./database/DbConnect/DbConnect");
require("./utils/cron");

connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use(cors());
app.use("/api", require("./routes"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
