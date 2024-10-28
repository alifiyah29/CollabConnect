const Document = require('../models/Document');

const versionControl = {
  async saveVersion(documentId, content, userId) {
    const document = await Document.findById(documentId);
    
    document.history.push({
      content: document.content,
      version: document.version,
      editedBy: userId
    });
    
    document.content = content;
    document.version += 1;
    document.lastEdited = new Date();
    
    return document.save();
  },
  
  async getVersion(documentId, version) {
    const document = await Document.findById(documentId);
    return document.history.find(h => h.version === version);
  }
};

module.exports = versionControl;