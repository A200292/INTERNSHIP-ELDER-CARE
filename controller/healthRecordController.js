const HealthRecord = require("../models/healthRecordSchema");
const User = require("../models/userSchema"); // assuming you have a User schema

// Create Medical Record
exports.createHealthRecord = async (req, res) => {
  try {
    const { id } = req.params; // elderId
    const reqUser = req.user; // from middleware
    const { vitalSigns, medicationTaken, notes } = req.body;

    // Elder → can only create their own record
    if (reqUser.role === "elder" && reqUser._id.toString() !== id) {
      return res.status(403).json({ message: "Not allowed to create record" });
    }

    // Family → can only create for linked elder
    if (reqUser.role === "family" && reqUser.linkedElder?.toString() !== id) {
      return res
        .status(403)
        .json({ message: "Family can only create for linked elder" });
    }

    let recordData = {
      elderId: id,
      caregiverId: reqUser.role === "caregiver" ? reqUser._id : undefined,
      vitalSigns,
      medicationTaken,
      notes,
    };

    // Caregiver restriction → cannot set vitalSigns
    if (reqUser.role === "caregiver") {
      recordData = {
        elderId: id,
        caregiverId: reqUser._id,
        notes,
        medicationTaken,
      };
    }

    const newRecord = new HealthRecord(recordData);
    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get All health Records of Elder
exports.getAllHealthRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const reqUser = req.user;

    if (
      !(
        (reqUser.role === "elder" && reqUser._id.toString() === id) ||
        (reqUser.role === "family" &&
          reqUser.linkedElder?.toString() === id) ||
        reqUser.role === "caregiver" ||
        reqUser.role === "admin"
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const records = await HealthRecord.find({ elderId: id });
    res.status(200)
    .json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single health Record
exports.getHealthRecordById = async (req, res) => {
  try {
    const { id, recordId } = req.params;
    const reqUser = req.user;

    if (
      !(
        (reqUser.role === "elder" && reqUser._id.toString() === id) ||
        (reqUser.role === "family" &&
          reqUser.linkedElder?.toString() === id) ||
        reqUser.role === "caregiver" ||
        reqUser.role === "admin"
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const record = await HealthRecord.findOne({ _id: recordId, elderId: id });
    if (!record)
         return res.status(404).json({
         message: "Record not found" });

    res.status(200)
   .json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update health Record
exports.updateHealthRecord = async (req, res) => {
  try {
    const { id, recordId } = req.params;
    const reqUser = req.user;
    const { vitalSigns, medicationTaken, notes } = req.body;

    if (
      !(
        (reqUser.role === "elder" && reqUser._id.toString() === id) ||
        (reqUser.role === "family" &&
          reqUser.linkedElder?.toString() === id) ||
        reqUser.role === "caregiver" ||
        reqUser.role === "admin"
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    let updateData = { vitalSigns, medicationTaken, notes };

    // Caregiver restriction → only notes + medicationTaken
    if (reqUser.role === "caregiver") {
      updateData = { medicationTaken, notes };
    }

    const record = await HealthRecord.findOneAndUpdate(
      { _id: recordId, elderId: id },
      updateData,
      { new: true }
    );

    if (!record) return res.status(404).json({ message: "Record not found" });

    res.status(200)
   .json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete health  Record
exports.deleteHealthRecord = async (req, res) => {
  try {
    const { id, recordId } = req.params;
    const reqUser = req.user;

    // Not allowed → Family or Caregiver
    if (reqUser.role === "family" || reqUser.role === "caregiver") {
      return res.status(403).json({ message: "Not allowed to delete" });
    }

    // Elder can only delete their own
    if (reqUser.role === "elder" && reqUser._id.toString() !== id) {
      return res.status(403).json({ message: "Not allowed to delete" });
    }

    const record = await HealthRecord.findOneAndDelete({
      _id: recordId,
      elderId: id,
    });

    if (!record) return res.status(404).json({ message: "Record not found" });

    res.status(200)
    .json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
