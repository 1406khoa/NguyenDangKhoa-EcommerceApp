const express = require("express");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts); // ✅ Lấy tất cả sản phẩm
router.get("/:id", getProductById); // ✅ Lấy sản phẩm theo ID
router.post("/", createProduct); // ✅ Thêm sản phẩm mới
router.put("/:id", updateProduct); // ✅ Cập nhật sản phẩm
router.delete("/:id", deleteProduct); // ✅ Xóa sản phẩm

module.exports = router;
