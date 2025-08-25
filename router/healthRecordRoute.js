const express = require("express");
const router = express.Router();
const healthRecordController = require("../controller/healthRecordController");
const userController = require("../controller/userController");
// Create medical record for an elder
router.post("/createHealthRecord/:id", userController.protect,healthRecordController.createHealthRecord);

// Get all medical records of an elder
router.get("/getAllHealthRecords/:id", userController.protect,healthRecordController.getAllHealthRecords);

// Get single medical record
router.get("/getHealthRecord/:id/:recordId",userController.protect, healthRecordController.getHealthRecordById);

// Update a medical record
router.put("/updateHealthRecord/:id/:recordId",userController.protect, healthRecordController.updateHealthRecord);

// Delete a medical record
router.delete("/deleteHealthRecord/:id/:recordId",userController.protect, healthRecordController.deleteHealthRecord);

module.exports = router;
