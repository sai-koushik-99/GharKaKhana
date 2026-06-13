import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import ImageWithFallback from '../components/ImageWithFallback';

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-brand-border-gray overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="h-[200px] w-full animate-shimmer"></div>
        <div className="p-5 flex flex-col flex-grow space-y-3">
            <div className="flex justify-between items-center">
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-1.5 pt-2">
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse mt-auto pt-2"></div>
        </div>
    </div>
);

const Home = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDiet, setSelectedDiet] = useState('All');
    const [sortBy, setSortBy] = useState('Default');
    const [showScrollTop, setShowScrollTop] = useState(false);

    const { user } = useContext(AuthContext);

    const categories = [
        { name: 'All',          emoji: '🍽️', type: 'all' },
        { name: 'South Indian', emoji: '🥘', type: 'cuisine' },
        { name: 'North Indian', emoji: '🍛', type: 'cuisine' },
        { name: 'Snacks',       emoji: '🍟', type: 'mealType' },
        { name: 'Tiffins',      emoji: '🥗', type: 'mealType' },
    ];
    
    const dietTypes = ['All', 'Veg', 'Non-Veg'];
    const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low', 'Name (A-Z)'];

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

    // Scroll listener for floating scroll-to-top button
    useEffect(() => {
        const toggleVisible = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', toggleVisible);
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    useEffect(() => {
        let items = [...foodItems];

        if (selectedCategory !== 'All') {
            const cat = categories.find(c => c.name === selectedCategory);
            if (cat?.type === 'cuisine') {
                // South Indian / North Indian → filter by cuisine field
                items = items.filter(item => item.cuisine === selectedCategory);
            } else if (cat?.type === 'mealType') {
                // Snacks → mealType === 'Snack', Tiffins → mealType === 'Tiffin'
                const mealTypeMap = { 'Snacks': 'Snack', 'Tiffins': 'Tiffin' };
                items = items.filter(item => item.mealType === mealTypeMap[selectedCategory]);
            }
        }

        if (selectedDiet !== 'All') {
            items = items.filter(item => item.dietType === selectedDiet);
        }

        switch (sortBy) {
            case 'Price: Low to High':
                items.sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                items.sort((a, b) => b.price - a.price);
                break;
            case 'Name (A-Z)':
                items.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                break;
        }

        setFilteredItems(items);
    }, [selectedCategory, selectedDiet, sortBy, foodItems]);

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-dark-brown">Failed to load meals</h3>
                <p className="text-brand-mid-gray mt-2">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-brand-orange text-white font-medium rounded-xl hover:bg-brand-hover-orange transition-colors">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-dark-brown tracking-tight">What's Cooking Today?</h1>
                    <p className="text-brand-mid-gray mt-2 text-base">Fresh home-cooked meals, prepared with love by local home chefs.</p>
                </div>
                {user && user.role === 'chef' && (
                    <Link to="/chef/dashboard" className="bg-brand-orange text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-hover-orange transition-colors shadow-sm btn-active-scale">
                        Chef Dashboard
                    </Link>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-brand-border-gray mb-8 space-y-4">
                <div className="flex flex-col lg:flex-row gap-5 justify-between">
                    {/* Category Filter */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-mid-gray">Category</span>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-4.5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        selectedCategory === cat.name 
                                            ? 'bg-brand-orange text-white shadow-sm' 
                                            : 'bg-brand-light-gray text-brand-dark-brown hover:bg-brand-light-orange hover:text-brand-orange border border-brand-border-gray/50'
                                    }`}
                                >
                                    <span className="mr-1.5">{cat.emoji}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Diet Type Filter (Radio button toggle styling) */}
                    <div className="flex flex-col gap-2 lg:w-72">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-mid-gray">Diet Type</span>
                        <div className="flex bg-brand-light-gray p-1 rounded-xl border border-brand-border-gray/50">
                            {dietTypes.map(diet => (
                                <button
                                    key={diet}
                                    onClick={() => setSelectedDiet(diet)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                                        selectedDiet === diet 
                                            ? 'bg-brand-orange text-white shadow-sm' 
                                            : 'text-brand-mid-gray hover:text-brand-orange'
                                    }`}
                                >
                                    <span className="text-[10px]">
                                        {diet === 'Veg' ? '🟢' : diet === 'Non-Veg' ? '🔴' : '⚪'}
                                    </span>
                                    {diet}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items Info & Sorting */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border-gray">
                <div>
                    <h2 className="text-xl font-extrabold text-brand-dark-brown">Today's Menu</h2>
                    <p className="text-xs text-brand-mid-gray mt-1">
                        Showing {loading ? '...' : filteredItems.length} {filteredItems.length === 1 ? 'meal' : 'meals'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-mid-gray whitespace-nowrap">Sort By</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-brand-border-gray rounded-xl px-3 py-1.5 text-sm text-brand-dark-brown font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 shadow-sm cursor-pointer hover:border-brand-orange transition-colors"
                    >
                        {sortOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Meal Cards Grid / Skeletons */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, idx) => <SkeletonCard key={idx} />)}
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-brand-border-gray shadow-[0_2px_8px_rgba(0,0,0,0.01)] max-w-lg mx-auto mt-8">
                    <span className="text-5xl block mb-4">🍽️</span>
                    <h3 className="text-xl font-bold text-brand-dark-brown">No meals found</h3>
                    <p className="text-brand-mid-gray mt-2">Try clearing your filters or changing categories to see available listings.</p>
                    <button 
                        onClick={() => { setSelectedCategory('All'); setSelectedDiet('All'); setSortBy('Default'); }} 
                        className="mt-5 px-5 py-2 bg-brand-orange text-white font-semibold rounded-xl hover:bg-brand-hover-orange transition-all btn-active-scale shadow-sm"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div 
                            key={item._id} 
                            className="bg-white rounded-2xl border border-brand-border-gray overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] card-transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col"
                        >
                            {/* Image with fallback component */}
                            <div className="h-[200px] relative">
                                <ImageWithFallback 
                                    src={item.imageUrl} 
                                    alt={item.title} 
                                    dishName={item.title}
                                    className="w-full h-full"
                                />
                                
                                {/* Status / Diet type dots */}
                                {item.dietType && (
                                    <div className={`absolute top-3 right-3 flex items-center justify-center w-7 h-7 bg-white rounded-lg shadow-md border ${
                                        item.dietType === 'Veg' ? 'border-brand-veg-green/30' : 'border-brand-nonveg-red/30'
                                    }`}>
                                        <div className={`w-3.5 h-3.5 rounded-full ${
                                            item.dietType === 'Veg' ? 'bg-brand-veg-green' : 'bg-brand-nonveg-red'
                                        }`}></div>
                                    </div>
                                )}

                                {/* Meal Type Badge — shows BREAKFAST, LUNCH, SNACK etc */}
                                {item.mealType && (
                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-[2px] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg">
                                        {item.mealType}
                                    </div>
                                )}

                                {/* Decorative Rating Tag */}
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-[1px] text-brand-dark-brown text-[11px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center">
                                    <span className="text-amber-500 mr-0.5">★</span> 4.8
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-1 gap-2">
                                    <h3 className="text-base font-bold text-brand-dark-brown line-clamp-1 hover:text-brand-orange transition-colors">
                                        <Link to={`/dish/${item._id}`}>{item.title}</Link>
                                    </h3>
                                    <span className="text-brand-orange font-extrabold text-lg">₹{item.price.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center text-xs text-brand-mid-gray mb-3 font-medium">
                                    <Link to={`/chef/${item.chefId}`} className="hover:text-brand-orange transition-colors">
                                        By {item.chefName}
                                    </Link>
                                    <span className="mx-2">•</span>
                                    <span className="flex items-center">⏱ 30 min</span>
                                </div>

                                <p className="text-brand-mid-gray text-xs leading-relaxed line-clamp-2 mb-5 flex-grow">
                                    {item.description}
                                </p>

                                <div className="mt-auto">
                                    <Link
                                        to={`/dish/${item._id}`}
                                        className="block w-full text-center bg-brand-orange text-white px-4 py-2.5 rounded-xl font-bold hover:bg-brand-hover-orange transition-all duration-150 shadow-sm btn-active-scale text-sm"
                                    >
                                        Order Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Scroll to top floating button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-6 right-6 p-3 bg-brand-orange hover:bg-brand-hover-orange text-white rounded-full shadow-lg transition-all duration-300 z-40 btn-active-scale cursor-pointer ${
                    showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
                title="Scroll to top"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Home;

