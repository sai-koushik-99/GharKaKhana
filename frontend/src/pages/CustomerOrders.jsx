import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import ReviewModal from '../components/ReviewModal';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviewedOrders, setReviewedOrders] = useState(new Set()); // track submitted reviews
    const [activeReview, setActiveReview] = useState(null); // { orderId, chefName }

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axiosInstance.get('/api/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div className="text-center py-16 text-brand-mid-gray font-medium">Loading your orders...</div>;
    if (error) return <div className="text-center py-16 text-red-500 font-semibold">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-brand-dark-brown tracking-tight">My Orders</h1>
                <p className="text-sm text-brand-mid-gray mt-1">Track and manage your ordered homemade meals</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-brand-border-gray/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto">
                    <span className="text-5xl block mb-4">🍲</span>
                    <h3 className="text-xl font-bold text-brand-dark-brown mb-2">No Orders Yet</h3>
                    <p className="text-brand-mid-gray text-sm mb-6 px-6">You haven't ordered any delicious home-cooked meals yet. Let's find something appetizing!</p>
                    <Link to="/" className="inline-block py-2.5 px-6 rounded-xl font-bold text-white bg-brand-orange hover:bg-brand-hover-orange transition-all shadow-sm btn-active-scale cursor-pointer">
                        Discover Dishes
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => {
                        const balance = order.totalPrice - order.amountPaid;
                        const isFullyPaid = balance <= 0.01;
                        return (
                            <div key={order._id} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8 border border-brand-border-gray/50 card-transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                                {/* Card Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-brand-border-gray/60">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-bold text-brand-mid-gray bg-brand-light-gray px-2.5 py-1 rounded-lg">ID: {order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-xs text-brand-mid-gray font-semibold">Placed {new Date(order.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-sm font-bold text-brand-dark-brown flex items-center gap-1">
                                                <span>🧑‍🍳</span> Chef: {order.chefName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
                                        <span className={`inline-block text-center px-3 py-1 rounded-full text-xs font-bold border ${
                                            order.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                            order.status === 'Accepted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                            order.status === 'Completed' ? 'bg-green-50 text-green-800 border-green-200' :
                                            'bg-red-50 text-red-800 border-red-200'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <span className="font-extrabold text-lg text-brand-orange">₹{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Left: Items list */}
                                    <div className="md:col-span-2 space-y-4">
                                        <h4 className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-2">Items Ordered</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 p-2 bg-brand-light-gray/40 rounded-xl">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-brand-border-gray">
                                                        <ImageWithFallback 
                                                            src={item.imageUrl} 
                                                            alt={item.title} 
                                                            dishName={item.title} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-brand-dark-brown truncate">{item.title}</p>
                                                        <p className="text-xs font-semibold text-brand-mid-gray">₹{item.price.toFixed(2)} × {item.quantity}</p>
                                                    </div>
                                                    <div className="text-sm font-extrabold text-brand-dark-brown pr-2">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Delivery & Payment Details */}
                                    <div className="bg-brand-light-gray/30 rounded-xl p-4 md:p-5 border border-brand-border-gray/30 space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-2">Delivery Details</h4>
                                            <div className="space-y-1.5 text-xs font-semibold text-brand-dark-brown">
                                                <div className="flex items-start gap-1.5">
                                                    <span className="text-sm">⏰</span>
                                                    <div>
                                                        <span className="text-brand-mid-gray">Delivery:</span>{' '}
                                                        {new Date(order.deliveryTime).toLocaleString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-1.5">
                                                    <span className="text-sm">📍</span>
                                                    <div>
                                                        <span className="text-brand-mid-gray">Address:</span>{' '}
                                                        <span className="line-clamp-2">{order.deliveryAddress}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-brand-border-gray/50">
                                            <h4 className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-2">Payment Details</h4>
                                            <div className="space-y-2.5">
                                                <div className="flex justify-between text-xs font-semibold text-brand-dark-brown">
                                                    <span className="text-brand-mid-gray">Method:</span>
                                                    <span className="bg-white border border-brand-border-gray px-2 py-0.5 rounded text-[10px] uppercase font-bold">{order.paymentMethod}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-semibold text-brand-dark-brown">
                                                    <span className="text-brand-mid-gray">Paid:</span>
                                                    <span className="text-emerald-700 font-bold">₹{order.amountPaid.toFixed(2)}</span>
                                                </div>
                                                {!isFullyPaid && (
                                                    <div className="flex flex-col gap-1 p-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
                                                        <div className="flex justify-between text-xs font-bold text-amber-800">
                                                            <span>Due on Delivery:</span>
                                                            <span>₹{balance.toFixed(2)}</span>
                                                        </div>
                                                        <span className="text-[10px] text-amber-600 font-semibold">75% Cash/UPI on receipt</span>
                                                    </div>
                                                )}
                                                {isFullyPaid && (
                                                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-center text-[10px] text-emerald-700 font-bold">
                                                        ✓ FULLY PAID ONLINE
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rate this order — shown only for Completed orders not yet reviewed */}
                                {order.status === 'Completed' && !reviewedOrders.has(order._id) && (
                                    <div className="mt-5 pt-5 border-t border-brand-border-gray/50 flex justify-end">
                                        <button
                                            onClick={() => setActiveReview({ orderId: order._id, chefName: order.chefName })}
                                            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                        >
                                            <span>⭐</span> Rate this order
                                        </button>
                                    </div>
                                )}
                                {order.status === 'Completed' && reviewedOrders.has(order._id) && (
                                    <div className="mt-5 pt-5 border-t border-brand-border-gray/50 flex justify-end">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-veg-green bg-emerald-50 border border-brand-veg-green/20 px-3 py-1.5 rounded-xl">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Review submitted
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Review Modal */}
            {activeReview && (
                <ReviewModal
                    orderId={activeReview.orderId}
                    chefName={activeReview.chefName}
                    onClose={() => setActiveReview(null)}
                    onSuccess={() => {
                        setReviewedOrders(prev => new Set([...prev, activeReview.orderId]));
                        setActiveReview(null);
                    }}
                />
            )}
        </div>
    );
};

export default CustomerOrders;
