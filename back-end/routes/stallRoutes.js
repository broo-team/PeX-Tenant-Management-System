const express = require('express');
const router = express.Router();
const stallController = require('../controller/stallController');

router.get('/', stallController.getStalls);
router.post('/', stallController.createStall);
router.post('/:stallCode/details', stallController.updateStallDetails);
router.delete('/:stallCode', stallController.deleteStall);

module.exports = router;
