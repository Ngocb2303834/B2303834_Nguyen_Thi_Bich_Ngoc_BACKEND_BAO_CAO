const express = require("express");
const router = express.Router();


// Cần cài đặt: npm install bcryptjs jsonwebtoken
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Khóa bí mật JWT - phải được thay thế bằng biến môi trường trong thực tế
const { JWT_SECRET } = require('../config/jwt');


// Middleware xác thực token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Không có token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Lưu thông tin user vào request
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token không hợp lệ", token });
  }
}

// Route trả về userRole
router.get("/", authMiddleware, (req, res) => {
  // req.user chứa thông tin từ JWT
  const { role } = req.user;

  if (!role) {
    return res.status(400).json({ msg: "Không tìm thấy role" });
  }
  

  res.json({ userRole: role});
});

module.exports = router;
