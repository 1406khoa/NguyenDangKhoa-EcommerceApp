const express = require("express");
const { getAllCategories, createCategory, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getAllCategories); // ✅ Lấy tất cả danh mục
router.post("/", createCategory); // ✅ Thêm danh mục mới
router.delete("/:categoryId", deleteCategory);
module.exports = router;
