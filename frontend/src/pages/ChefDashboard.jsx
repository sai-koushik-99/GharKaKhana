import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import ImageWithFallback from '../components/ImageWithFallback';
import ImageUpload from '../components/ImageUpload';

const ChefDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(true);
    const [earningsLoading, setEarningsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'listings' | 'earnings'

    // New Food Item Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('South Indian');
    const [dietType, setDietType] = useState('Veg');

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Chef's Orders
                const ordersRes = await axiosInstance.get('/api/orders/cheforders');
                setOrders(ordersRes.data);

                // Fetch Chef's Food Items — filter by chefId matching logged-in user
                const foodRes = await axiosInstance.get('/api/food');
                const myFood = foodRes.data.filter(item => item.chefId?.toString() === user._id?.toString());
                setFoodItems(myFood);

                // Fetch chef profile for availability status
                const profileRes = await axiosInstance.get(`/api/chefs/${user._id}`);
                setIsAvailable(profileRes.data.chef?.isAvailable ?? true);

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Lazy-load earnings when tab is opened
    useEffect(() => {
        if (activeTab === 'earnings' && !earnings) {
            setEarningsLoading(true);
            axiosInstance.get('/api/orders/earnings')
                .then(res => { setEarnings(res.data); setEarningsLoading(false); })
                .catch(() => setEarningsLoading(false));
        }
    }, [activeTab, earnings]);

    const handleToggleAvailability = async () => {
        try {
            const { data } = await axiosInstance.put('/api/chefs/availability');
            setIsAvailable(data.isAvailable);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/api/orders/${orderId}/status`, { status: newStatus });

            // Update local state
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            const newFood = { 
                title, 
                description, 
                price: Number(price), 
                imageUrl, 
                category, 
                dietType 
            };
            const { data } = await axiosInstance.post('/api/food', newFood);

            setFoodItems([...foodItems, { ...data, chefName: user.name }]);

            // Clear form
            setTitle(''); 
            setDescription(''); 
            setPrice(''); 
            setImageUrl('');
            setCategory('South Indian');
            setDietType('Veg');
            alert('Food item added successfully!');

        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDeleteFood = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await axiosInstance.delete(`/api/food/${id}`);
            setFoodItems(foodItems.filter(item => item._id !== id));
            alert('Food item deleted successfully.');
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <div className="text-center py-16 text-brand-mid-gray font-medium">Loading dashboard...</div>;
    if (error) return <div className="text-center py-16 text-red-500 font-semibold">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-brand-border-gray/50 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-dark-brown tracking-tight">Chef Dashboard</h1>
                    <p className="text-sm text-brand-mid-gray mt-1">Kitchen overview: Manage orders and your menu listings</p>
                </div>
                {/* Availability Toggle */}
                <button
                    onClick={handleToggleAvailability}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isAvailable
                            ? 'bg-emerald-50 border-brand-veg-green/30 text-brand-veg-green hover:bg-emerald-100'
                            : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    }`}
                >
                    <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-brand-veg-green' : 'bg-red-500'}`}></span>
                    {isAvailable ? 'Open for Orders' : 'Closed Today'}
                </button>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-brand-border-gray/60 self-start">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                            activeTab === 'orders' 
                                ? 'bg-brand-orange text-white shadow-sm' 
                                : 'text-brand-mid-gray hover:text-brand-dark-brown hover:bg-brand-light-gray'
                        }`}
                    >
                        📋 Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                            activeTab === 'listings' 
                                ? 'bg-brand-orange text-white shadow-sm' 
                                : 'text-brand-mid-gray hover:text-brand-dark-brown hover:bg-brand-light-gray'
                        }`}
                    >
                        🍳 My Menu ({foodItems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('earnings')}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                            activeTab === 'earnings' 
                                ? 'bg-brand-orange text-white shadow-sm' 
                                : 'text-brand-mid-gray hover:text-brand-dark-brown hover:bg-brand-light-gray'
                        }`}
                    >
                        💰 Earnings
                    </button>
                </div>
            </div>

            {activeTab === 'orders' && (
                <div>
                    <h2 className="text-lg font-bold text-brand-dark-brown mb-5">Incoming Orders</h2>
                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-brand-border-gray/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto">
                            <span className="text-5xl block mb-4">💤</span>
                            <h3 className="text-lg font-bold text-brand-dark-brown mb-1">No Orders Yet</h3>
                            <p className="text-brand-mid-gray text-xs px-6">Any orders placed by customers for your dishes will show up here.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-brand-border-gray/50 p-6 md:p-8 card-transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="space-y-2.5 max-w-xl flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-xs font-bold text-brand-mid-gray bg-brand-light-gray px-2.5 py-1 rounded-lg">ID: {order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-xs text-brand-mid-gray font-semibold">Placed {new Date(order.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                        </div>
                                        <h3 className="text-base font-extrabold text-brand-dark-brown">Customer: {order.customerName}</h3>
                                        
                                        {/* Delivery Details */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-brand-light-gray/40 p-3.5 rounded-xl border border-brand-border-gray/30 text-xs font-semibold">
                                            <div className="flex items-start gap-1.5">
                                                <span className="text-sm">⏰</span>
                                                <div>
                                                    <span className="text-brand-mid-gray block">Deliver by:</span>
                                                    <span>{new Date(order.deliveryTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-1.5">
                                                <span className="text-sm">📍</span>
                                                <div>
                                                    <span className="text-brand-mid-gray block">Address:</span>
                                                    <span className="line-clamp-2">{order.deliveryAddress}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ordered items details */}
                                        <div>
                                            <span className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider block mb-1.5">Items</span>
                                            <ul className="space-y-1 bg-white border border-brand-border-gray/50 p-3 rounded-xl">
                                                {order.items.map((item, i) => (
                                                    <li key={i} className="text-xs font-semibold text-brand-dark-brown flex justify-between">
                                                        <span>• {item.quantity}x {item.title}</span>
                                                        <span className="text-brand-mid-gray">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:items-end gap-4 min-w-[200px] w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-brand-border-gray">
                                        <div className="text-left sm:text-right">
                                            <span className="text-xs text-brand-mid-gray font-semibold block">Total Revenue</span>
                                            <span className="text-2xl font-extrabold text-brand-orange">₹{order.totalPrice.toFixed(2)}</span>
                                            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-brand-dark-brown sm:justify-end">
                                                <span className="bg-brand-light-gray border border-brand-border-gray px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">{order.paymentMethod}</span>
                                                <span className="text-emerald-700 font-bold">Paid: ₹{order.amountPaid.toFixed(2)}</span>
                                            </div>
                                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${
                                                order.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                                order.status === 'Accepted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                                order.status === 'Completed' ? 'bg-green-50 text-green-800 border-green-200' :
                                                'bg-red-50 text-red-800 border-red-200'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        {order.status !== 'Completed' && order.status !== 'Rejected' && (
                                            <div className="flex gap-2 w-full justify-start sm:justify-end mt-2">
                                                {order.status === 'Pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(order._id, 'Accepted')} 
                                                            className="bg-brand-orange hover:bg-brand-hover-orange text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm btn-active-scale cursor-pointer"
                                                        >
                                                            Accept Order
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(order._id, 'Rejected')} 
                                                            className="bg-white border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all btn-active-scale cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'Accepted' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order._id, 'Completed')} 
                                                        className="bg-brand-veg-green hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold w-full sm:w-auto text-center transition-all shadow-sm btn-active-scale cursor-pointer"
                                                    >
                                                        ✓ Mark Completed
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'listings' && (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Add Dish Form */}
                    <div className="md:w-1/3">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-brand-border-gray/60">
                            <h2 className="text-xl font-extrabold text-brand-dark-brown mb-4 tracking-tight">Add New Dish</h2>
                            <form onSubmit={handleAddFood} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Dish Title</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        placeholder="e.g., Spicy Butter Chicken"
                                        className="appearance-none rounded-xl relative block w-full px-3.5 py-2.5 border border-brand-border-gray placeholder-gray-400 text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-semibold bg-brand-light-gray/40 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea 
                                        required 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                        placeholder="Describe the dish ingredients and taste profile..."
                                        className="appearance-none rounded-xl relative block w-full px-3.5 py-2.5 border border-brand-border-gray placeholder-gray-400 text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-semibold bg-brand-light-gray/40 transition-colors" 
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Price (₹)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        required 
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)} 
                                        placeholder="199"
                                        className="appearance-none rounded-xl relative block w-full px-3.5 py-2.5 border border-brand-border-gray placeholder-gray-400 text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm font-semibold bg-brand-light-gray/40 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Diet Type</label>
                                    <select
                                        value={dietType}
                                        onChange={(e) => setDietType(e.target.value)}
                                        className="block w-full px-3.5 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm rounded-xl bg-white cursor-pointer hover:border-brand-orange transition-colors font-semibold"
                                    >
                                        <option value="Veg">🟢 Veg</option>
                                        <option value="Non-Veg">🔴 Non-Veg</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="block w-full px-3.5 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-sm rounded-xl bg-white cursor-pointer hover:border-brand-orange transition-colors font-semibold"
                                    >
                                        <option value="North Indian">North Indian</option>
                                        <option value="South Indian">South Indian</option>
                                        <option value="Snacks">Snacks</option>
                                        <option value="Tiffins">Tiffins</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Dish Image (Optional)</label>
                                    <ImageUpload
                                        currentUrl={imageUrl}
                                        onUpload={(url) => setImageUrl(url)}
                                        label=""
                                        aspectRatio="landscape"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-brand-orange hover:bg-brand-hover-orange text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-all btn-active-scale cursor-pointer"
                                >
                                    Add Listing
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Listings Display */}
                    <div className="md:w-2/3">
                        <h2 className="text-lg font-bold text-brand-dark-brown mb-4">My Listings</h2>
                        {foodItems.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-brand-border-gray/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-brand-mid-gray text-sm">
                                You haven't listed any food items yet. Complete the form to add your first dish!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {foodItems.map(item => (
                                    <div key={item._id} className="bg-white border border-brand-border-gray/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col card-transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative group">
                                        <div className="h-44 bg-brand-light-gray relative">
                                            <ImageWithFallback 
                                                src={item.imageUrl} 
                                                alt={item.title} 
                                                dishName={item.title}
                                                className="w-full h-full object-cover" 
                                            />
                                            {item.dietType && (
                                                <div className={`absolute top-3 right-3 flex items-center justify-center w-7 h-7 bg-white rounded-lg shadow-sm border ${
                                                    item.dietType === 'Veg' ? 'border-brand-veg-green/30' : 'border-brand-nonveg-red/30'
                                                }`}>
                                                    <div className={`w-3.5 h-3.5 rounded-full ${
                                                        item.dietType === 'Veg' ? 'bg-brand-veg-green' : 'bg-brand-nonveg-red'
                                                    }`}></div>
                                                </div>
                                            )}
                                            {item.category && (
                                                <span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-wider bg-white/95 text-brand-orange px-2 py-0.5 rounded shadow-sm">
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                                    <h3 className="font-extrabold text-brand-dark-brown text-base tracking-tight line-clamp-1">{item.title}</h3>
                                                    <span className="font-extrabold text-brand-orange text-base whitespace-nowrap">₹{item.price.toFixed(2)}</span>
                                                </div>
                                                <p className="text-xs text-brand-mid-gray leading-relaxed line-clamp-2">{item.description}</p>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-brand-border-gray/50 flex justify-end">
                                                <button
                                                    onClick={() => handleDeleteFood(item._id)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                                >
                                                    🗑 Delete Listing
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'earnings' && (
                <div>
                    <h2 className="text-lg font-bold text-brand-dark-brown mb-6">Earnings Overview</h2>

                    {earningsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                            {[1,2,3].map(i => (
                                <div key={i} className="bg-white rounded-2xl border border-brand-border-gray p-6 animate-pulse">
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : earnings ? (
                        <>
                            {/* Metric Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                                {[
                                    { label: 'This Week', value: earnings.earnedThisWeek, icon: '📅' },
                                    { label: 'This Month', value: earnings.earnedThisMonth, icon: '🗓️' },
                                    { label: 'All Time', value: earnings.totalEarned, icon: '💰' },
                                ].map(card => (
                                    <div key={card.label} className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{card.icon}</span>
                                            <span className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider">{card.label}</span>
                                        </div>
                                        <p className="text-3xl font-extrabold text-brand-orange">₹{card.value.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                                <div className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                                    <p className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1">Total Orders Completed</p>
                                    <p className="text-3xl font-extrabold text-brand-dark-brown">{earnings.totalOrdersCompleted}</p>
                                </div>
                                <div className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                                    <p className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1">Best Selling Dish</p>
                                    <p className="text-xl font-extrabold text-brand-dark-brown truncate">
                                        {earnings.bestSellingDish ? `🏆 ${earnings.bestSellingDish}` : '—'}
                                    </p>
                                </div>
                            </div>

                            {/* Orders per day — last 7 days bar chart */}
                            <div className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                                <h3 className="text-sm font-bold text-brand-dark-brown mb-5">Orders — Last 7 Days</h3>
                                {earnings.last7Days && earnings.last7Days.every(d => d.orders === 0) ? (
                                    <div className="text-center py-8 text-brand-mid-gray text-sm">
                                        <span className="text-3xl block mb-2">📊</span>
                                        No completed orders in the last 7 days yet.
                                    </div>
                                ) : (
                                    <div className="flex items-end gap-2 h-32">
                                        {earnings.last7Days?.map((day, i) => {
                                            const maxOrders = Math.max(...earnings.last7Days.map(d => d.orders), 1);
                                            const heightPct = (day.orders / maxOrders) * 100;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                    <span className="text-[10px] font-bold text-brand-mid-gray">{day.orders > 0 ? day.orders : ''}</span>
                                                    <div className="w-full rounded-t-lg bg-brand-light-orange relative overflow-hidden" style={{ height: '80px' }}>
                                                        <div
                                                            className="absolute bottom-0 w-full bg-brand-orange rounded-t-lg transition-all duration-500"
                                                            style={{ height: `${heightPct}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[9px] font-semibold text-brand-mid-gray text-center leading-tight">{day.date}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-brand-border-gray/50 max-w-md mx-auto">
                            <span className="text-5xl block mb-4">📊</span>
                            <p className="text-brand-mid-gray text-sm">No earnings data yet. Complete your first order to see stats here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChefDashboard;
