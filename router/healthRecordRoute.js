const express = require("express");
const router = express.Router();
const healthRecordController = require("../controller/healthRecordController");

// Create medical record for an elder
router.post("/createHealthRecord", healthRecordController.createHealthRecord);

// Get all medical records of an elder
router.get("/getAllHealthRecords", healthRecordController.getAllHealthRecords);

// Get single medical record
router.get("/getHealthRecord/:id/:recordId", healthRecordController.getHealthRecordById);

// Update a medical record
router.put("/updateHealthRecord/:id/:recordId", healthRecordController.updateHealthRecord);

// Delete a medical record
router.delete("/deleteHealthRecord/:id/:recordId", healthRecordController.deleteHealthRecord);

module.exports = router;
