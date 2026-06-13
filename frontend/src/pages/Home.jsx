import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import ImageWithFallback from '../components/ImageWithFallback';

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

const SkeletonCard = () => (
    <div className="food-card overflow-hidden flex flex-col">
        <div className="h-[200px] w-full animate-shimmer"></div>
        <div className="p-4 flex flex-col flex-grow space-y-3 relative z-10">
            <div className="h-5 w-3/4 bg-amber-100 rounded animate-pulse"></div>
            <div className="h-3 w-1/2 bg-amber-50 rounded animate-pulse"></div>
            <div className="h-3 w-full bg-amber-50 rounded animate-pulse"></div>
            <div className="h-3 w-5/6 bg-amber-50 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-amber-100 rounded-xl animate-pulse mt-auto"></div>
        </div>
    </div>
);

const Home = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [selectedMealType, setSelectedMealType] = useState('All');
    const [selectedDiet, setSelectedDiet] = useState('All');
    const [sortBy, setSortBy] = useState('Default');
    const [showScrollTop, setShowScrollTop] = useState(false);

    const { user } = useContext(AuthContext);

    const cuisines = [
        { name: 'All',          emoji: '🇮🇳' },
        { name: 'South Indian', emoji: '🍛' },
        { name: 'North Indian', emoji: '🫓' },
    ];

    const mealTypes = [
        { name: 'All',         label: 'All',         emoji: '🍽️' },
        { name: 'Main Course', label: 'Main Course',  emoji: '🥘' },
        { name: 'Snack',       label: 'Snacks',       emoji: '🍟' },
        { name: 'Tiffin',      label: 'Tiffins',      emoji: '🥗' },
    ];

    const dietTypes = [
        { name: 'All',     emoji: '⚪' },
        { name: 'Veg',     emoji: '🥗' },
        { name: 'Non-Veg', emoji: '🍗' },
    ];

    const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low', 'Name (A-Z)'];

    const handleCuisineChange = (cuisine) => {
        setSelectedCuisine(cuisine);
        setSelectedMealType('All');
    };

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const { data } = await axiosInstance.get('/api/food');
                setFoodItems(data);
                setFilteredItems(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchFoodItems();
    }, []);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let items = [...foodItems];
        if (selectedCuisine !== 'All') {
            items = items.filter(item => item.cuisine === selectedCuisine);
        }
        if (selectedMealType !== 'All') {
            if (selectedMealType === 'Main Course') {
                items = items.filter(item => ['Breakfast', 'Lunch', 'Dinner'].includes(item.mealType));
            } else {
                items = items.filter(item => item.mealType === selectedMealType);
            }
        }
        if (selectedDiet !== 'All') {
            items = items.filter(item => item.dietType === selectedDiet);
        }
        switch (sortBy) {
            case 'Price: Low to High': items.sort((a, b) => a.price - b.price); break;
            case 'Price: High to Low': items.sort((a, b) => b.price - a.price); break;
            case 'Name (A-Z)': items.sort((a, b) => a.title.localeCompare(b.title)); break;
            default: break;
        }
        setFilteredItems(items);
    }, [selectedCuisine, selectedMealType, selectedDiet, sortBy, foodItems]);

    const mealTypeColors = {
        Breakfast: 'from-amber-400 to-yellow-300',
        Lunch:     'from-orange-400 to-amber-300',
        Dinner:    'from-red-400 to-orange-400',
        Snack:     'from-green-500 to-emerald-400',
        Tiffin:    'from-purple-400 to-indigo-400',
    };

    if (error) return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <span className="text-5xl block mb-4">😕</span>
            <h3 className="text-xl font-bold text-brand-dark-brown">Failed to load meals</h3>
            <p className="text-brand-mid-gray mt-2">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-brand-orange text-white font-semibold rounded-xl hover:bg-brand-hover-orange transition-colors">
                Try Again
            </button>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-dark-brown tracking-tight" style={{fontFamily:'Poppins,sans-serif'}}>
                        What's Cooking Today?
                    </h1>
                    <p className="mt-2 text-base" style={{fontFamily:'Hind,sans-serif', color:'#8B5E3C', fontStyle:'italic'}}>
                        Fresh home-cooked meals, prepared with love by local home chefs.
                    </p>
                </div>
                {user?.role === 'chef' && (
                    <Link to="/chef/dashboard" className="bg-brand-orange text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-hover-orange transition-colors shadow-sm btn-active-scale">
                        Chef Dashboard
                    </Link>
                )}
            </div>

            {/* ── FILTER BAR ── */}
            <div className="rounded-2xl p-5 mb-8 space-y-4"
                style={{ background: 'linear-gradient(135deg, #FDF6EC 0%, #FFF9F4 100%)', border: '1px solid rgba(244,162,40,0.25)', boxShadow: '0 2px 12px rgba(244,162,40,0.08)' }}>

                {/* Row 1 — Cuisine */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider w-24 flex-shrink-0" style={{color:'#A0522D', fontFamily:'Poppins,sans-serif'}}>
                        Cuisine
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {cuisines.map(c => (
                            <button key={c.name} onClick={() => handleCuisineChange(c.name)}
                                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer ${selectedCuisine === c.name ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                                style={{fontFamily:'Poppins,sans-serif'}}>
                                <span className="mr-1.5">{c.emoji}</span>{c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 2 — Meal Type sub-filter */}
                <div className={`flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t transition-opacity`}
                    style={{ borderColor: 'rgba(244,162,40,0.2)', opacity: selectedCuisine === 'All' ? 0.4 : 1, pointerEvents: selectedCuisine === 'All' ? 'none' : 'all' }}>
                    <span className="text-xs font-bold uppercase tracking-wider w-24 flex-shrink-0" style={{color:'#A0522D', fontFamily:'Poppins,sans-serif'}}>
                        Type
                        {selectedCuisine === 'All' && <span className="block normal-case font-normal text-[10px] mt-0.5 text-amber-400">Pick cuisine first</span>}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {mealTypes.map(m => (
                            <button key={m.name} onClick={() => setSelectedMealType(m.name)}
                                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer ${selectedMealType === m.name ? 'filter-pill-sub-active' : 'filter-pill-inactive'}`}
                                style={{fontFamily:'Poppins,sans-serif'}}>
                                <span className="mr-1.5">{m.emoji}</span>{m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 3 — Diet */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t"
                    style={{ borderColor: 'rgba(244,162,40,0.2)' }}>
                    <span className="text-xs font-bold uppercase tracking-wider w-24 flex-shrink-0" style={{color:'#A0522D', fontFamily:'Poppins,sans-serif'}}>Diet</span>
                    <div className="flex gap-2 p-1 rounded-xl" style={{background:'rgba(244,162,40,0.08)'}}>
                        {dietTypes.map(d => (
                            <button key={d.name} onClick={() => setSelectedDiet(d.name)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${selectedDiet === d.name ? 'filter-pill-active' : 'text-[#3B1F0A] hover:bg-amber-50'}`}
                                style={{fontFamily:'Poppins,sans-serif'}}>
                                <span className="text-xs">{d.emoji}</span>{d.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── SECTION HEADER ── */}
            <div className="flex justify-between items-center mb-6 pb-4"
                style={{ borderBottom: '2px solid rgba(244,162,40,0.2)' }}>
                <div>
                    <h2 className="text-xl font-extrabold flex items-center gap-2" style={{color:'#3B1F0A', fontFamily:'Poppins,sans-serif'}}>
                        <span>🪔</span> Today's Menu
                    </h2>
                    <p className="text-xs mt-1 italic" style={{color:'#A0522D', fontFamily:'Hind,sans-serif'}}>
                        Showing {loading ? '...' : filteredItems.length} {filteredItems.length === 1 ? 'meal' : 'meals'} — made fresh, just for you
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block" style={{color:'#A0522D'}}>Sort By</span>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none cursor-pointer"
                        style={{background:'#FDF6EC', border:'1px solid rgba(244,162,40,0.4)', color:'#3B1F0A', fontFamily:'Poppins,sans-serif'}}>
                        {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {/* ── CARDS GRID ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="rounded-2xl p-16 text-center max-w-lg mx-auto mt-8"
                    style={{ background: 'linear-gradient(135deg, #FDF6EC, #FFF9F4)', border: '1px solid rgba(244,162,40,0.3)' }}>
                    <span className="text-5xl block mb-4">🍽️</span>
                    <h3 className="text-xl font-bold" style={{color:'#3B1F0A', fontFamily:'Poppins,sans-serif'}}>No meals found</h3>
                    <p className="mt-2 text-sm" style={{color:'#A0522D', fontFamily:'Hind,sans-serif'}}>Try clearing your filters to see all available dishes.</p>
                    <button onClick={() => { setSelectedCuisine('All'); setSelectedMealType('All'); setSelectedDiet('All'); setSortBy('Default'); }}
                        className="mt-5 px-5 py-2 text-white font-semibold rounded-xl transition-all btn-active-scale shadow-sm"
                        style={{background:'linear-gradient(135deg, #F4A228, #E8B84B)'}}>
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div key={item._id} className="food-card flex flex-col">
                            <MandalaWatermark />

                            {/* Image section */}
                            <div className="h-[200px] relative flex-shrink-0" style={{borderRadius:'14px 14px 0 0', overflow:'hidden'}}>
                                <ImageWithFallback
                                    src={item.imageUrl}
                                    alt={item.title}
                                    dishName={item.title}
                                    className="w-full h-full"
                                />
                                {/* Warm overlay */}
                                <div className="absolute inset-0 pointer-events-none" style={{background:'rgba(244,162,40,0.06)'}}></div>

                                {/* Gradient fade to card body */}
                                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                                    style={{background:'linear-gradient(to top, #FDF6EC 0%, transparent 100%)'}}></div>

                                {/* Meal type badge — top left */}
                                {item.mealType && (
                                    <div className="absolute top-3 left-3 z-10 meal-type-badge flex items-center gap-1">
                                        🍽️ {item.mealType}
                                    </div>
                                )}

                                {/* Veg/Non-veg dot — top right */}
                                {item.dietType && (
                                    <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
                                        style={{border: item.dietType === 'Veg' ? '1.5px solid #2D6A4F' : '1.5px solid #C0392B'}}>
                                        <div className="w-3 h-3 rounded-full"
                                            style={{background: item.dietType === 'Veg' ? '#2D6A4F' : '#C0392B'}}></div>
                                    </div>
                                )}
                            </div>

                            {/* Card body */}
                            <div className="p-4 flex flex-col flex-grow relative z-10">

                                {/* Dish name */}
                                <h3 className="font-semibold mb-0.5 line-clamp-1 hover:text-[#C1440E] transition-colors"
                                    style={{fontFamily:'Poppins,sans-serif', fontSize:'16px', color:'#3B1F0A', fontWeight:600}}>
                                    <Link to={`/dish/${item._id}`}>{item.title}</Link>
                                </h3>

                                {/* Chef name */}
                                <p className="text-xs mb-2 flex items-center gap-1"
                                    style={{fontFamily:'Hind,sans-serif', color:'#A0522D'}}>
                                    <span>👩‍🍳</span> by Chef {item.chefName}
                                </p>

                                {/* Meta row — rating, time, cuisine */}
                                <div className="flex items-center gap-3 text-xs mb-3"
                                    style={{fontFamily:'Hind,sans-serif', color:'#8B5E3C'}}>
                                    <span className="flex items-center gap-0.5">
                                        <span className="text-amber-500">⭐</span> 4.8
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                        <span>🕐</span> 30 min
                                    </span>
                                    <span className="flex items-center gap-0.5 ml-auto">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                            style={{background:'rgba(244,162,40,0.12)', color:'#A0522D'}}>
                                            {item.cuisine || item.category}
                                        </span>
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-xs leading-relaxed line-clamp-2 mb-4 flex-grow"
                                    style={{fontFamily:'Hind,sans-serif', color:'#7A5C3C'}}>
                                    {item.description}
                                </p>

                                {/* Price + Button */}
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-extrabold text-xl"
                                            style={{fontFamily:'Poppins,sans-serif', color:'#F4A228'}}>
                                            ₹{item.price.toFixed(0)}
                                        </span>
                                        {item.dietType === 'Veg'
                                            ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:'rgba(45,106,79,0.1)', color:'#2D6A4F'}}>Pure Veg</span>
                                            : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:'rgba(192,57,43,0.1)', color:'#C0392B'}}>Non-Veg</span>
                                        }
                                    </div>
                                    <Link to={`/dish/${item._id}`} className="add-to-cart-btn">
                                        Order Now <span className="text-base">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Scroll to top */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-6 right-6 p-3 text-white rounded-full shadow-lg transition-all duration-300 z-40 btn-active-scale cursor-pointer ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                style={{background:'linear-gradient(135deg, #F4A228, #C1440E)'}}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Home;
