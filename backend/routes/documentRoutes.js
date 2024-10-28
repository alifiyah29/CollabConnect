const express = require('express');
const Document = require('../models/Document');
const { getDocumentById, updateDocument } = require('../controllers/documentController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

// Route to get all documents
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a single document by ID
router.get('/:id', isAuthenticated, getDocumentById);

// Route to create a new document
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, content = '' } = req.body;
    const newDocument = new Document({
      title,
      content,
      owner: req.user._id,
    });
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error });
  }
});

// Route to update a document by ID
router.put('/:id', isAuthenticated, updateDocument);

// Route to delete a document by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Ensure only the document owner can delete
    if (!document.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await document.remove();
    res.status(200).json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
});

module.exports = router;
