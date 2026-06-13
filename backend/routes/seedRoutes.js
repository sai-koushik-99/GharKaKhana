const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');

router.get('/', async (req, res) => {
    if (req.query.key !== 'seed_homebite_2024') {
        return res.status(403).json({ message: 'Invalid seed key' });
    }

    try {
        let chef = await User.findOne({ role: 'chef' });
        if (!chef) {
            chef = new User({
                name: 'Sunita Devi',
                email: 'chef@homebite.com',
                password: 'HomeBite@2024',
                role: 'chef',
                phone: '9999999999',
                city: 'Hyderabad',
                speciality: 'South Indian, North Indian',
                bio: 'Authentic home-cooked meals made with love for 15 years.',
                isVerified: true,
                onboardingStep: 3
            });
            await chef.save();
        }

        // cuisine: 'South Indian' | 'North Indian' | 'Other'
        // mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Tiffin'
        const menuItems = [
            // ── SOUTH INDIAN — BREAKFAST ──
            { title: 'Idli Sambar', cuisine: 'South Indian', mealType: 'Breakfast', category: 'South Indian', dietType: 'Veg', price: 50, description: 'Soft steamed rice cakes served with coconut chutney and hot sambar.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Masala Dosa', cuisine: 'South Indian', mealType: 'Breakfast', category: 'South Indian', dietType: 'Veg', price: 80, description: 'Crispy golden crepe filled with spiced potato masala, served with chutney and sambar.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Upma', cuisine: 'South Indian', mealType: 'Breakfast', category: 'South Indian', dietType: 'Veg', price: 40, description: 'Savory semolina porridge cooked with onions, mustard seeds, and curry leaves.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Medu Vada', cuisine: 'South Indian', mealType: 'Breakfast', category: 'South Indian', dietType: 'Veg', price: 45, description: 'Crispy donut-shaped urad dal fritters, served with coconut chutney and sambar.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pongal', cuisine: 'South Indian', mealType: 'Breakfast', category: 'South Indian', dietType: 'Veg', price: 70, description: 'Comforting rice and moong dal dish seasoned with black pepper, cumin, and ghee.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },

            // ── SOUTH INDIAN — LUNCH ──
            { title: 'Sambar Rice', cuisine: 'South Indian', mealType: 'Lunch', category: 'South Indian', dietType: 'Veg', price: 75, description: 'Steamed rice mixed with tangy lentil and vegetable sambar, drizzled with ghee.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Rasam Rice', cuisine: 'South Indian', mealType: 'Lunch', category: 'South Indian', dietType: 'Veg', price: 60, description: 'Light spicy tamarind soup poured over steamed rice — a South Indian comfort classic.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Curd Rice', cuisine: 'South Indian', mealType: 'Lunch', category: 'South Indian', dietType: 'Veg', price: 50, description: 'Cooling yogurt rice tempered with mustard seeds, green chilies, and curry leaves.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Lemon Rice', cuisine: 'South Indian', mealType: 'Lunch', category: 'South Indian', dietType: 'Veg', price: 60, description: 'Tangy rice flavored with lemon juice, peanuts, and South Indian tempering.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Fish Curry Rice', cuisine: 'South Indian', mealType: 'Lunch', category: 'South Indian', dietType: 'Non-Veg', price: 180, description: 'Coastal style fish curry cooked with tamarind, coconut milk and spices — served with rice.', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60' },

            // ── SOUTH INDIAN — DINNER ──
            { title: 'Pesarattu', cuisine: 'South Indian', mealType: 'Dinner', category: 'South Indian', dietType: 'Veg', price: 70, description: 'Crispy green moong dal crepes served with ginger chutney — a nutritious Andhra specialty.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Appam & Stew', cuisine: 'South Indian', mealType: 'Dinner', category: 'South Indian', dietType: 'Veg', price: 90, description: 'Lacy rice hoppers served with a mild coconut milk vegetable stew.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chicken Chettinad', cuisine: 'South Indian', mealType: 'Dinner', category: 'South Indian', dietType: 'Non-Veg', price: 200, description: 'Bold and aromatic Chettinad-style chicken curry with freshly ground spices.', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60' },

            // ── SOUTH INDIAN — SNACK ──
            { title: 'Mirchi Bajji', cuisine: 'South Indian', mealType: 'Snack', category: 'Snacks', dietType: 'Veg', price: 40, description: 'Large green chilies stuffed with spiced potato and deep-fried in gram flour batter.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Punugulu', cuisine: 'South Indian', mealType: 'Snack', category: 'Snacks', dietType: 'Veg', price: 35, description: 'Crispy fried dough balls made from leftover dosa batter — Andhra street food classic.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Ribbon Pakoda', cuisine: 'South Indian', mealType: 'Snack', category: 'Snacks', dietType: 'Veg', price: 40, description: 'Crispy ribbon-shaped snack made from rice flour and gram flour, seasoned with spices.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },

            // ── SOUTH INDIAN — TIFFIN ──
            { title: 'Idli + Vada + Sambar', cuisine: 'South Indian', mealType: 'Tiffin', category: 'Tiffins', dietType: 'Veg', price: 90, description: 'Classic South Indian tiffin box — 2 idlis, 1 vada, sambar and chutney.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Mini Tiffin Box', cuisine: 'South Indian', mealType: 'Tiffin', category: 'Tiffins', dietType: 'Veg', price: 120, description: 'A wholesome tiffin with rice, dal, sabzi, rasam and curd — all in one box.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },

            // ── NORTH INDIAN — BREAKFAST ──
            { title: 'Aloo Paratha', cuisine: 'North Indian', mealType: 'Breakfast', category: 'North Indian', dietType: 'Veg', price: 60, description: 'Stuffed whole wheat flatbread with spiced potato filling, served with curd and pickle.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Poha', cuisine: 'North Indian', mealType: 'Breakfast', category: 'Snacks', dietType: 'Veg', price: 45, description: 'Flattened rice cooked with onions, potatoes, peanuts, turmeric and lime.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chole Bhature', cuisine: 'North Indian', mealType: 'Breakfast', category: 'North Indian', dietType: 'Veg', price: 110, description: 'Spicy chickpea curry paired with fluffy deep-fried bhature — a Punjab morning staple.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },

            // ── NORTH INDIAN — LUNCH ──
            { title: 'Rajma Chawal', cuisine: 'North Indian', mealType: 'Lunch', category: 'North Indian', dietType: 'Veg', price: 90, description: 'Comforting red kidney bean curry slow-cooked with spices, served with steamed rice.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Dal Tadka & Rice', cuisine: 'North Indian', mealType: 'Lunch', category: 'North Indian', dietType: 'Veg', price: 80, description: 'Yellow lentils tempered with ghee, cumin, garlic and dried red chilies.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Kadhi Chawal', cuisine: 'North Indian', mealType: 'Lunch', category: 'North Indian', dietType: 'Veg', price: 85, description: 'Tangy yogurt and gram flour curry with fried pakoras, served with steamed rice.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Paneer Butter Masala', cuisine: 'North Indian', mealType: 'Lunch', category: 'North Indian', dietType: 'Veg', price: 150, description: 'Tender paneer cubes in a rich, creamy tomato and butter gravy.', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chicken Biryani', cuisine: 'North Indian', mealType: 'Lunch', category: 'North Indian', dietType: 'Non-Veg', price: 220, description: 'Fragrant basmati rice layered with marinated chicken and whole spices — slow dum cooked.', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&auto=format&fit=crop&q=60' },

            // ── NORTH INDIAN — DINNER ──
            { title: 'Roti Dal Sabzi', cuisine: 'North Indian', mealType: 'Dinner', category: 'North Indian', dietType: 'Veg', price: 70, description: 'Whole wheat flatbreads served with dal and a seasonal vegetable curry.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Butter Chicken & Naan', cuisine: 'North Indian', mealType: 'Dinner', category: 'North Indian', dietType: 'Non-Veg', price: 200, description: 'Tender chicken in a silky tomato-cream sauce, served with soft butter naan.', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&auto=format&fit=crop&q=60' },
            { title: 'Jeera Rice & Dal Fry', cuisine: 'North Indian', mealType: 'Dinner', category: 'North Indian', dietType: 'Veg', price: 90, description: 'Cumin flavored basmati rice paired with a well-seasoned dal fry.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },

            // ── NORTH INDIAN — SNACK ──
            { title: 'Samosa', cuisine: 'North Indian', mealType: 'Snack', category: 'Snacks', dietType: 'Veg', price: 30, description: 'Crispy golden pastry filled with spiced potatoes and peas — India\'s favourite tea snack.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pakora', cuisine: 'North Indian', mealType: 'Snack', category: 'Snacks', dietType: 'Veg', price: 40, description: 'Assorted vegetable fritters deep-fried in spiced gram flour batter.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pav Bhaji', cuisine: 'North Indian', mealType: 'Snack', category: 'Snacks', dietType: 'Veg', price: 80, description: 'Spicy mashed vegetable medley served with buttered and toasted pav buns.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Bhel Puri', cuisine: 'North Indian', mealType: 'Snack', category: 'Snacks', dietType: 'Veg', price: 50, description: 'Puffed rice tossed with sev, onion, tomato, and sweet-tangy chutneys.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },

            // ── NORTH INDIAN — TIFFIN ──
            { title: 'North Indian Tiffin Box', cuisine: 'North Indian', mealType: 'Tiffin', category: 'Tiffins', dietType: 'Veg', price: 130, description: '2 rotis, dal, sabzi, rice, salad and pickle — a complete homestyle meal.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Egg Bhurji & Roti', cuisine: 'North Indian', mealType: 'Tiffin', category: 'Tiffins', dietType: 'Non-Veg', price: 90, description: 'Spicy scrambled eggs with onion and tomato, served with soft rotis.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Veg Khichdi', cuisine: 'North Indian', mealType: 'Tiffin', category: 'Tiffins', dietType: 'Veg', price: 80, description: 'One-pot comfort meal of rice and lentils cooked with seasonal vegetables and ghee.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
        ];

        // Clear old items and reseed fresh
        await FoodItem.deleteMany({});

        let added = 0;
        for (const item of menuItems) {
            await FoodItem.create({ ...item, chefId: chef._id });
            added++;
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
            message: `Reseeded successfully. ${added} items added.`,
            total: await FoodItem.countDocuments()
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
