const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const emergencyAlertController = require("../controller/emergencyAlertController");

// Elder → Trigger SOS
router.post("/triggerSOS", userController.protect,emergencyAlertController.triggerSOS);

// Caregiver / Family → Get active SOS
router.get("/getActiveSOS",userController.protect,emergencyAlertController.getActiveSOS);

// Caregiver / Family → Respond to SOS
router.post("/SOSrespond/:id", userController.protect,emergencyAlertController.respondToSOS);

// Admin → View all SOS alerts
router.get("/getAllSOS", userController.protect,emergencyAlertController.getAllSOS);

module.exports = router;
