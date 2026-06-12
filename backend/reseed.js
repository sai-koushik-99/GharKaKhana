const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const seedMenuItems = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gharkakhana');
        console.log('Connected to MongoDB');

        await FoodItem.deleteMany({});
        console.log('Cleared existing food items');

        let chef = await User.findOne({ role: 'chef' });

        const menuItems = [
            // South Indian
            { title: 'Idli', description: 'Soft steamed rice and lentil cakes.', price: 40, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1565557612117-64906f2cf2de?w=500&auto=format&fit=crop&q=60' },
            { title: 'Masala Dosa', description: 'Crispy crepe filled with potato curry.', price: 80, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pongal', description: 'Comforting South Indian dish made with rice.', price: 60, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1517244453412-1f4886617a22?w=500&auto=format&fit=crop&q=60' },
            { title: 'Lemon Rice', description: 'Tangy and flavorful rice tempered with mustard seeds.', price: 70, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1605680197775-5202d6dc31a1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Curd Rice', description: 'Soothing mixture of yogurt and rice.', price: 60, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },
            { title: 'Sambar Rice', description: 'Rice cooked with flavorful lentil stew.', price: 75, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Upma', description: 'Savory semolina porridge cooked with vegetables.', price: 50, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1610192070366-02aeb740ca3f?w=500&auto=format&fit=crop&q=60' },
            { title: 'Rasam', description: 'Spicy, sweet, and sour soup-like dish.', price: 40, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=60' },
            { title: 'Medu Vada', description: 'Crispy, donut-shaped fritters made from urad dal.', price: 50, category: 'South Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1595293290685-6101cc7a4211?w=500&auto=format&fit=crop&q=60' },

            // North Indian
            { title: 'Rajma Chawal', description: 'Comforting red kidney bean curry served with rice.', price: 120, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chole Bhature', description: 'Spicy chickpea curry paired with fluffy bread.', price: 140, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=60' },
            { title: 'Aloo Paratha', description: 'Whole wheat flatbread stuffed with potatoes.', price: 60, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1565557612117-64906f2cf2de?w=500&auto=format&fit=crop&q=60' },
            { title: 'Paneer Butter Masala', description: 'Paneer cubes in a rich tomato based gravy.', price: 220, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&auto=format&fit=crop&q=60' },
            { title: 'Dal Tadka', description: 'Yellow lentils tempered with ghee, cumin.', price: 150, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=60' },
            { title: 'Jeera Rice', description: 'Basmati rice flavored with cumin seeds.', price: 110, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1517244453412-1f4886617a22?w=500&auto=format&fit=crop&q=60' },
            { title: 'Roti Sabzi', description: 'Whole wheat flatbreads served with a vegetable curry.', price: 90, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Kadhi Chawal', description: 'Yogurt and gram flour curry with rice.', price: 120, category: 'North Indian', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },

            // Snacks
            { title: 'Samosa', description: 'Crispy pastry filled with spiced potatoes.', price: 20, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pakora', description: 'Deep-fried vegetable fritters made with gram flour.', price: 40, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1626201383825-728639257aef?w=500&auto=format&fit=crop&q=60' },
            { title: 'Poha', description: 'Flattened rice cooked with onions, potatoes.', price: 50, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1595293290685-6101cc7a4211?w=500&auto=format&fit=crop&q=60' },
            { title: 'Pav Bhaji', description: 'Spicy mashed vegetable curry served with buns.', price: 100, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1583274614609-b6b66ddb40e7?w=500&auto=format&fit=crop&q=60' },
            { title: 'Bhel Puri', description: 'Tangy and spicy puffed rice snack.', price: 60, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1595293290685-6101cc7a4211?w=500&auto=format&fit=crop&q=60' },
            { title: 'Sandwich', description: 'Grilled vegetable and cheese sandwich.', price: 70, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1605680197775-5202d6dc31a1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Cutlet', description: 'Pan-fried vegetable patties.', price: 45, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1555126634-4b47c030d359?w=500&auto=format&fit=crop&q=60' },
            { title: 'Mirchi Bajji', description: 'Large green chilies stuffed and deep-fried.', price: 30, category: 'Snacks', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1626201383825-728639257aef?w=500&auto=format&fit=crop&q=60' },

            // Tiffins
            { title: 'Poori Bhaji', description: 'Deep-fried wheat bread served with mild potato curry.', price: 80, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chapati & Curry', description: 'Soft wheat flatbreads with a choice of curry.', price: 90, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
            { title: 'Veg Khichdi', description: 'Comforting one-pot dish of rice, lentils.', price: 100, category: 'Tiffins', dietType: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1517244453412-1f4886617a22?w=500&auto=format&fit=crop&q=60' },
            { title: 'Egg Bhurji & Roti', description: 'Spicy scrambled eggs served with flatbreads.', price: 120, category: 'Tiffins', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },

            // Retaining a few non-veg heavy hits from earlier
            { title: 'Fish Curry', description: 'Delicious coastal style fish curry.', price: 250, category: 'South Indian', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60' },
            { title: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with marinated chicken.', price: 280, category: 'South Indian', dietType: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&auto=format&fit=crop&q=60' }
        ];

        for (let item of menuItems) {
            const food = new FoodItem({ ...item, chefId: chef._id });
            await food.save();
        }

        console.log('Seeding completed. Exiting...');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedMenuItems();
