const Notification = require("../models/notificationSchema");

// CREATE a notification
exports.createNotification = async (req, res) => {
  try {
    const { recipientId, notificationType, message } = req.body;

    const notification = await Notification.create({
      recipientId,
      notificationType,
      message,
    });

    res.status(201).json({
      status: "success",
      data: { notification },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET all notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId; 

    const notifications = await Notification.find({ recipientId: userId });

    res.status(200).json({
      status: "success",
      data: { notifications },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// MARK notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      status: "success",
      data: { notification },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
