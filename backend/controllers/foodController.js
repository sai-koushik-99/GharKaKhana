const FoodItem = require('../models/FoodItem');

// @desc    Fetch all food items
// @route   GET /api/food
// @access  Public
const getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find({})
            .populate('chefId', 'name') // Only fetching chef's name
            .exec();

        // Optionally format the response to avoid exposing full chef objects directly as chefId
        const formattedFood = foodItems.map(item => ({
            _id: item._id,
            title: item.title,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            category: item.category,
            dietType: item.dietType,
            chefId: item.chefId?._id,
            chefName: item.chefId?.name || 'Unknown',
            createdAt: item.createdAt
        }));

        res.json(formattedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single food item
// @route   GET /api/food/:id
// @access  Public
const getFoodItemById = async (req, res) => {
    try {
        const item = await FoodItem.findById(req.params.id)
            .populate('chefId', 'name')
            .exec();

        if (item) {
            res.json({
                _id: item._id,
                title: item.title,
                description: item.description,
                price: item.price,
                imageUrl: item.imageUrl,
                category: item.category,
                dietType: item.dietType,
                chefId: item.chefId?._id,
                chefName: item.chefId?.name || 'Unknown',
                createdAt: item.createdAt
            });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a food item
// @route   POST /api/food
// @access  Private/Chef
const createFoodItem = async (req, res) => {
    try {
        const { title, description, price, imageUrl, category, dietType } = req.body;

        const foodItem = new FoodItem({
            title,
            description,
            price,
            imageUrl,
            category: category || 'South Indian',
            dietType: dietType || 'Veg',
            chefId: req.user._id
        });

        const createdItem = await foodItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a food item
// @route   PUT /api/food/:id
// @access  Private/Chef
const updateFoodItem = async (req, res) => {
    try {
        const { title, description, price, imageUrl, category, dietType } = req.body;
        const item = await FoodItem.findById(req.params.id);

        if (item) {
            // Ensure the chef who created it is the one updating it OR the user is an admin
            if (item.chefId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this item' });
            }

            item.title = title || item.title;
            item.description = description || item.description;
            item.price = price || item.price;
            item.imageUrl = imageUrl || item.imageUrl;
            item.category = category || item.category;
            item.dietType = dietType || item.dietType;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a food item
// @route   DELETE /api/food/:id
// @access  Private/Chef
const deleteFoodItem = async (req, res) => {
    try {
        const item = await FoodItem.findById(req.params.id);

        if (item) {
            if (item.chefId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to delete this item' });
            }

            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFoodItems,
    getFoodItemById,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem
};
