const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const seedMenuItems = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gharkakhana');
        console.log('Connected to MongoDB');

        let chef = await User.findOne({ role: 'chef' });
        if (!chef) {
            chef = new User({
                name: 'Master Chef',
                email: 'chef@gharkakhana.com',
                password: 'password123', // Not hashed but okay for seed dummy
                role: 'chef',
                phone: '1234567890'
            });
            await chef.save();
        }

        const menuItems = [
            // South Indian
            { title: 'Idli', description: 'Soft steamed rice and lentil cakes, served with chutney and sambar.', price: 50, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Masala Dosa', description: 'Crispy crepe made from rice and lentil batter, filled with potato curry.', price: 80, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pongal', description: 'Comforting South Indian dish made with rice, moong dal, black pepper, and cumin.', price: 70, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Lemon Rice', description: 'Tangy and flavorful rice tempered with mustard seeds, peanuts, and lemon juice.', price: 60, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Curd Rice', description: 'Soothing mixture of yogurt and rice, tempered with spices.', price: 50, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Sambar Rice', description: 'Rice cooked with flavorful lentil and vegetable stew.', price: 75, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Upma', description: 'Savory semolina porridge cooked with vegetables and spices.', price: 40, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Rasam', description: 'Spicy, sweet, and sour soup-like dish made with tamarind, tomatoes, and spices.', price: 40, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Medu Vada', description: 'Crispy, donut-shaped fritters made from urad dal.', price: 45, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },

            // North Indian
            { title: 'Rajma Chawal', description: 'Comforting red kidney bean curry served with steamed basmati rice.', price: 90, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chole Bhature', description: 'Spicy chickpea curry paired with fluffy deep-fried bread.', price: 110, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Aloo Paratha', description: 'Whole wheat flatbread stuffed with a spicy potato mixture.', price: 60, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Paneer Butter Masala', description: 'Paneer cubes in a rich and creamy tomato based gravy.', price: 150, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&auto=format&fit=crop&q=60' },
            { title: 'Dal Tadka', description: 'Yellow lentils tempered with ghee, cumin, garlic, and chilies.', price: 80, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Jeera Rice', description: 'Basmati rice flavored with cumin seeds and whole spices.', price: 70, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Roti Sabzi', description: 'Whole wheat flatbreads served with a seasonal vegetable curry.', price: 60, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Kadhi Chawal', description: 'Yogurt and gram flour curry with pakoras, served with rice.', price: 85, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },

            // Snacks
            { title: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas.', price: 30, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pakora', description: 'Deep-fried vegetable fritters made with gram flour.', price: 40, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Poha', description: 'Flattened rice cooked with onions, potatoes, and peanuts.', price: 45, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pav Bhaji', description: 'Spicy mashed vegetable curry served with buttered bread rolls.', price: 80, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Bhel Puri', description: 'Tangy and spicy puffed rice snack with chutneys and veggies.', price: 50, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Sandwich', description: 'Grilled vegetable and cheese sandwich.', price: 60, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Cutlet', description: 'Pan-fried vegetable patties, crisp on the outside, soft inside.', price: 35, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Mirchi Bajji', description: 'Large green chilies stuffed and deep-fried in gram flour batter.', price: 40, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },

            // Tiffins
            { title: 'Poori Bhaji', description: 'Deep-fried wheat bread served with mild potato curry.', price: 70, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chapati & Curry', description: 'Soft wheat flatbreads with a choice of daily vegetable curry.', price: 65, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Veg Khichdi', description: 'Comforting one-pot dish of rice, lentils, and mixed vegetables.', price: 80, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Egg Bhurji & Roti', description: 'Spicy scrambled eggs served with soft flatbreads.', price: 90, category: 'Tiffins', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },

            // Retaining a few non-veg heavy hits from earlier just in case
            { title: 'Fish Curry', description: 'Delicious coastal style fish curry cooked with tamarind and spices.', price: 180, category: 'South Indian', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with marinated chicken and biryani masala.', price: 220, category: 'South Indian', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&auto=format&fit=crop&q=60' }
        ];

        for (let item of menuItems) {
            const existing = await FoodItem.findOne({ title: item.title });
            if (!existing) {
                const food = new FoodItem({ ...item, chefId: chef._id });
                await food.save();
                console.log(`Added ${item.title}`);
            } else {
                // Update existing items to use new INR pricing if they exist
                existing.price = item.price;
                existing.category = item.category;
                existing.dietType = item.dietType;
                await existing.save();
            }
        }

        console.log('Seeding completed. Exiting...');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedMenuItems();
