const express = require('express');
const auth = require('../config/auth');
const { register, login, deleteAllStaff, deleteStaff, createStaff, updateStaff, getStaffById, getAllStaff} = require('../controllers/staffController');

const router = express.Router();

router.get('/', auth(['admin']), getAllStaff);
router.post('/', auth(['admin']), createStaff);
router.put('/:id', auth(['staff', 'admin']), updateStaff);
router.delete('/:id', auth(['admin']), deleteStaff);
router.delete('/', auth(['admin']), deleteAllStaff);
router.post('/login', login);
router.get('/:id', auth(['staff', 'admin']), getStaffById);




module.exports = router;