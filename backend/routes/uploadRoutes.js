const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (req.file && req.file.path) {
    res.send({
      message: 'Image uploaded successfully',
      image: req.file.path,
    });
  } else {
    res.status(400);
    throw new Error('Image upload failed');
  }
});

module.exports = router;
