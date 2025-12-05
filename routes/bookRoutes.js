const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../config/auth');

router.post('/', auth(["admin"]), bookController.addBook);
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.getBooksByName);
router.get('/:id', bookController.getBookById);
router.put('/:id', auth(["admin"]), bookController.updateBook);
router.delete('/:id', auth(["admin"]), bookController.deleteBook);
router.delete('/', auth(["admin"]), bookController.deleteAllBooks);

module.exports = router;
