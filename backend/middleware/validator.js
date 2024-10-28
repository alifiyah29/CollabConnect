// middleware/validator.js
const { body, validationResult } = require('express-validator');

const documentValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').optional(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  documentValidationRules,
  validate
};