const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'chef', 'admin'], required: true },
    address: { type: String, required: false },
    phone: { type: String, required: false },

    // --- Chef profile fields (Phase 2) ---
    profilePhoto:   { type: String, default: '' },           // Cloudinary URL
    bio:            { type: String, maxlength: 300, default: '' },
    speciality:     { type: String, default: '' },           // e.g. "South Indian, Biryani"
    city:           { type: String, default: '' },
    isVerified:     { type: Boolean, default: false },
    isAvailable:    { type: Boolean, default: true },
    totalOrders:    { type: Number, default: 0 },            // auto-incremented on order completion
    avgRating:      { type: Number, default: 0 },            // recalculated on each new review

    // --- Onboarding status (Phase 2) ---
    // 0 = just registered, 1 = profile filled, 2 = first dish added, 3 = live
    onboardingStep: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Indexes for performance
userSchema.index({ city: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
