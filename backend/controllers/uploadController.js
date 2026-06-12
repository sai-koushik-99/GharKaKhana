const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper — wraps Cloudinary's upload_stream in a Promise
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },  // cap dimensions
                    { quality: 'auto', fetch_format: 'auto' }     // auto-compress
                ]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private (chef or admin)
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Determine folder based on role
        const folder = req.user.role === 'chef'
            ? `homebite/chefs/${req.user._id}`
            : 'homebite/dishes';

        const result = await uploadToCloudinary(req.file.buffer, folder);

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadImage };
