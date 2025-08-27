const EmergencyAlert = require("../models/emergencyAlertSchema");
const User = require("../models/userSchema"); // Assuming you already have this

// Elder → Trigger SOS
exports.triggerSOS = async (req, res) => {
  try {
    const reqUser = req.user; 
    const { location } = req.body;
    

    if (reqUser.role !== "elder") {
      return res.status(403)
      .json({ message: "Only elders can trigger SOS" });
    }

    const sos = new EmergencyAlert({
      elderId: reqUser._id,
      location,
      status: "pending",
      triggeredAt: new Date(),
    });

    await sos.save();
    res.status(201).json(sos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Caregiver / Family → Get active SOS alerts for linked elders
exports.getActiveSOS = async (req, res) => {
  try {
    const reqUser = req.user;

    if (!["family", "caregiver"].includes(reqUser.role)) {
      return res.status(403).json({
        message: "Only family and caregivers can view active SOS",
      });
    }

    // Return all pending SOS for everyone
    const alerts = await EmergencyAlert.find({ status: "pending" });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//  Caregiver / Family → Respond to SOS
exports.respondToSOS = async (req, res) => {
  try {
    const reqUser = req.user;
    const { id } = req.params; // SOS alert ID
    const { notes } = req.body;

    if (!["family", "caregiver"].includes(reqUser.role)) {
      return res
        .status(403)
        .json({ message: "Only family and caregivers can respond to SOS" });
    }

    const sos = await EmergencyAlert.findById(id);
    if (!sos) 
      return res.status(404).json({ message: "SOS not found" });
    if (sos.status === "resolved")
      return res.status(400).json({ message: "SOS already resolved" });

    // Verify user is linked to this elder
    if (
      reqUser.role === "family" &&
      reqUser.linkedElder?.toString() !== sos.elderId.toString()
    ) {
      return res.status(403).json({ message: "Not linked to this elder" });
    }

    if (
      reqUser.role === "caregiver" &&
      !reqUser.assignedElders?.includes(sos.elderId.toString())
    ) {
      return res.status(403).json({ message: "Not assigned to this elder" });
    }

    sos.status = "resolved";
    sos.notes = notes || sos.notes;
    sos.notifiedUsers.push(reqUser._id);

    await sos.save();
    res.json({ message: "SOS responded", sos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin → View all SOS alerts
exports.getAllSOS = async (req, res) => {
  try {
    const reqUser = req.user;
    if (reqUser.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all SOS" });
    }

    const alerts = await EmergencyAlert.find().populate("elderId notifiedUsers");
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
