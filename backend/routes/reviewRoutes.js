const express = require('express');
const { createReview, getChefReviews } = require('../controllers/reviewController');
const { protect, customerOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validateMiddleware');

const router = express.Router();

// Public — get all reviews for a chef
router.get('/chef/:id', getChefReviews);

// Customer-only — submit a review
router.post(
    '/',
    protect,
    customerOnly,
    [
        body('orderId').notEmpty().isMongoId().withMessage('Valid order ID is required'),
        body('rating').notEmpty().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().isLength({ max: 500 }).withMessage('Comment max 500 characters'),
        handleValidationErrors
    ],
    createReview
);

module.exports = router;
