const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Chưa có token, không được phép truy cập" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // { userId: ... }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = { protect };
