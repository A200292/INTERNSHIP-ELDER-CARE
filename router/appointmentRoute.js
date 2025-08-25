const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");
const userController = require("../controller/userController");
// Elder / Family
router.post("/", userController.protect,appointmentController.bookAppointment);
router.get("/my", userController.protect,appointmentController.getMyAppointments);
router.get("/elder/:elderId", userController.protect,appointmentController.getElderAppointments);

// Caregiver
router.get("/assigned",userController.protect, appointmentController.getAssignedAppointments);
router.put("/:id/status",userController.protect, appointmentController.updateAppointmentStatus);
 

// Admin
router.get("/admin/appointments",userController.protect, appointmentController.getAllAppointments);

module.exports = router;
