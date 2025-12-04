const mongoose = require('mongoose');

const sanitizeInput = (req, res, next) => {
  // Remove any potential NoSQL injection attempts
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key].constructor === Object) {
            sanitize(obj[key]);
          }
        } else if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(/[<>]/g, '');
        }
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

module.exports = { sanitizeInput, validateObjectId };