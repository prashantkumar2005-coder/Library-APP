const express = require("express");
const mongoose = require("mongoose");
const Book = require("./model/book");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const libraryRoute = require("./routes/libraryRoute");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", libraryRoute);
app.use("/auth", userRoute);

// ✅ Correct connection + server start
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});