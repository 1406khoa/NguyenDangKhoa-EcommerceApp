const express = require("express");
const { getAllProducts } = require("../controllers/productController");

const router = express.Router();

// Route lấy danh sách sản phẩm
router.get("/", getAllProducts);

module.exports = router;
