const express = require("express");
const { addToCart, getCart, removeFromCart, updateCartByQuantity } = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addToCart); // ✅ Thêm vào giỏ hàng
router.get("/:userId", getCart); // ✅ Lấy giỏ hàng theo user
router.post("/remove", removeFromCart); // ✅ Xóa sản phẩm khỏi giỏ hàng
router.post("/update", updateCartByQuantity); // ✅ Cập nhật số lượng sản phẩm trong giỏ hàng

module.exports = router;
