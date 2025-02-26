// routes/variantRoute.js
const express = require("express");
const { createVariant, getVariants } = require("../controllers/variantController");

const router = express.Router();

// POST /api/variants - Tạo biến thể mới
router.post("/", createVariant);

// GET /api/variants?productId=... - Lấy danh sách biến thể của sản phẩm
router.get("/", getVariants);

module.exports = router;
