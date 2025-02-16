const express = require("express");
const upload = require("../config/multerConfig");
const { uploadImage } = require("../controllers/uploadImageController");

const router = express.Router();

// Route upload ảnh
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
