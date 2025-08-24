const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

// Elder / Family
router.post("/", appointmentController.bookAppointment);
router.get("/my", appointmentController.getMyAppointments);
router.get("/elder/:elderId", appointmentController.getElderAppointments);

// Caregiver
router.get("/assigned", appointmentController.getAssignedAppointments);
router.put("/:id/status", appointmentController.updateAppointmentStatus);
 

// Admin
router.get("/admin/appointments", appointmentController.getAllAppointments);

module.exports = router;
