const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect, chefOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// POST /api/upload  — accepts a single file field named "image"
router.post('/', protect, chefOrAdmin, upload.single('image'), uploadImage);

module.exports = router;
