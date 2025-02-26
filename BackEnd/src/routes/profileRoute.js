const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Lấy hồ sơ của user hiện tại
router.get("/", protect, getProfile);
// Cập nhật hồ sơ của user hiện tại
router.put("/", protect, updateProfile);

module.exports = router;
