const express = require("express");
const router = express.Router();
const emergencyAlertController = require("../controller/emergencyAlertController");

// Elder → Trigger SOS
router.post("/triggerSOS", emergencyAlertController.triggerSOS);

// Caregiver / Family → Get active SOS
router.get("/getActiveSOS", emergencyAlertController.getActiveSOS);

// Caregiver / Family → Respond to SOS
router.post("/SOSrespond", emergencyAlertController.respondToSOS);

// Admin → View all SOS alerts
router.get("/getAllSOS", emergencyAlertController.getAllSOS);

module.exports = router;
