const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  avatar: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  documents: [{
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      default: 'viewer'
    }
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;