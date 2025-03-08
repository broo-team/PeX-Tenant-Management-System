const express = require("express");
const router = express.Router();
const stallController = require("../../controller/StallController/StallController.js");




// Stall Routes
router.post("/stalls", stallController.createStall);
router.put("/stalls/:id", stallController.updateStall);





module.exports = router;
