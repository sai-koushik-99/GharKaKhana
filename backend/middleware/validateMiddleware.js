const { body, param, validationResult } = require('express-validator');

// Reusable handler — call this after your validation rules
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

// --- Auth Validators ---
const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['customer', 'chef']).withMessage('Role must be customer or chef'),
    body('phone')
        .optional()
        .isMobilePhone().withMessage('Must be a valid phone number'),
    handleValidationErrors
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// --- Food Item Validators ---
const validateFoodItem = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 500 }).withMessage('Description must be 10–500 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 1 }).withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .isIn(['North Indian', 'South Indian', 'Snacks', 'Tiffins'])
        .withMessage('Invalid category'),
    body('dietType')
        .optional()
        .isIn(['Veg', 'Non-Veg'])
        .withMessage('Diet type must be Veg or Non-Veg'),
    body('imageUrl')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Image URL must be a valid URL'),
    handleValidationErrors
];

// --- Order Validators ---
const validateOrder = [
    body('orderItems')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('orderItems.*.foodItemId')
        .notEmpty().withMessage('Each item must have a foodItemId')
        .isMongoId().withMessage('Invalid food item ID'),
    body('orderItems.*.quantity')
        .notEmpty().withMessage('Each item must have a quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('deliveryAddress')
        .trim()
        .notEmpty().withMessage('Delivery address is required')
        .isLength({ min: 10, max: 300 }).withMessage('Address must be 10–300 characters'),
    body('deliveryTime')
        .notEmpty().withMessage('Delivery time is required')
        .isISO8601().withMessage('Delivery time must be a valid date'),
    body('chefId')
        .notEmpty().withMessage('Chef ID is required')
        .isMongoId().withMessage('Invalid chef ID'),
    body('paymentMethod')
        .optional()
        .isIn(['Cash', 'Card', 'UPI']).withMessage('Payment method must be Cash, Card, or UPI'),
    body('amountPaid')
        .notEmpty().withMessage('Amount paid is required')
        .isFloat({ min: 0 }).withMessage('Amount paid must be a non-negative number'),
    handleValidationErrors
];

// --- Status Update Validator ---
const validateStatusUpdate = [
    param('id')
        .isMongoId().withMessage('Invalid order ID'),
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['Pending', 'Accepted', 'Rejected', 'Completed'])
        .withMessage('Status must be Pending, Accepted, Rejected, or Completed'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateRegister,
    validateLogin,
    validateFoodItem,
    validateOrder,
    validateStatusUpdate
};
