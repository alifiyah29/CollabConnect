const Document = require('../models/Document');

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { content } = req.body;
    const document = await Document.findById(req.params.id);
    if (document) {
      document.content = content;
      document.version += 1;
      document.lastEdited = new Date();
      await document.save();
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
