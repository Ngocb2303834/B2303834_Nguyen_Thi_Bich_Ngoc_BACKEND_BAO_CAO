const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Không có token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token không hợp lệ", token });
  }
}
router.get("/", authMiddleware, (req, res) => {
  const { role } = req.user;

  if (!role) {
    return res.status(400).json({ msg: "Không tìm thấy role" });
  }
  res.json({ userRole: role});
});

module.exports = router;
