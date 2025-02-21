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

// Danh mục thể loại sản phẩm
app.use("/api/categories", require("./routes/categoryRoute"));

// Giỏ hàng
app.use("/api/cart", require("./routes/cartRoute"));

// Thanh toán
app.use("/api/payment", require("./routes/paymentRoute"));
module.exports = app;
