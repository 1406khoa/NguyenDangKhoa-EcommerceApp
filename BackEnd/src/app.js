const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Routes
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/upload", require("./routes/uploadImageRoute"));

module.exports = app;
