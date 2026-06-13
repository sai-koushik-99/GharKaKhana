const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: false },
    // cuisine — the regional style (used for North Indian / South Indian filter)
    cuisine: {
        type: String,
        enum: ['North Indian', 'South Indian', 'Other'],
        default: 'South Indian'
    },
    // mealType — the type of meal (used for Snacks / Tiffins filter)
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Tiffin'],
        default: 'Lunch'
    },
    // Keep category for backward compatibility with existing data
    category: { type: String, enum: ['North Indian', 'South Indian', 'Snacks', 'Tiffins'], default: 'South Indian' },
    dietType: { type: String, enum: ['Veg', 'Non-Veg'], default: 'Veg' },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

// Indexes for performance
foodItemSchema.index({ chefId: 1 });
foodItemSchema.index({ cuisine: 1 });
foodItemSchema.index({ mealType: 1 });
foodItemSchema.index({ dietType: 1 });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;
