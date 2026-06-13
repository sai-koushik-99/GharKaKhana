import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ImageWithFallback from '../components/ImageWithFallback';

const StarDisplay = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
            <svg
                key={star}
                className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

// Mandala SVG watermark
const MandalaWatermark = () => (
    <svg className="food-card-watermark" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="#F4A228" strokeWidth="1"/>
        <circle cx="50" cy="50" r="36" stroke="#F4A228" strokeWidth="1"/>
        <circle cx="50" cy="50" r="24" stroke="#F4A228" strokeWidth="1"/>
        <circle cx="50" cy="50" r="12" stroke="#F4A228" strokeWidth="1"/>
        {[0,45,90,135,180,225,270,315].map((a, i) => (
            <line key={i}
                x1="50" y1="2"
                x2="50" y2="98"
                stroke="#F4A228" strokeWidth="0.5"
                transform={`rotate(${a} 50 50)`}
            />
        ))}
        {[0,45,90,135,180,225,270,315].map((a, i) => (
            <ellipse key={i} cx="50" cy="26" rx="4" ry="8"
                stroke="#F4A228" strokeWidth="0.5"
                transform={`rotate(${a} 50 50)`}
            />
        ))}
    </svg>
);

const ChefProfile = () => {
    const { id } = useParams();
    const [chef, setChef] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [profileRes, reviewsRes] = await Promise.all([
                    axiosInstance.get(`/api/chefs/${id}`),
                    axiosInstance.get(`/api/reviews/chef/${id}`)
                ]);
                setChef(profileRes.data.chef);
                setFoodItems(profileRes.data.foodItems);
                setReviews(reviewsRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <span className="text-5xl block mb-4">😕</span>
            <h3 className="text-xl font-bold text-brand-dark-brown">Chef not found</h3>
            <p className="text-brand-mid-gray mt-2">{error}</p>
            <Link to="/" className="mt-4 inline-block px-5 py-2 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-hover-orange transition-colors">
                Back to Menu
            </Link>
        </div>
    );

    if (!chef) return null;

    const joinedYear = new Date(chef.createdAt).getFullYear();

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl border border-brand-border-gray shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden mb-8">
                {/* Cover gradient */}
                <div className="h-32 bg-gradient-to-r from-brand-light-orange via-orange-100 to-brand-light-orange"></div>

                <div className="px-6 sm:px-8 pb-8">
                    {/* Avatar */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
                        <div className={`w-24 h-24 rounded-full overflow-hidden border-4 flex-shrink-0 shadow-md ${chef.isVerified ? 'border-brand-orange' : 'border-white'}`}>
                            {chef.profilePhoto ? (
                                <img src={chef.profilePhoto} alt={chef.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-brand-orange flex items-center justify-center text-white text-3xl font-bold">
                                    {chef.name?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 pt-2 sm:pt-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-extrabold text-brand-dark-brown">{chef.name}</h1>
                                {chef.isVerified && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-brand-veg-green border border-brand-veg-green/20 text-xs font-bold px-2.5 py-1 rounded-full">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified Chef
                                    </span>
                                )}
                            </div>
                            {chef.city && (
                                <p className="text-sm text-brand-mid-gray mt-1 flex items-center gap-1">
                                    <span>📍</span> {chef.city}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {chef.bio && (
                        <p className="text-brand-mid-gray text-sm italic leading-relaxed mb-5 border-l-4 border-brand-light-orange pl-4">
                            "{chef.bio}"
                        </p>
                    )}

                    {/* Speciality tags */}
                    {chef.speciality && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {chef.speciality.split(',').map(s => s.trim()).filter(Boolean).map(tag => (
                                <span key={tag} className="bg-brand-light-orange text-brand-orange text-xs font-bold px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 bg-brand-light-gray/50 rounded-xl p-4 border border-brand-border-gray/50">
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-brand-orange">{chef.totalOrders}</p>
                            <p className="text-xs text-brand-mid-gray font-semibold mt-0.5">Orders Done</p>
                        </div>
                        <div className="text-center border-x border-brand-border-gray">
                            <div className="flex items-center justify-center gap-1">
                                <p className="text-2xl font-extrabold text-brand-orange">
                                    {chef.avgRating > 0 ? chef.avgRating.toFixed(1) : '—'}
                                </p>
                                {chef.avgRating > 0 && <span className="text-amber-400 text-lg">★</span>}
                            </div>
                            <p className="text-xs text-brand-mid-gray font-semibold mt-0.5">Avg Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-brand-orange">{joinedYear}</p>
                            <p className="text-xs text-brand-mid-gray font-semibold mt-0.5">Joined Since</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Food Items Grid */}
            <div className="mb-10">
                <h2 className="text-xl font-extrabold text-brand-dark-brown mb-5">
                    Dishes by {chef.name.split(' ')[0]}
                </h2>
                {foodItems.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-brand-border-gray p-12 text-center">
                        <span className="text-4xl block mb-3">🍽️</span>
                        <p className="text-brand-mid-gray font-medium">No dishes listed yet.</p>
                    </div>
                ) : (
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px'}}>
                        {foodItems.map(item => (
                            <div key={item._id} className="food-card flex flex-col">
                                <MandalaWatermark />

                                {/* IMAGE */}
                                <div className="relative flex-shrink-0"
                                    style={{height:'130px', borderRadius:'9px 9px 0 0', overflow:'hidden'}}>
                                    <ImageWithFallback src={item.imageUrl} alt={item.title} dishName={item.title} className="w-full h-full" />
                                    <div className="absolute inset-0 pointer-events-none"
                                        style={{background:'rgba(244,162,40,0.05)'}}></div>
                                    <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
                                        style={{height:'40px', background:'linear-gradient(to top, #FDF6EC 0%, transparent 100%)'}}></div>
                                    
                                    {item.mealType && (
                                        <div className="absolute top-2 left-2 z-10 meal-type-badge flex items-center gap-1">
                                            🍽️ {item.mealType}
                                        </div>
                                    )}

                                    {item.dietType && (
                                        <div className="absolute top-2 right-2 z-10 flex items-center justify-center bg-white rounded-full shadow"
                                            style={{width:'24px', height:'24px', border: item.dietType === 'Veg' ? '1.5px solid #2D6A4F' : '1.5px solid #C0392B'}}>
                                            <div className="rounded-full"
                                                style={{width:'10px', height:'10px', background: item.dietType === 'Veg' ? '#2D6A4F' : '#C0392B'}}></div>
                                        </div>
                                    )}
                                </div>

                                {/* CARD BODY */}
                                <div className="flex flex-col flex-grow relative z-10" style={{padding:'10px 12px'}}>
                                    <h3 className="line-clamp-1 hover:text-[#C1440E] transition-colors mb-0.5"
                                        style={{fontFamily:'Poppins,sans-serif', fontSize:'14px', fontWeight:500, color:'#3B1F0A'}}>
                                        <Link to={`/dish/${item._id}`}>{item.title}</Link>
                                    </h3>
                                    <p className="mb-1.5 flex items-center gap-1 truncate"
                                        style={{fontFamily:'Hind,sans-serif', fontSize:'12px', color:'#A0522D'}}>
                                        <span style={{fontSize:'11px'}}>👩‍🍳</span>
                                        {chef.name}
                                    </p>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="flex items-center gap-0.5"
                                            style={{fontSize:'11px', color:'#8B5E3C', fontFamily:'Hind,sans-serif'}}>
                                            <span style={{color:'#F4A228'}}>⭐</span> 4.8
                                        </span>
                                        <span className="rounded-full px-1.5 py-0.5"
                                            style={{fontSize:'10px', fontWeight:600, background:'rgba(244,162,40,0.12)', color:'#A0522D', fontFamily:'Poppins,sans-serif'}}>
                                            {item.cuisine || item.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <span style={{fontFamily:'Poppins,sans-serif', fontSize:'15px', fontWeight:700, color:'#F4A228'}}>
                                            ₹{item.price.toFixed(0)}
                                        </span>
                                        <span style={{fontSize:'10px', fontWeight:600, color: item.dietType === 'Veg' ? '#2D6A4F' : '#C0392B'}}>
                                            {item.dietType}
                                        </span>
                                    </div>
                                    <Link to={`/dish/${item._id}`} className="add-to-cart-btn mt-auto">
                                        Order Now <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div>
                <h2 className="text-xl font-extrabold text-brand-dark-brown mb-5">
                    Customer Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-brand-border-gray p-10 text-center">
                        <span className="text-4xl block mb-3">⭐</span>
                        <p className="text-brand-mid-gray font-medium">No reviews yet. Be the first to order and review!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review._id} className="bg-white rounded-2xl border border-brand-border-gray p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {review.customerName?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-dark-brown text-sm">{review.customerName}</p>
                                            <p className="text-xs text-brand-mid-gray">
                                                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <StarDisplay rating={review.rating} />
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-brand-mid-gray leading-relaxed pl-12">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA for new chefs */}
            <div className="mt-10 bg-brand-light-orange rounded-2xl p-6 text-center border border-brand-orange/20">
                <p className="text-brand-dark-brown font-semibold text-sm">
                    Want to cook and earn like {chef.name.split(' ')[0]}?{' '}
                    <Link to="/register" className="text-brand-orange font-bold hover:underline">
                        Join as a Chef →
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ChefProfile;
