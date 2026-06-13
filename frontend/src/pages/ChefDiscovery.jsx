import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const StarDisplay = ({ rating }) => (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
        ★ {rating > 0 ? rating.toFixed(1) : 'New'}
    </span>
);

const ChefCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-brand-border-gray p-5 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
        </div>
        <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-5/6 mb-4"></div>
        <div className="h-9 bg-gray-200 rounded-xl"></div>
    </div>
);

const ChefDiscovery = () => {
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchChefs = async (cityVal = '', pageVal = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: pageVal, limit: 12 });
            if (cityVal) params.append('city', cityVal);

            const { data } = await axiosInstance.get(`/api/chefs?${params.toString()}`);
            setChefs(data.chefs);
            setTotalPages(data.pages);
            setTotal(data.total);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        const load = async () => {
            await Promise.resolve();
            if (!active) return;
            fetchChefs(cityFilter, page);
        };
        load();
        return () => { active = false; };
    }, [cityFilter, page]);

    const handleCitySearch = (e) => {
        e.preventDefault();
        setPage(1);
        setCityFilter(cityInput.trim());
    };

    const clearFilter = () => {
        setCityInput('');
        setCityFilter('');
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-brand-dark-brown tracking-tight">Meet Our Home Chefs</h1>
                <p className="text-brand-mid-gray mt-2">Real people, real kitchens, real home food.</p>
            </div>

            {/* Search / Filter Bar */}
            <div className="bg-white rounded-2xl border border-brand-border-gray p-5 mb-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <form onSubmit={handleCitySearch} className="flex gap-3 flex-col sm:flex-row">
                    <div className="flex-1 relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-mid-gray">📍</span>
                        <input
                            type="text"
                            value={cityInput}
                            onChange={e => setCityInput(e.target.value)}
                            placeholder="Search by city (e.g. Hyderabad)"
                            className="w-full pl-9 pr-4 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-hover-orange transition-colors shadow-sm"
                    >
                        Search
                    </button>
                    {cityFilter && (
                        <button
                            type="button"
                            onClick={clearFilter}
                            className="bg-brand-light-gray border border-brand-border-gray text-brand-dark-brown px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-border-gray/40 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </form>
                {cityFilter && (
                    <p className="text-xs text-brand-mid-gray mt-3 font-semibold">
                        Showing {total} verified chef{total !== 1 ? 's' : ''} in "{cityFilter}"
                    </p>
                )}
            </div>

            {/* Results count */}
            {!loading && !error && (
                <p className="text-sm text-brand-mid-gray mb-5 font-semibold">
                    {total} verified chef{total !== 1 ? 's' : ''} available
                </p>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm font-semibold text-center mb-6">
                    {error}
                </div>
            )}

            {/* Chef Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array(8).fill(0).map((_, i) => <ChefCardSkeleton key={i} />)}
                </div>
            ) : chefs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-brand-border-gray p-16 text-center max-w-md mx-auto">
                    <span className="text-5xl block mb-4">👩‍🍳</span>
                    <h3 className="text-xl font-bold text-brand-dark-brown">No chefs found</h3>
                    <p className="text-brand-mid-gray mt-2 text-sm">
                        {cityFilter ? `No verified chefs in "${cityFilter}" yet.` : 'No verified chefs available right now.'}
                    </p>
                    {cityFilter && (
                        <button onClick={clearFilter} className="mt-4 px-5 py-2 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-hover-orange transition-colors text-sm">
                            Show All Chefs
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {chefs.map(chef => (
                        <div key={chef._id} className="bg-white rounded-2xl border border-brand-border-gray p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col">
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 ${chef.isVerified ? 'border-brand-orange' : 'border-brand-border-gray'}`}>
                                    {chef.profilePhoto ? (
                                        <img src={chef.profilePhoto} alt={chef.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-brand-orange flex items-center justify-center text-white font-bold text-lg">
                                            {chef.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-extrabold text-brand-dark-brown text-sm truncate">{chef.name}</h3>
                                    {chef.city && (
                                        <p className="text-xs text-brand-mid-gray truncate">📍 {chef.city}</p>
                                    )}
                                </div>
                            </div>

                            {/* Verified badge */}
                            {chef.isVerified && (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-brand-veg-green border border-brand-veg-green/20 text-[10px] font-bold px-2 py-0.5 rounded-full self-start mb-2">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                </span>
                            )}

                            {/* Speciality */}
                            {chef.speciality && (
                                <p className="text-xs text-brand-mid-gray mb-2 line-clamp-1">
                                    🍳 {chef.speciality}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-3 text-xs font-semibold text-brand-mid-gray mb-4 mt-auto pt-3 border-t border-brand-border-gray/50">
                                <StarDisplay rating={chef.avgRating} />
                                <span>•</span>
                                <span>{chef.totalOrders} orders</span>
                            </div>

                            <Link
                                to={`/chef/${chef._id}`}
                                className="block w-full text-center bg-brand-orange text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors text-sm"
                            >
                                View Menu
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl border border-brand-border-gray text-sm font-bold text-brand-dark-brown hover:bg-brand-light-orange hover:border-brand-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ← Prev
                    </button>
                    <span className="text-sm font-semibold text-brand-mid-gray">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl border border-brand-border-gray text-sm font-bold text-brand-dark-brown hover:bg-brand-light-orange hover:border-brand-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChefDiscovery;
