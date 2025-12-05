const express = require('express');
const auth = require('../config/auth');
const { register, login, getUserById, getAllUsers} = require('../controllers/userController');

const router = express.Router();

router.get('/', auth(['admin']), getAllUsers);
router.post('/register', register);
router.post('/login', login);
router.get('/:id', auth(['user','admin']), getUserById);

module.exports = router;