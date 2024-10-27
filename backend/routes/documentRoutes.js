const express = require('express');
const Document = require('../models/Document');
const { getDocumentById, updateDocument } = require('../controllers/documentController');
const isAuthenticated = require('../middleware/auth');


const router = express.Router();

// Route to get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a single document by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const document = await Document.findById(req.params.id);
//     if (!document) return res.status(404).json({ message: 'Document not found' });
//     res.json(document);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get('/:id', getDocumentById);

// Route to create a new document
// router.post('/', async (req, res) => {
//   const { title, content } = req.body;
//   const document = new Document({ title, content });
//   try {
//     const newDocument = await document.save();
//     res.status(201).json(newDocument);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.put('/:id', updateDocument);

router.use(isAuthenticated);

module.exports = router;
