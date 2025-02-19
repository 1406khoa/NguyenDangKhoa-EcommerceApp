const express = require("express");
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addToCart); // ✅ Thêm vào giỏ hàng
router.get("/:userId", getCart); // ✅ Lấy giỏ hàng theo user
router.post("/remove", removeFromCart); // ✅ Xóa sản phẩm khỏi giỏ hàng

module.exports = router;
