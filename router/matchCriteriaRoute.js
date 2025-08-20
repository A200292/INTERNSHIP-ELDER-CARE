const express = require("express");
const router = express.Router();
const matchCriteriaController = require("../controller/matchCriteriaController");

// Caregiver → Create Match Criteria
router.post("/createMatchCriteria", matchCriteriaController.createMatchCriteria);

// Caregiver → Get My Match Criteria
router.get("/getMyMatchCriteria", matchCriteriaController.getMyMatchCriteria);

// Caregiver → Update Match Criteria
router.put("/updateMatchCriteria", matchCriteriaController.updateMatchCriteria);

// Caregiver → Delete Match Criteria
router.delete("/deleteMatchCriteria", matchCriteriaController.deleteMatchCriteria);

// Admin → Get All Match Criteria
router.get("/getAllMatchCriteria", matchCriteriaController.getAllMatchCriteria);

module.exports = router;
