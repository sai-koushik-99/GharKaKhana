const express = require('express');
const {
    getChefs,
    getChefById,
    updateChefProfile,
    toggleVerifyChef,
    toggleAvailability,
    advanceOnboarding
} = require('../controllers/chefController');
const { protect, chefOnly, adminOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validateMiddleware');

const router = express.Router();

// Public
router.get('/', getChefs);

// Chef-only — MUST be defined before GET /:id to avoid Express matching "profile",
// "availability", "onboarding" as an :id param
router.put(
    '/profile',
    protect,
    chefOnly,
    [
        body('bio').optional().isLength({ max: 300 }).withMessage('Bio max 300 characters'),
        body('speciality').optional().isLength({ max: 100 }).withMessage('Speciality max 100 characters'),
        body('city').optional().isLength({ max: 60 }).withMessage('City max 60 characters'),
        body('profilePhoto').optional({ checkFalsy: true }).isURL().withMessage('Profile photo must be a valid URL'),
        handleValidationErrors
    ],
    updateChefProfile
);

router.put('/availability', protect, chefOnly, toggleAvailability);
router.put('/onboarding', protect, chefOnly, advanceOnboarding);

// Admin-only
router.put('/:id/verify', protect, adminOnly, toggleVerifyChef);

// Public — dynamic param route LAST to avoid swallowing static paths above
router.get('/:id', getChefById);

module.exports = router;
