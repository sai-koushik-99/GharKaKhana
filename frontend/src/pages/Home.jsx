import { useState, useEffect, useContext, useMemo } from 'react';
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
        <div className="w-full animate-shimmer" style={{height:'130px'}}></div>
        <div className="flex flex-col gap-2" style={{padding:'10px 12px'}}>
            <div className="h-3.5 w-3/4 bg-amber-100 rounded animate-pulse"></div>
            <div className="h-3 w-1/2 bg-amber-50 rounded animate-pulse"></div>
            <div className="h-3 w-1/3 bg-amber-50 rounded animate-pulse"></div>
            <div className="h-7 w-full bg-amber-100 rounded-lg animate-pulse mt-1"></div>
        </div>
    </div>
);

const Home = () => {
    const [foodItems, setFoodItems] = useState([]);
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

    const filteredItems = useMemo(() => {
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
        return items;
    }, [selectedCuisine, selectedMealType, selectedDiet, sortBy, foodItems]);

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

            {/* ── FILTER BAR — compact ── */}
            <div className="rounded-xl mb-6" style={{
                background: 'linear-gradient(135deg, #FDF6EC 0%, #FFF9F4 100%)',
                border: '1px solid rgba(244,162,40,0.22)',
                boxShadow: '0 2px 8px rgba(244,162,40,0.07)',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>

                {/* Row 1 — Cuisine */}
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{
                        width:'80px', flexShrink:0,
                        fontSize:'10px', fontWeight:600,
                        letterSpacing:'0.06em', textTransform:'uppercase',
                        color:'#A0522D', fontFamily:'Poppins,sans-serif'
                    }}>Cuisine</span>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                        {cuisines.map(c => (
                            <button key={c.name} onClick={() => handleCuisineChange(c.name)}
                                style={{
                                    height:'30px', padding:'0 14px',
                                    borderRadius:'9999px', fontSize:'12px',
                                    fontFamily:'Poppins,sans-serif', fontWeight:500,
                                    cursor:'pointer', border:'none',
                                    display:'flex', alignItems:'center', gap:'5px',
                                    transition:'all 0.18s ease',
                                    background: selectedCuisine === c.name
                                        ? 'linear-gradient(135deg, #F4A228, #E8B84B)'
                                        : '#FDF6EC',
                                    color: selectedCuisine === c.name ? '#fff' : '#3B1F0A',
                                    boxShadow: selectedCuisine === c.name
                                        ? '0 2px 6px rgba(244,162,40,0.3)'
                                        : 'none',
                                    outline: selectedCuisine === c.name
                                        ? 'none'
                                        : '1px solid rgba(244,162,40,0.35)',
                                }}>
                                <span style={{fontSize:'13px'}}>{c.emoji}</span>{c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 2 — Meal Type */}
                <div style={{
                    display:'flex', alignItems:'center', gap:'8px',
                    opacity: selectedCuisine === 'All' ? 0.4 : 1,
                    pointerEvents: selectedCuisine === 'All' ? 'none' : 'all',
                    transition: 'opacity 0.2s'
                }}>
                    <span style={{
                        width:'80px', flexShrink:0,
                        fontSize:'10px', fontWeight:600,
                        letterSpacing:'0.06em', textTransform:'uppercase',
                        color:'#A0522D', fontFamily:'Poppins,sans-serif',
                        lineHeight:1.3
                    }}>
                        Type
                        {selectedCuisine === 'All' &&
                            <span style={{display:'block', fontSize:'9px', fontWeight:400, color:'#C4956A', textTransform:'none', letterSpacing:0}}>
                                pick cuisine first
                            </span>
                        }
                    </span>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                        {mealTypes.map(m => (
                            <button key={m.name} onClick={() => setSelectedMealType(m.name)}
                                style={{
                                    height:'30px', padding:'0 14px',
                                    borderRadius:'9999px', fontSize:'12px',
                                    fontFamily:'Poppins,sans-serif', fontWeight:500,
                                    cursor:'pointer', border:'none',
                                    display:'flex', alignItems:'center', gap:'5px',
                                    transition:'all 0.18s ease',
                                    background: selectedMealType === m.name ? '#3B1F0A' : '#FDF6EC',
                                    color: selectedMealType === m.name ? '#fff' : '#3B1F0A',
                                    boxShadow: selectedMealType === m.name
                                        ? '0 2px 6px rgba(59,31,10,0.2)'
                                        : 'none',
                                    outline: selectedMealType === m.name
                                        ? 'none'
                                        : '1px solid rgba(244,162,40,0.35)',
                                }}>
                                <span style={{fontSize:'13px'}}>{m.emoji}</span>{m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 3 — Diet */}
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{
                        width:'80px', flexShrink:0,
                        fontSize:'10px', fontWeight:600,
                        letterSpacing:'0.06em', textTransform:'uppercase',
                        color:'#A0522D', fontFamily:'Poppins,sans-serif'
                    }}>Diet</span>
                    <div style={{display:'flex', gap:'8px'}}>
                        {dietTypes.map(d => (
                            <button key={d.name} onClick={() => setSelectedDiet(d.name)}
                                style={{
                                    height:'30px', padding:'0 14px',
                                    borderRadius:'9999px', fontSize:'12px',
                                    fontFamily:'Poppins,sans-serif', fontWeight:500,
                                    cursor:'pointer', border:'none',
                                    display:'flex', alignItems:'center', gap:'5px',
                                    transition:'all 0.18s ease',
                                    background: selectedDiet === d.name
                                        ? 'linear-gradient(135deg, #F4A228, #E8B84B)'
                                        : '#FDF6EC',
                                    color: selectedDiet === d.name ? '#fff' : '#3B1F0A',
                                    boxShadow: selectedDiet === d.name
                                        ? '0 2px 6px rgba(244,162,40,0.3)'
                                        : 'none',
                                    outline: selectedDiet === d.name
                                        ? 'none'
                                        : '1px solid rgba(244,162,40,0.35)',
                                }}>
                                <span style={{fontSize:'13px'}}>{d.emoji}</span>{d.name}
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
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px'}}>
                    {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="rounded-2xl p-12 text-center max-w-md mx-auto mt-8"
                    style={{ background: 'linear-gradient(135deg, #FDF6EC, #FFF9F4)', border: '1px solid rgba(244,162,40,0.3)' }}>
                    <span className="text-4xl block mb-3">🍽️</span>
                    <h3 className="text-lg font-bold" style={{color:'#3B1F0A', fontFamily:'Poppins,sans-serif'}}>No meals found</h3>
                    <p className="mt-1 text-sm" style={{color:'#A0522D', fontFamily:'Hind,sans-serif'}}>Try clearing your filters to see all available dishes.</p>
                    <button onClick={() => { setSelectedCuisine('All'); setSelectedMealType('All'); setSelectedDiet('All'); setSortBy('Default'); }}
                        className="mt-4 px-5 py-2 text-white font-semibold rounded-xl transition-all btn-active-scale text-sm"
                        style={{background:'linear-gradient(135deg, #F4A228, #E8B84B)'}}>
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px'}}>
                    {filteredItems.map(item => (
                        <div key={item._id} className="food-card flex flex-col">
                            <MandalaWatermark />

                            {/* ── IMAGE (130px fixed) ── */}
                            <div className="relative flex-shrink-0"
                                style={{height:'130px', borderRadius:'9px 9px 0 0', overflow:'hidden'}}>
                                <ImageWithFallback
                                    src={item.imageUrl}
                                    alt={item.title}
                                    dishName={item.title}
                                    className="w-full h-full"
                                />
                                {/* Warm overlay */}
                                <div className="absolute inset-0 pointer-events-none"
                                    style={{background:'rgba(244,162,40,0.05)'}}></div>
                                {/* Gradient fade into card */}
                                <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
                                    style={{height:'40px', background:'linear-gradient(to top, #FDF6EC 0%, transparent 100%)'}}></div>

                                {/* Meal type badge — top left */}
                                {item.mealType && (
                                    <div className="absolute top-2 left-2 z-10 meal-type-badge flex items-center gap-1">
                                        🍽️ {item.mealType}
                                    </div>
                                )}

                                {/* Veg/Non-veg dot — top right, 28px circle */}
                                {item.dietType && (
                                    <div className="absolute top-2 right-2 z-10 flex items-center justify-center bg-white rounded-full shadow"
                                        style={{width:'24px', height:'24px', border: item.dietType === 'Veg' ? '1.5px solid #2D6A4F' : '1.5px solid #C0392B'}}>
                                        <div className="rounded-full"
                                            style={{width:'10px', height:'10px', background: item.dietType === 'Veg' ? '#2D6A4F' : '#C0392B'}}></div>
                                    </div>
                                )}
                            </div>

                            {/* ── CARD BODY ── */}
                            <div className="flex flex-col flex-grow relative z-10"
                                style={{padding:'10px 12px'}}>

                                {/* Dish name — 14px 500 */}
                                <h3 className="line-clamp-1 hover:text-[#C1440E] transition-colors mb-0.5"
                                    style={{fontFamily:'Poppins,sans-serif', fontSize:'14px', fontWeight:500, color:'#3B1F0A'}}>
                                    <Link to={`/dish/${item._id}`}>{item.title}</Link>
                                </h3>

                                {/* Chef name — 12px muted */}
                                <p className="mb-1.5 flex items-center gap-1 truncate"
                                    style={{fontFamily:'Hind,sans-serif', fontSize:'12px', color:'#A0522D'}}>
                                    <span style={{fontSize:'11px'}}>👩‍🍳</span>
                                    {item.chefName}
                                </p>

                                {/* Cuisine tag + rating row */}
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

                                {/* Price — 13px accent */}
                                <div className="flex items-center justify-between mb-2.5">
                                    <span style={{fontFamily:'Poppins,sans-serif', fontSize:'15px', fontWeight:700, color:'#F4A228'}}>
                                        ₹{item.price.toFixed(0)}
                                    </span>
                                    <span style={{fontSize:'10px', fontWeight:600, color: item.dietType === 'Veg' ? '#2D6A4F' : '#C0392B'}}>
                                        {item.dietType}
                                    </span>
                                </div>

                                {/* Order button */}
                                <Link to={`/dish/${item._id}`} className="add-to-cart-btn mt-auto">
                                    Order Now <span>→</span>
                                </Link>
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
