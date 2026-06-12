const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');

// One-time seed endpoint — protected by a secret key in query param
// Example: GET /api/seed?key=seed_homebite_2024
router.get('/', async (req, res) => {
    // Simple secret key check so random people can't trigger it
    if (req.query.key !== 'seed_homebite_2024') {
        return res.status(403).json({ message: 'Invalid seed key' });
    }

    try {
        // Create or find a chef to attach food items to
        let chef = await User.findOne({ role: 'chef' });
        if (!chef) {
            chef = new User({
                name: 'Master Chef',
                email: 'chef@homebite.com',
                password: 'HomeBite@2024',
                role: 'chef',
                phone: '9999999999',
                city: 'Hyderabad',
                speciality: 'South Indian, North Indian',
                bio: 'Authentic home-cooked meals made with love.',
                isVerified: true,
                onboardingStep: 3
            });
            await chef.save();
        }

        const menuItems = [
            { title: 'Idli', description: 'Soft steamed rice and lentil cakes, served with chutney and sambar.', price: 50, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Masala Dosa', description: 'Crispy crepe made from rice and lentil batter, filled with spiced potato curry.', price: 80, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pongal', description: 'Comforting South Indian dish made with rice, moong dal, black pepper, and cumin.', price: 70, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Lemon Rice', description: 'Tangy and flavorful rice tempered with mustard seeds, peanuts, and lemon juice.', price: 60, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Curd Rice', description: 'Soothing mixture of yogurt and rice, tempered with spices.', price: 50, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Upma', description: 'Savory semolina porridge cooked with vegetables and spices.', price: 40, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Medu Vada', description: 'Crispy donut-shaped fritters made from urad dal, served with chutney.', price: 45, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Sambar Rice', description: 'Rice cooked with flavorful lentil and vegetable stew.', price: 75, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Rajma Chawal', description: 'Comforting red kidney bean curry served with steamed basmati rice.', price: 90, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chole Bhature', description: 'Spicy chickpea curry paired with fluffy deep-fried bread.', price: 110, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Aloo Paratha', description: 'Whole wheat flatbread stuffed with spicy potato mixture, served with curd.', price: 60, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Paneer Butter Masala', description: 'Paneer cubes in rich creamy tomato-based gravy, best with naan.', price: 150, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&auto=format&fit=crop&q=60' },
            { title: 'Dal Tadka', description: 'Yellow lentils tempered with ghee, cumin, garlic, and green chilies.', price: 80, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Kadhi Chawal', description: 'Yogurt and gram flour curry with pakoras, served with steamed rice.', price: 85, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Roti Sabzi', description: 'Whole wheat flatbreads served with a seasonal vegetable curry.', price: 60, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas, served hot.', price: 30, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pakora', description: 'Deep-fried vegetable fritters made with gram flour batter.', price: 40, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pav Bhaji', description: 'Spicy mashed vegetable curry served with buttered and toasted bread rolls.', price: 80, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Poha', description: 'Flattened rice cooked with onions, potatoes, peanuts and turmeric.', price: 45, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Mirchi Bajji', description: 'Large green chilies stuffed and deep-fried in spiced gram flour batter.', price: 40, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Bhel Puri', description: 'Tangy and spicy puffed rice snack mixed with chutneys and fresh vegetables.', price: 50, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Poori Bhaji', description: 'Deep-fried puffy wheat bread served with mild and comforting potato curry.', price: 70, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chapati & Curry', description: 'Soft wheat flatbreads served with the chef\'s daily special vegetable curry.', price: 65, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Veg Khichdi', description: 'Comforting one-pot dish of rice, lentils, and mixed seasonal vegetables.', price: 80, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Egg Bhurji & Roti', description: 'Spicy scrambled eggs cooked with onions and tomatoes, served with soft flatbreads.', price: 90, category: 'Tiffins', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with marinated chicken, saffron, and biryani masala.', price: 220, category: 'North Indian', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&auto=format&fit=crop&q=60' },
            { title: 'Fish Curry', description: 'Delicious coastal style fish curry cooked with tamarind, coconut and spices.', price: 180, category: 'South Indian', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60' },
        ];

        let added = 0;
        for (const item of menuItems) {
            const existing = await FoodItem.findOne({ title: item.title });
            if (!existing) {
                await FoodItem.create({ ...item, chefId: chef._id });
                added++;
            }
        }

        // Create admin if not exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const admin = new User({
                name: 'Super Admin',
                email: process.env.ADMIN_EMAIL || 'admin@homebite.com',
                password: process.env.ADMIN_PASSWORD || 'HomeBite@Admin2024',
                role: 'admin',
                phone: '0000000000'
            });
            await admin.save();
        }

        res.json({
            message: `Seeding complete. ${added} new items added.`,
            total: await FoodItem.countDocuments(),
            adminCreated: !adminExists
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
