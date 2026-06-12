const User = require('../models/User');
const FoodItem = require('../models/FoodItem');

// @desc    Get all verified chefs (public listing)
// @route   GET /api/chefs
// @access  Public
const getChefs = async (req, res) => {
    try {
        const { city, page = 1, limit = 12 } = req.query;

        const filter = { role: 'chef', isVerified: true };
        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments(filter);

        const chefs = await User.find(filter)
            .select('name profilePhoto bio speciality city isVerified avgRating totalOrders createdAt')
            .sort({ avgRating: -1, totalOrders: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            chefs,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single chef profile + their food items
// @route   GET /api/chefs/:id
// @access  Public
const getChefById = async (req, res) => {
    try {
        const chef = await User.findOne({ _id: req.params.id, role: 'chef' })
            .select('-password -email -address');

        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        const foodItems = await FoodItem.find({ chefId: chef._id });

        res.json({ chef, foodItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update own chef profile
// @route   PUT /api/chefs/profile
// @access  Private (chef)
const updateChefProfile = async (req, res) => {
    try {
        const { bio, speciality, city, profilePhoto } = req.body;

        const chef = await User.findById(req.user._id);
        if (!chef) return res.status(404).json({ message: 'User not found' });

        if (bio !== undefined)          chef.bio = bio;
        if (speciality !== undefined)   chef.speciality = speciality;
        if (city !== undefined)         chef.city = city;
        if (profilePhoto !== undefined) chef.profilePhoto = profilePhoto;

        // Advance onboarding step to 1 if still at 0
        if (chef.onboardingStep < 1) chef.onboardingStep = 1;

        const updated = await chef.save();

        res.json({
            _id: updated._id,
            name: updated.name,
            bio: updated.bio,
            speciality: updated.speciality,
            city: updated.city,
            profilePhoto: updated.profilePhoto,
            isVerified: updated.isVerified,
            isAvailable: updated.isAvailable,
            avgRating: updated.avgRating,
            totalOrders: updated.totalOrders,
            onboardingStep: updated.onboardingStep
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle chef verified status
// @route   PUT /api/chefs/:id/verify
// @access  Private (admin)
const toggleVerifyChef = async (req, res) => {
    try {
        const chef = await User.findOne({ _id: req.params.id, role: 'chef' });
        if (!chef) return res.status(404).json({ message: 'Chef not found' });

        chef.isVerified = !chef.isVerified;
        await chef.save();

        res.json({
            _id: chef._id,
            name: chef.name,
            isVerified: chef.isVerified
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle chef availability (open/closed for orders)
// @route   PUT /api/chefs/availability
// @access  Private (chef)
const toggleAvailability = async (req, res) => {
    try {
        const chef = await User.findById(req.user._id);
        if (!chef) return res.status(404).json({ message: 'User not found' });

        chef.isAvailable = !chef.isAvailable;
        await chef.save();

        res.json({ isAvailable: chef.isAvailable });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Advance chef onboarding step
// @route   PUT /api/chefs/onboarding
// @access  Private (chef)
const advanceOnboarding = async (req, res) => {
    try {
        const chef = await User.findById(req.user._id);
        if (!chef) return res.status(404).json({ message: 'User not found' });

        if (chef.onboardingStep < 3) {
            chef.onboardingStep += 1;
            await chef.save();
        }

        res.json({ onboardingStep: chef.onboardingStep });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChefs,
    getChefById,
    updateChefProfile,
    toggleVerifyChef,
    toggleAvailability,
    advanceOnboarding
};
