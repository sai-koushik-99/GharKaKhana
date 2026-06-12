const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Submit a review after a completed order
// @route   POST /api/reviews
// @access  Private (customer)
const createReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;

        // Verify the order exists, belongs to this customer, and is Completed
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to review this order' });
        }
        if (order.status !== 'Completed') {
            return res.status(400).json({ message: 'You can only review completed orders' });
        }

        // Check if review already exists for this order (unique constraint)
        const existing = await Review.findOne({ orderId });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this order' });
        }

        const review = await Review.create({
            customerId: req.user._id,
            chefId: order.chefId,
            orderId,
            rating,
            comment: comment || ''
        });

        // Recalculate chef's avgRating
        const allReviews = await Review.find({ chefId: order.chefId });
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await User.findByIdAndUpdate(order.chefId, {
            avgRating: Math.round(avg * 10) / 10  // round to 1 decimal
        });

        res.status(201).json(review);
    } catch (error) {
        // Handle duplicate key error from unique index on orderId
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this order' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for a chef
// @route   GET /api/reviews/chef/:id
// @access  Public
const getChefReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ chefId: req.params.id })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 });

        const formatted = reviews.map(r => ({
            _id: r._id,
            rating: r.rating,
            comment: r.comment,
            customerName: r.customerId?.name || 'Anonymous',
            createdAt: r.createdAt
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getChefReviews };
