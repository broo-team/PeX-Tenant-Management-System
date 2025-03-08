const express = require("express")


const router = express.Router()

const { registerBuilding } = require("../../controller/BuildingRegistration/buildingController")



router.post("/register-building",registerBuilding)

module.exports = router