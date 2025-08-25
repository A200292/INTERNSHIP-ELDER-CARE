const express = require("express");
const router = express.Router();
const matchCriteriaController = require("../controller/matchCriteriaController");
const userController = require("../controller/userController");
// Caregiver → Create Match Criteria
router.post("/createMatchCriteria",userController.protect, matchCriteriaController.createMatchCriteria);

// Caregiver → Get My Match Criteria
router.get("/getMyMatchCriteria", userController.protect,matchCriteriaController.getMyMatchCriteria);

// Caregiver → Update Match Criteria
router.put("/updateMatchCriteria",userController.protect, matchCriteriaController.updateMatchCriteria);

// Caregiver → Delete Match Criteria
router.delete("/deleteMatchCriteria", userController.protect,matchCriteriaController.deleteMatchCriteria);

// Admin → Get All Match Criteria
router.get("/getAllMatchCriteria", userController.protect,matchCriteriaController.getAllMatchCriteria);

module.exports = router;
