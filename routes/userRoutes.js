const express = require('express');
const auth = require('../config/auth');
const { register, login, getUserById, getAllUsers} = require('../controllers/userController');

const router = express.Router();

router.get('/', auth(['admin']), getAllUsers);

// Tuyến đường POST để đăng ký người dùng mới
// Chuyển logic xử lý sang authController.register
router.post('/register', register);

// Tuyến đường POST để đăng nhập người dùng
// Chuyển logic xử lý sang authController.login
router.post('/login', login);

// Tuyến đường POST để đăng nhập người dùng
// Chuyển logic xử lý sang authController.login
router.get('/:id', auth(['user','admin']), getUserById);

module.exports = router;