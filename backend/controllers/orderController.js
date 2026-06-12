const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = async (req, res) => {
    try {
        const { orderItems, deliveryAddress, chefId, deliveryTime, paymentMethod, amountPaid } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // --- Server-side price validation ---
        // Fetch each food item from DB and use DB price, never trust client-sent price
        const validatedItems = [];
        for (const item of orderItems) {
            if (!mongoose.Types.ObjectId.isValid(item.foodItemId)) {
                return res.status(400).json({ message: `Invalid food item ID: ${item.foodItemId}` });
            }
            const dbItem = await FoodItem.findById(item.foodItemId);
            if (!dbItem) {
                return res.status(400).json({ message: `Food item not found: ${item.foodItemId}` });
            }
            if (!item.quantity || item.quantity < 1) {
                return res.status(400).json({ message: 'Quantity must be at least 1' });
            }
            validatedItems.push({
                foodItemId: dbItem._id,
                quantity: parseInt(item.quantity),
                price: dbItem.price  // Always use DB price
            });
        }

        const totalPrice = validatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        if (amountPaid < totalPrice * 0.25) {
            return res.status(400).json({ message: 'Must pay at least 25% of total amount beforehand' });
        }

        const order = new Order({
            customerId: req.user._id,
            chefId,
            items: validatedItems,
            deliveryAddress,
            deliveryTime,
            paymentMethod: paymentMethod || 'Cash',
            amountPaid: amountPaid || 0,
            totalPrice,
            status: 'Pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/myorders
// @access  Private/Customer
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id })
            .populate('chefId', 'name') // Only fetching chef's name
            .populate('items.foodItemId', 'title imageUrl');

        // Format to strictly enforce privacy
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            items: order.items.map(item => ({
                title: item.foodItemId?.title || 'Unknown Item',
                imageUrl: item.foodItemId?.imageUrl,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: order.totalPrice,
            status: order.status,
            deliveryAddress: order.deliveryAddress, // Customer can see their own
            deliveryTime: order.deliveryTime,
            paymentMethod: order.paymentMethod,
            amountPaid: order.amountPaid,
            chefName: order.chefId?.name || 'Unknown',
            createdAt: order.createdAt
        }));

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders for chef
// @route   GET /api/orders/cheforders
// @access  Private/Chef
const getChefOrders = async (req, res) => {
    try {
        const orders = await Order.find({ chefId: req.user._id })
            .populate('customerId', 'name') // Only fetch customer's name, not phone/email here
            .populate('items.foodItemId', 'title');

        // Format to strictly enforce privacy - chef only sees necessary customer details
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            customerName: order.customerId?.name || 'Unknown',
            items: order.items.map(item => ({
                title: item.foodItemId?.title || 'Unknown Item',
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: order.totalPrice,
            status: order.status,
            deliveryAddress: order.deliveryAddress, // Chef needs this to deliver
            deliveryTime: order.deliveryTime,
            paymentMethod: order.paymentMethod,
            amountPaid: order.amountPaid,
            createdAt: order.createdAt
        }));

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Chef
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.chefId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this order' });
            }

            order.status = status || order.status;
            const updatedOrder = await order.save();

            // When an order is marked Completed, increment chef's totalOrders counter
            if (status === 'Completed') {
                await User.findByIdAndUpdate(order.chefId, { $inc: { totalOrders: 1 } });
            }

            res.json({ _id: updatedOrder._id, status: updatedOrder.status });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get earnings summary for logged-in chef
// @route   GET /api/orders/earnings
// @access  Private/Chef
const getEarnings = async (req, res) => {
    try {
        const chefId = req.user._id;

        const completedOrders = await Order.find({
            chefId,
            status: 'Completed'
        }).populate('items.foodItemId', 'title');

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let totalEarned = 0;
        let earnedThisWeek = 0;
        let earnedThisMonth = 0;
        const dishCount = {};

        for (const order of completedOrders) {
            totalEarned += order.totalPrice;

            const orderDate = new Date(order.createdAt);
            if (orderDate >= startOfWeek) earnedThisWeek += order.totalPrice;
            if (orderDate >= startOfMonth) earnedThisMonth += order.totalPrice;

            // Count dish occurrences for best-selling dish
            for (const item of order.items) {
                const title = item.foodItemId?.title || 'Unknown';
                dishCount[title] = (dishCount[title] || 0) + item.quantity;
            }
        }

        // Best-selling dish
        const bestSellingDish = Object.entries(dishCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        // Orders per day for last 7 days (for bar chart)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const day = new Date(now);
            day.setDate(now.getDate() - i);
            day.setHours(0, 0, 0, 0);
            const nextDay = new Date(day);
            nextDay.setDate(day.getDate() + 1);

            const count = completedOrders.filter(o => {
                const d = new Date(o.createdAt);
                return d >= day && d < nextDay;
            }).length;

            last7Days.push({
                date: day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
                orders: count
            });
        }

        res.json({
            totalEarned: Math.round(totalEarned * 100) / 100,
            earnedThisWeek: Math.round(earnedThisWeek * 100) / 100,
            earnedThisMonth: Math.round(earnedThisMonth * 100) / 100,
            totalOrdersCompleted: completedOrders.length,
            bestSellingDish,
            last7Days
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getChefOrders,
    updateOrderStatus,
    getEarnings
};
