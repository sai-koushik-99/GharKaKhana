import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import ImageUpload from '../components/ImageUpload';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('menu');
    const [foodItems, setFoodItems] = useState([]);
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chefsLoading, setChefsLoading] = useState(false);
    const [error, setError] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('South Indian');
    const [dietType, setDietType] = useState('Veg');

    const { user } = useContext(AuthContext);

    useEffect(() => { fetchFoodItems(); }, []);

    useEffect(() => {
        if (activeTab === 'chefs' && chefs.length === 0) fetchAllChefs();
    }, [activeTab]);

    const fetchFoodItems = async () => {
        try {
            const { data } = await axiosInstance.get('/api/food');
            setFoodItems(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const fetchAllChefs = async () => {
        setChefsLoading(true);
        try {
            const [verifiedRes, foodRes] = await Promise.all([
                axiosInstance.get('/api/chefs?limit=100'),
                axiosInstance.get('/api/food')
            ]);
            const chefMap = {};
            foodRes.data.forEach(item => {
                if (item.chefId && !chefMap[item.chefId]) {
                    chefMap[item.chefId] = { _id: item.chefId, name: item.chefName, isVerified: false };
                }
            });
            verifiedRes.data.chefs.forEach(chef => {
                chefMap[chef._id] = { ...chefMap[chef._id], ...chef };
            });
            setChefs(Object.values(chefMap));
        } catch (err) {
            console.error('Failed to load chefs:', err.message);
        } finally {
            setChefsLoading(false);
        }
    };

    const handleToggleVerify = async (chefId) => {
        try {
            const { data } = await axiosInstance.put(`/api/chefs/${chefId}/verify`);
            setChefs(prev => prev.map(c => c._id === chefId ? { ...c, isVerified: data.isVerified } : c));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const foodData = { title, description, price: Number(price), imageUrl, category, dietType };
            if (editingId) {
                await axiosInstance.put(`/api/food/${editingId}`, foodData);
            } else {
                await axiosInstance.post('/api/food', foodData);
            }
            setEditingId(null);
            setTitle(''); setDescription(''); setPrice(''); setImageUrl('');
            setCategory('South Indian'); setDietType('Veg');
            fetchFoodItems();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setTitle(item.title); setDescription(item.description);
        setPrice(item.price); setImageUrl(item.imageUrl || '');
        setCategory(item.category || 'South Indian');
        setDietType(item.dietType || 'Veg');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await axiosInstance.delete(`/api/food/${id}`);
            fetchFoodItems();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTitle(''); setDescription(''); setPrice(''); setImageUrl('');
        setCategory('South Indian'); setDietType('Veg');
    };

    if (loading) return <div className="text-center py-16 text-brand-mid-gray font-medium">Loading Admin Dashboard...</div>;
    if (error) return <div className="text-center py-16 text-red-500 font-semibold">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header + Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-brand-border-gray/50 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-dark-brown tracking-tight">Admin Dashboard</h1>
                    <p className="text-sm text-brand-mid-gray mt-1">Platform management — menu, chefs, and listings</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-brand-border-gray/60 self-start">
                    <button onClick={() => setActiveTab('menu')}
                        className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${activeTab === 'menu' ? 'bg-brand-orange text-white shadow-sm' : 'text-brand-mid-gray hover:bg-brand-light-gray'}`}>
                        🍽️ Menu ({foodItems.length})
                    </button>
                    <button onClick={() => setActiveTab('chefs')}
                        className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${activeTab === 'chefs' ? 'bg-brand-orange text-white shadow-sm' : 'text-brand-mid-gray hover:bg-brand-light-gray'}`}>
                        👩‍🍳 Chefs
                    </button>
                </div>
            </div>

            {/* ── MENU TAB ── */}
            {activeTab === 'menu' && (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Form */}
                    <div className="md:w-1/3">
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-brand-border-gray/60 sticky top-24">
                            <h2 className="text-xl font-extrabold text-brand-dark-brown mb-5">
                                {editingId ? '📝 Edit Food Item' : '➕ Add Food Item'}
                            </h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Dish Title</label>
                                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Masala Dosa"
                                        className="rounded-xl block w-full px-3.5 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-semibold bg-brand-light-gray/40" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} rows="3"
                                        placeholder="Describe ingredients, diet notes, and spice levels..."
                                        className="rounded-xl block w-full px-3.5 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-semibold bg-brand-light-gray/40" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Category</label>
                                        <select value={category} onChange={e => setCategory(e.target.value)}
                                            className="block w-full px-3 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-xs rounded-xl bg-white font-semibold">
                                            <option>South Indian</option><option>North Indian</option>
                                            <option>Snacks</option><option>Tiffins</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Diet</label>
                                        <select value={dietType} onChange={e => setDietType(e.target.value)}
                                            className="block w-full px-3 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-xs rounded-xl bg-white font-semibold">
                                            <option value="Veg">🟢 Veg</option><option value="Non-Veg">🔴 Non-Veg</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Price (₹)</label>
                                    <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} placeholder="150"
                                        className="rounded-xl block w-full px-3.5 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-sm font-semibold bg-brand-light-gray/40" />
                                </div>
                                <ImageUpload currentUrl={imageUrl} onUpload={url => setImageUrl(url)} label="Dish Image" aspectRatio="landscape" />
                                <div className="flex gap-3 pt-3 border-t border-brand-border-gray/50">
                                    <button type="submit"
                                        className="flex-1 bg-brand-orange hover:bg-brand-hover-orange text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all btn-active-scale cursor-pointer">
                                        {editingId ? 'Update Item' : 'Add Item'}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={cancelEdit}
                                            className="flex-1 bg-brand-light-gray border border-brand-border-gray text-brand-dark-brown py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Food Items List */}
                    <div className="md:w-2/3">
                        <h2 className="text-lg font-bold text-brand-dark-brown mb-5">All Items ({foodItems.length})</h2>
                        <div className="space-y-4">
                            {foodItems.map(item => (
                                <div key={item._id} className="bg-white border border-brand-border-gray/50 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center card-transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                                    <div className="w-24 h-24 bg-brand-light-gray rounded-xl overflow-hidden flex-shrink-0 border border-brand-border-gray/60">
                                        <ImageWithFallback src={item.imageUrl} alt={item.title} dishName={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-extrabold text-base text-brand-dark-brown truncate">{item.title}</h3>
                                                <div className="flex gap-2 mt-1.5">
                                                    <span className="bg-brand-light-orange text-brand-orange text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase">{item.category}</span>
                                                    <span className={`text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase ${item.dietType === 'Veg' ? 'bg-emerald-50 text-brand-veg-green' : 'bg-red-50 text-brand-nonveg-red'}`}>
                                                        {item.dietType === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-extrabold text-brand-orange text-lg">₹{item.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-brand-mid-gray mt-2 line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-end">
                                        <button onClick={() => handleEdit(item)}
                                            className="flex-1 sm:flex-initial bg-brand-light-gray border border-brand-border-gray text-brand-dark-brown px-4 py-2 rounded-xl text-xs font-bold transition-all btn-active-scale cursor-pointer">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item._id)}
                                            className="flex-1 sm:flex-initial bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all btn-active-scale cursor-pointer">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── CHEFS TAB ── */}
            {activeTab === 'chefs' && (
                <div>
                    <h2 className="text-lg font-bold text-brand-dark-brown mb-2">Chef Verification</h2>
                    <p className="text-sm text-brand-mid-gray mb-6">Verified chefs appear on the public Chefs page with a green badge.</p>

                    {chefsLoading ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="bg-white rounded-2xl border border-brand-border-gray p-4 animate-pulse flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                                    </div>
                                    <div className="w-24 h-8 bg-gray-200 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    ) : chefs.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-brand-border-gray p-12 text-center">
                            <span className="text-4xl block mb-3">👩‍🍳</span>
                            <p className="text-brand-mid-gray font-medium">No chefs registered yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {chefs.map(chef => (
                                <div key={chef._id} className="bg-white rounded-2xl border border-brand-border-gray p-4 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-shadow">
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-border-gray">
                                        {chef.profilePhoto
                                            ? <img src={chef.profilePhoto} alt={chef.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-brand-orange flex items-center justify-center text-white font-bold">{chef.name?.[0]?.toUpperCase()}</div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Link to={`/chef/${chef._id}`} className="font-bold text-brand-dark-brown hover:text-brand-orange transition-colors text-sm truncate">
                                                {chef.name}
                                            </Link>
                                            {chef.isVerified && (
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-brand-veg-green border border-brand-veg-green/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-brand-mid-gray mt-0.5">
                                            {chef.city && `📍 ${chef.city}`}{chef.city && chef.speciality && ' · '}{chef.speciality && `🍳 ${chef.speciality}`}
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-brand-mid-gray">
                                        <span>⭐ {chef.avgRating > 0 ? chef.avgRating.toFixed(1) : '—'}</span>
                                        <span>{chef.totalOrders || 0} orders</span>
                                    </div>
                                    <button onClick={() => handleToggleVerify(chef._id)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${chef.isVerified ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-emerald-50 border-brand-veg-green/30 text-brand-veg-green hover:bg-emerald-100'}`}>
                                        {chef.isVerified ? 'Unverify' : 'Verify ✓'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
