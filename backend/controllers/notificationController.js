const Notification = require('../models/Notification');

exports.getNotificationsByDocumentId = async (req, res) => {
  try {
    const notifications = await Notification.find({ documentId: req.params.id });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      documentId: req.params.id,
      message: req.body.message
    });
    const savedNotification = await newNotification.save();
    res.json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
