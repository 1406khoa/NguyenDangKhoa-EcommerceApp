const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/images"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

module.exports = upload;
