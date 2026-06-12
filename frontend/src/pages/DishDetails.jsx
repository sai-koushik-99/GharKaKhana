import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import ImageWithFallback from '../components/ImageWithFallback';

const DishDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [paymentOption, setPaymentOption] = useState('full'); // 'full' or 'advance'

    const [orderLoading, setOrderLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        const fetchDish = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/food/${id}`);
                setDish(data);

                // Set initial delivery time to 5 hours from now
                const defaultTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
                defaultTime.setMinutes(defaultTime.getMinutes() - defaultTime.getTimezoneOffset());
                setDeliveryTime(defaultTime.toISOString().slice(0, 16));

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchDish();
    }, [id]);

    const handleOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'customer') {
            alert('Only customers can place orders.');
            return;
        }

        const selectedTime = new Date(deliveryTime);
        const minTime = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours from now

        if (selectedTime < minTime) {
            alert('Orders must be placed at least 4 hours in advance.');
            return;
        }

        const totalPrice = dish.price * quantity;
        const amountPaid = paymentOption === 'advance' ? totalPrice * 0.25 : totalPrice;

        setOrderLoading(true);
        try {
            const orderData = {
                orderItems: [{
                    foodItemId: dish._id,
                    title: dish.title,
                    price: dish.price,
                    quantity: parseInt(quantity)
                }],
                deliveryAddress,
                deliveryTime: selectedTime.toISOString(),
                paymentMethod,
                amountPaid,
                chefId: dish.chefId
            };

            await axiosInstance.post('/api/orders', orderData);
            setOrderSuccess(true);
            setOrderLoading(false);
            setTimeout(() => navigate('/customer/orders'), 2000);

        } catch (err) {
            alert(err.response?.data?.message || err.message);
            setOrderLoading(false);
        }
    };

    if (loading) return <div className="text-center py-16 text-brand-mid-gray font-medium">Loading dish details...</div>;
    if (error) return <div className="text-center py-16 text-red-500 font-semibold">{error}</div>;
    if (!dish) return <div className="text-center py-16 text-brand-dark-brown font-bold">Dish not found</div>;

    const totalPrice = dish.price * quantity;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-brand-border-gray/50 overflow-hidden flex flex-col md:flex-row">
                
                {/* Image Section */}
                <div className="md:w-1/2 min-h-[300px] md:h-auto bg-brand-light-gray relative">
                    <ImageWithFallback 
                        src={dish.imageUrl} 
                        alt={dish.title} 
                        dishName={dish.title}
                        className="w-full h-full"
                    />
                    
                    {dish.dietType && (
                        <div className={`absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-md border ${
                            dish.dietType === 'Veg' ? 'border-brand-veg-green/30' : 'border-brand-nonveg-red/30'
                        }`}>
                            <div className={`w-4 h-4 rounded-full ${
                                dish.dietType === 'Veg' ? 'bg-brand-veg-green' : 'bg-brand-nonveg-red'
                            }`}></div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2 gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark-brown tracking-tight">{dish.title}</h1>
                                {dish.category && (
                                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-brand-light-orange text-brand-orange px-2.5 py-0.5 rounded-lg">
                                        {dish.category}
                                    </span>
                                )}
                            </div>
                            <span className="text-2xl font-extrabold text-brand-orange whitespace-nowrap">₹{dish.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-brand-mid-gray mb-4 font-semibold">
                            Prepared with care by Home Chef: <span className="text-brand-dark-brown">{dish.chefName}</span>
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 mb-4 bg-amber-50 self-start px-2 py-0.5 rounded-md">
                            <span>★</span>
                            <span>4.8 Rating</span>
                            <span className="text-brand-mid-gray/50 font-normal">|</span>
                            <span className="text-brand-mid-gray font-semibold">Home Kitchen Verified</span>
                        </div>

                        <p className="text-brand-mid-gray text-sm leading-relaxed mb-6">
                            {dish.description}
                        </p>
                    </div>

                    {orderSuccess ? (
                        <div className="bg-green-50 border border-brand-veg-green/30 text-brand-veg-green px-4 py-4 rounded-xl text-center font-bold text-sm">
                            🎉 Order placed successfully! Redirecting to orders...
                        </div>
                    ) : (
                        <form onSubmit={handleOrder} className="space-y-4 pt-4 border-t border-brand-border-gray">
                            <div className="flex gap-4">
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1">Qty</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="block w-full border border-brand-border-gray rounded-xl px-3 py-2 text-sm text-brand-dark-brown font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                                    />
                                </div>
                                <div className="w-2/3">
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1">Delivery Time (min 4 hrs)</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={deliveryTime}
                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                        className="block w-full border border-brand-border-gray rounded-xl px-3 py-2 text-sm text-brand-dark-brown font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1">Delivery Address</label>
                                <textarea
                                    required
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    className="block w-full border border-brand-border-gray rounded-xl px-3.5 py-2.5 text-sm text-brand-dark-brown font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                                    rows="2"
                                    placeholder="Enter complete delivery address"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1">Payment Options</label>
                                    <select
                                        value={paymentOption}
                                        onChange={(e) => setPaymentOption(e.target.value)}
                                        className="block w-full border border-brand-border-gray rounded-xl px-3 py-2 text-sm text-brand-dark-brown font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 cursor-pointer"
                                    >
                                        <option value="full">Pay Full (₹{totalPrice.toFixed(2)})</option>
                                        <option value="advance">Pay 25% Advance (₹{(totalPrice * 0.25).toFixed(2)})</option>
                                    </select>
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="block w-full border border-brand-border-gray rounded-xl px-3 py-2 text-sm text-brand-dark-brown font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 cursor-pointer"
                                    >
                                        <option value="UPI">UPI</option>
                                        <option value="Card">Credit/Debit Card</option>
                                        <option value="Cash">Cash (Balance on Delivery)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-brand-border-gray mt-5">
                                <div className="flex justify-between items-center text-base font-extrabold mb-4 text-brand-dark-brown">
                                    <span>Amount to Pay Now:</span>
                                    <span className="text-xl text-brand-orange">
                                        ₹{paymentOption === 'advance' ? (totalPrice * 0.25).toFixed(2) : totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={orderLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-orange hover:bg-brand-hover-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all disabled:bg-gray-400 btn-active-scale cursor-pointer"
                                >
                                    {orderLoading ? 'Processing Checkout...' : 'Confirm Order & Pay'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DishDetails;
