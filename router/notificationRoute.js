const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");

// Create a notification
router.post("/createNotification", notificationController.createNotification);

// Get all notifications for a specific user
router.get("/getUserNotifications/:userId", notificationController.getUserNotifications);

// Mark a notification as read
router.put("/markAsRead/:id", notificationController.markAsRead);

// Delete a notification
router.delete("/deleteNotification/:id", notificationController.deleteNotification);

module.exports = router;
