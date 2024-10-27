const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  version: {
    type: Number,
    default: 1
  },
  lastEdited: {
    type: Date,
    default: Date.now
  }
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
