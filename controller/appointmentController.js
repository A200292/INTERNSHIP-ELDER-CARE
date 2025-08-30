const Appointment = require("../models/appointmentSchema");

const User = require("../models/userSchema");
//  Elder / Family 
exports.bookAppointment = async (req, res) => {
  try {
    const { elderId, caregiverId, date } = req.body;

    if (!elderId || !caregiverId || !date) {
      return res.status(400).json({ message: "elderId, caregiverId, and date are required" });
    }

    const appointment = new Appointment({
      elderId,
      caregiverId,
      date,
      status: "pending",
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await Appointment.find({ elderId: userId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

exports.getElderAppointments = async (req, res) => {
  try {
    const { elderId } = req.params;
    const appointments = await Appointment.find({ elderId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching elder's appointments", error: error.message });
  }
};

// ================= Caregiver =================
exports.getAssignedAppointments = async (req, res) => {
  try {
    const caregiverId = req.user._id;
    const appointments = await Appointment.find({ caregiverId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned appointments", error: error.message });
  }
};

// ✅ Unified status update (accept, reject, complete)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // allowed statuses
    const allowed = ["confirmed", "rejected", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${allowed.join(", ")}` });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: `Appointment marked as ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

// ================= Admin =================
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all appointments", error: error.message });
  }
};
