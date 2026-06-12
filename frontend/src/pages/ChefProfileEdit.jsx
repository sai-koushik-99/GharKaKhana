import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import ImageUpload from '../components/ImageUpload';

const ChefProfileEdit = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bio, setBio] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [city, setCity] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Load current profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/chefs/${user._id}`);
                const chef = data.chef;
                setBio(chef.bio || '');
                setSpeciality(chef.speciality || '');
                setCity(chef.city || '');
                setProfilePhoto(chef.profilePhoto || '');
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile.');
                setLoading(false);
            }
        };
        if (user?._id) fetchProfile();
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            await axiosInstance.put('/api/chefs/profile', { bio, speciality, city, profilePhoto });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/chef/dashboard" className="text-brand-mid-gray hover:text-brand-orange transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-brand-dark-brown">Edit My Profile</h1>
                    <p className="text-sm text-brand-mid-gray mt-0.5">This is what customers see on your public page</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Profile Photo */}
                <div className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                    <h2 className="text-sm font-bold text-brand-dark-brown uppercase tracking-wider mb-4">Profile Photo</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 flex-shrink-0">
                            <ImageUpload
                                currentUrl={profilePhoto}
                                onUpload={url => setProfilePhoto(url)}
                                label=""
                                aspectRatio="square"
                            />
                        </div>
                        <div className="text-sm text-brand-mid-gray leading-relaxed">
                            <p className="font-semibold text-brand-dark-brown mb-1">Your photo builds trust</p>
                            <p>Customers are more likely to order from chefs with a clear, friendly photo. Use a well-lit photo of yourself.</p>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
                    <h2 className="text-sm font-bold text-brand-dark-brown uppercase tracking-wider">About You</h2>

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
                        <p className="text-xs text-brand-mid-gray mt-1">Separate multiple specialities with commas</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">
                            About You <span className="text-brand-mid-gray font-normal normal-case">({bio.length}/300)</span>
                        </label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder='e.g. "I am Sunita from Hyderabad, cooking authentic South Indian food for 15 years. My speciality is crispy dosas and filter coffee."'
                            rows={4}
                            maxLength={300}
                            className="w-full px-3.5 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40 resize-none"
                        />
                        <p className="text-xs text-brand-mid-gray mt-1">A personal bio helps customers connect with you and builds trust.</p>
                    </div>
                </div>

                {/* Preview link */}
                <div className="bg-brand-light-orange rounded-xl p-4 border border-brand-orange/20 flex items-center justify-between">
                    <p className="text-sm text-brand-dark-brown font-semibold">See how your profile looks to customers</p>
                    <Link
                        to={`/chef/${user?._id}`}
                        target="_blank"
                        className="text-brand-orange text-sm font-bold hover:underline flex items-center gap-1"
                    >
                        Preview →
                    </Link>
                </div>

                {/* Feedback */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm font-semibold">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 border border-brand-veg-green/30 text-brand-veg-green rounded-xl p-3 text-sm font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Profile saved successfully!
                    </div>
                )}

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default ChefProfileEdit;
