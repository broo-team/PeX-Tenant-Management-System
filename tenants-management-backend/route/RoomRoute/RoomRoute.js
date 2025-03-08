
const express = require("express");
const router = express.Router();
const roomController = require("../../controller/CreateRoom/createRoom.js");



router.post("/rooms", roomController.createRoom);
router.get("/rooms/:stall_id", roomController.getRoomsByStall);

module.exports = router