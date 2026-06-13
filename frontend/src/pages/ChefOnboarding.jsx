import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import ImageUpload from '../components/ImageUpload';

const STEPS = [
    { id: 1, title: 'Welcome to HomeBite 👋', subtitle: 'Your kitchen, your business' },
    { id: 2, title: 'Tell us about yourself 🙂', subtitle: 'Help customers know who is cooking for them' },
    { id: 3, title: 'Add your first dish 🍳', subtitle: 'Your menu is your storefront' },
    { id: 4, title: "You're almost live! 🎉", subtitle: 'Review your profile before going live' },
];

const ProgressBar = ({ step }) => (
    <div className="w-full bg-brand-light-gray rounded-full h-2 mb-2">
        <div
            className="bg-brand-orange h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
        ></div>
    </div>
);

const ChefOnboarding = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Step 2 — profile fields
    const [bio, setBio] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [city, setCity] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');

    // Step 3 — first dish fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [cuisine, setCuisine] = useState('South Indian');
    const [mealType, setMealType] = useState('Lunch');
    const [dietType, setDietType] = useState('Veg');

    const handleProfileSave = async () => {
        if (!bio.trim() || !city.trim()) {
            setError('Please fill in your bio and city.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await axiosInstance.put('/api/chefs/profile', { bio, speciality, city, profilePhoto });
            await axiosInstance.put('/api/chefs/onboarding');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDishSave = async () => {
        if (!title.trim() || !description.trim() || !price) {
            setError('Please fill in all dish fields.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await axiosInstance.post('/api/food', {
                title,
                description,
                price: Number(price),
                cuisine,
                mealType,
                dietType,
                category: cuisine
            });
            await axiosInstance.put('/api/chefs/onboarding');
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleGoLive = async () => {
        setSaving(true);
        try {
            await axiosInstance.put('/api/chefs/onboarding'); // step → 3 (live)
            navigate('/chef/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    const currentStep = STEPS[step - 1];

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider">
                            Step {step} of {STEPS.length}
                        </span>
                        <div className="flex gap-1.5">
                            {STEPS.map(s => (
                                <div
                                    key={s.id}
                                    className={`w-2 h-2 rounded-full transition-all ${s.id <= step ? 'bg-brand-orange' : 'bg-brand-border-gray'}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <ProgressBar step={step} />
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-brand-border-gray shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8">
                    <h2 className="text-2xl font-extrabold text-brand-dark-brown mb-1">{currentStep.title}</h2>
                    <p className="text-sm text-brand-mid-gray mb-6">{currentStep.subtitle}</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold mb-4">
                            {error}
                        </div>
                    )}

                    {/* Step 1 — Welcome */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="text-center py-4">
                                <span className="text-7xl block mb-4">👩‍🍳</span>
                                <p className="text-brand-mid-gray text-sm leading-relaxed">
                                    Welcome, <strong className="text-brand-dark-brown">{user?.name?.split(' ')[0]}</strong>! You're just a few steps away from turning your kitchen into a business.
                                </p>
                                <ul className="mt-5 space-y-2 text-left text-sm text-brand-mid-gray">
                                    {['Fill your profile so customers trust you', 'Add your first dish to go live', 'Start receiving orders and earning'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-brand-light-orange text-brand-orange text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm"
                            >
                                Let's Get Started →
                            </button>
                        </div>
                    )}

                    {/* Step 2 — Profile */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {/* Profile photo upload */}
                            <div className="flex justify-center mb-2">
                                <div className="w-28">
                                    <ImageUpload
                                        currentUrl={profilePhoto}
                                        onUpload={(url) => setProfilePhoto(url)}
                                        label="Your Photo"
                                        aspectRatio="square"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Your City *</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    placeholder="e.g. Hyderabad"
                                    className="w-full px-3.5 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Your Speciality</label>
                                <input
                                    type="text"
                                    value={speciality}
                                    onChange={e => setSpeciality(e.target.value)}
                                    placeholder="e.g. South Indian, Biryani, Tiffins"
                                    className="w-full px-3.5 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">About You *</label>
                                <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    placeholder="e.g. I am Sunita from Hyderabad, cooking authentic South Indian food for 15 years..."
                                    rows={3}
                                    maxLength={300}
                                    className="w-full px-3.5 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40 resize-none"
                                />
                                <p className="text-xs text-brand-mid-gray text-right mt-1">{bio.length}/300</p>
                            </div>
                            <button
                                onClick={handleProfileSave}
                                disabled={saving}
                                className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm disabled:bg-gray-300"
                            >
                                {saving ? 'Saving...' : 'Save & Continue →'}
                            </button>
                        </div>
                    )}

                    {/* Step 3 — First Dish */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Dish Name *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Masala Dosa"
                                    className="w-full px-3.5 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Description *</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Describe the dish, ingredients, spice level..."
                                    rows={2}
                                    className="w-full px-3.5 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Price (₹) *</label>
                                    <input type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="150"
                                        className="w-full px-3 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Cuisine</label>
                                    <select value={cuisine} onChange={e => setCuisine(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-brand-border-gray rounded-xl text-xs font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 bg-white">
                                        <option value="South Indian">🍛 South Indian</option>
                                        <option value="North Indian">🫓 North Indian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Meal Type</label>
                                    <select value={mealType} onChange={e => setMealType(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-brand-border-gray rounded-xl text-xs font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 bg-white">
                                        <option value="Breakfast">🌅 Breakfast</option>
                                        <option value="Lunch">☀️ Lunch</option>
                                        <option value="Dinner">🌙 Dinner</option>
                                        <option value="Snack">🍟 Snack</option>
                                        <option value="Tiffin">🥗 Tiffin</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Diet</label>
                                <select value={dietType} onChange={e => setDietType(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-brand-border-gray rounded-xl text-xs font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 bg-white">
                                    <option value="Veg">🟢 Veg</option>
                                    <option value="Non-Veg">🔴 Non-Veg</option>
                                </select>
                            </div>
                            <button
                                onClick={handleDishSave}
                                disabled={saving}
                                className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm disabled:bg-gray-300"
                            >
                                {saving ? 'Adding dish...' : 'Add Dish & Continue →'}
                            </button>
                        </div>
                    )}

                    {/* Step 4 — Go Live */}
                    {step === 4 && (
                        <div className="space-y-5 text-center">
                            <span className="text-7xl block">🎉</span>
                            <div>
                                <p className="text-brand-dark-brown font-semibold text-base">
                                    You're all set, <strong>{user?.name?.split(' ')[0]}</strong>!
                                </p>
                                <p className="text-brand-mid-gray text-sm mt-2 leading-relaxed">
                                    Your profile is ready and your first dish is live. Customers can now find and order from you.
                                </p>
                            </div>
                            <div className="bg-brand-light-orange rounded-xl p-4 text-sm text-brand-dark-brown font-semibold border border-brand-orange/20">
                                Your first customer could be just around the corner 🏠
                            </div>
                            <button
                                onClick={handleGoLive}
                                disabled={saving}
                                className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm disabled:bg-gray-300"
                            >
                                {saving ? 'Setting up...' : 'Go to My Dashboard 🚀'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChefOnboarding;
