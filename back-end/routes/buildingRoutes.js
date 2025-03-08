const express = require('express');
const router = express.Router();
const buildingController = require('../controller/buildingController');

router.post('/', buildingController.createBuilding);
router.get('/', buildingController.getBuildings);
router.put('/:id', buildingController.updateBuilding);
router.put('/suspend/:id', buildingController.suspendBuilding);
router.get('/:id', buildingController.getBuildingById);
module.exports = router;
