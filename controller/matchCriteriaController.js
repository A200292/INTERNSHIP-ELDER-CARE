const MatchCriteria = require("../models/matchCriteriaSchema");

//  Create Match Criteria
exports.createMatchCriteria = async (req, res) => {
  try {
    const reqUser = req.user; 

    if (reqUser.role !== "caregiver") {
      return res.status(403).json({ message: "Only caregivers can create match criteria" });
    }

    const { specializations, availableDays, locations, maxEldersAssigned, notes } = req.body;

    const matchCriteria = new MatchCriteria({
      matchCriteriaId: new MatchCriteria()._id, // generate unique ObjectId
      caregiverId: reqUser._id,
      specializations,
      availableDays,
      locations,
      maxEldersAssigned,
      notes,
    });

    await matchCriteria.save();
    res.status(201).json(matchCriteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Match Criteria for logged-in caregiver
exports.getMyMatchCriteria = async (req, res) => {
  try {
    const reqUser = req.user;

    if (reqUser.role !== "caregiver") {
      return res.status(403).json({ message: "Only caregivers can view their match criteria" });
    }

    const criteria = await MatchCriteria.findOne({ caregiverId: reqUser._id });
    if (!criteria)
         return res.status(404)
        .json({ message: "No match criteria found" });

    res.json(criteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update Match Criteria
exports.updateMatchCriteria = async (req, res) => {
  try {
    const reqUser = req.user;

    if (reqUser.role !== "caregiver") {
      return res.status(403)
      .json({ message: "Only caregivers can update match criteria" });
    }

    const updates = req.body;
    const criteria = await MatchCriteria.findOneAndUpdate(
      { caregiverId: reqUser._id },
      updates,
      { new: true }
    );

    if (!criteria) return res.status(404)
        .json({ message: "Match criteria not found" });

    res.json(criteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Match Criteria
exports.deleteMatchCriteria = async (req, res) => {
  try {
    const reqUser = req.user;

    if (reqUser.role !== "caregiver") {
      return res.status(403)
      .json({ message: "Only caregivers can delete match criteria" });
    }

    const result = await MatchCriteria
    .findOneAndDelete({ caregiverId: reqUser._id });
    if (!result) return res.status(404)
        .json({ message: "Match criteria not found" });

    res.json({ message: "Match criteria deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Admin: Get all Match Criteria
exports.getAllMatchCriteria = async (req, res) => {
  try {
    const reqUser = req.user;

    if (reqUser.role !== "admin") {
      return res.status(403)
      .json({ message: "Only admin can view all match criteria" });
    }

    const allCriteria = await MatchCriteria.find();
    
    res.json(allCriteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
