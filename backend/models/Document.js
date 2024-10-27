const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  version: { type: Number, default: 1 },
  lastEdited: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
