const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const borrowController = require('../controllers/borrowController');

// Thêm phiếu mượn sách
router.post('/', auth(['staff', 'admin']), borrowController.createBorrow);

// Trả sách
router.post('/return/:borrowId', auth(['staff']), borrowController.returnBook);

// Xem tất cả sách đã và đang mượn
router.get('/', auth(['staff','admin']), borrowController.getAllBorrows);

// Xem các sách đang mượn
router.get('/active', auth(['admin']), borrowController.getActiveBorrows);

// Lấy phiếu mượn theo id
router.get('/:id', auth(['staff','admin']), borrowController.getBorrowById);

// Xem sách đã và đang mượn của 1 user
router.get('/user/:userId', auth(['user', 'admin']), borrowController.getUserBorrows);

// Xem sách đang mượn của 1 user
router.get('/user/:userId/active', auth(['user', 'admin']), borrowController.getUserActiveBorrows);

router.put("/:id", auth(["staff", "admin"]), borrowController.updateBorrow);

// Xóa một
router.delete("/:id", auth(["staf", "admin"]), borrowController.deleteBorrow);

// Xóa tất cả
router.delete("/", auth(["staff", "admin"]), borrowController.deleteAllBorrows);

module.exports = router;
