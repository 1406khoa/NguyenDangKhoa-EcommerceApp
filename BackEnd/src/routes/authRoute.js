const express = require("express");
const { signup, login, getProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup); // POST /api/auth/signup
router.post("/login", login);   // POST /api/auth/login
router.get("/profile", protect, getProfile); // GET /api/auth/profile

module.exports = router;
