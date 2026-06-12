const express = require('express');
const {
    createOrder,
    getMyOrders,
    getChefOrders,
    updateOrderStatus,
    getEarnings
} = require('../controllers/orderController');
const { protect, customerOnly, chefOnly } = require('../middleware/authMiddleware');
const { validateOrder, validateStatusUpdate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, customerOnly, validateOrder, createOrder);

router.route('/myorders')
    .get(protect, customerOnly, getMyOrders);

router.route('/cheforders')
    .get(protect, chefOnly, getChefOrders);

// Earnings must be defined before /:id/status to avoid route conflict
router.route('/earnings')
    .get(protect, chefOnly, getEarnings);

router.route('/:id/status')
    .put(protect, chefOnly, validateStatusUpdate, updateOrderStatus);

module.exports = router;
