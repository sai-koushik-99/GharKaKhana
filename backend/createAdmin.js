const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gharkakhana');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.');
            process.exit(1);
        }

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin already exists:', adminEmail);
        } else {
            const admin = new User({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                phone: '0000000000'
            });
            await admin.save();
            console.log('Admin user created:', adminEmail);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
