const express = require("express");
const {
  getNotificationsByDocumentId,
  createNotification,
} = require("../controllers/notificationController");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");

router.get("/:id", isAuthenticated, getNotificationsByDocumentId);
router.post("/:id", isAuthenticated, createNotification);

module.exports = router;
