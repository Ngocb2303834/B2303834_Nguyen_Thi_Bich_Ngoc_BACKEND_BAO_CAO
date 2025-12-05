const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

router.post('/', publisherController.createPublisher);
router.get('/', publisherController.getAllPublishers);
router.get('/:id', publisherController.getPublisherById);
router.put('/:id', publisherController.updatePublisher);
router.delete('/:id', publisherController.deletePublisher);
router.delete('/', publisherController.deleteAllPublishers);

module.exports = router;
