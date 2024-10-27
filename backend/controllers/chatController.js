const Chat = require('../models/Chat');

exports.getChatsByDocumentId = async (req, res) => {
  try {
    const chats = await Chat.find({ documentId: req.params.id }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const newChat = new Chat({
      documentId: req.params.id,
      user: req.body.user,
      message: req.body.message
    });
    const savedChat = await newChat.save();
    res.json(savedChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
