const express = require('express');
const {
    getFoodItems,
    getFoodItemById,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodController');
const { protect, chefOrAdmin } = require('../middleware/authMiddleware');
const { validateFoodItem } = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
    .get(getFoodItems)
    .post(protect, chefOrAdmin, validateFoodItem, createFoodItem);

router.route('/:id')
    .get(getFoodItemById)
    .put(protect, chefOrAdmin, validateFoodItem, updateFoodItem)
    .delete(protect, chefOrAdmin, deleteFoodItem);

module.exports = router;
