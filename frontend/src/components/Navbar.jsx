import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeOrdersCount, setActiveOrdersCount] = useState(0);
    const [badgeAnimated, setBadgeAnimated] = useState(false);

    // Scroll listener for sticky navbar design
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);

    // Fetch active orders count for cart badge
    useEffect(() => {
        if (user && user.role === 'customer') {
            const fetchActiveOrders = async () => {
                try {
                    const { data } = await axiosInstance.get('/api/orders/myorders');
                    // Filter orders that are not Completed or Rejected
                    const active = data.filter(order => order.status === 'Pending' || order.status === 'Accepted');
                    
                    if (active.length !== activeOrdersCount) {
                        setActiveOrdersCount(active.length);
                        setBadgeAnimated(true);
                        setTimeout(() => setBadgeAnimated(false), 300);
                    }
                } catch (err) {
                    console.error('Error fetching active orders count:', err);
                }
            };
            
            fetchActiveOrders();
            // Poll every 15 seconds to keep badge updated
            const interval = setInterval(fetchActiveOrders, 15000);
            return () => clearInterval(interval);
        } else {
            setActiveOrdersCount(0);
        }
    }, [user, activeOrdersCount]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <nav className={`bg-white w-full sticky top-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-b border-brand-border-gray py-2' 
                : 'border-b border-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            {/* Steaming Bowl + House SVG Logo */}
                            <div className="relative p-1 bg-brand-light-orange rounded-lg mr-2.5 transition-colors group-hover:bg-brand-orange/20">
                                <svg className="h-7 w-7 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <path d="M9 17h6" />
                                    <path d="M8 14c0 2 4 2 4 0s4 2 4 0" />
                                </svg>
                            </div>
                            <span className="font-bold text-2xl text-brand-orange tracking-tight font-sans">
                                HomeBite
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center space-x-5">
                        {/* Chefs discovery link — always visible */}
                        <Link
                            to="/chefs"
                            className="hidden sm:block text-sm font-semibold text-brand-mid-gray hover:text-brand-orange transition-colors"
                        >
                            Chefs
                        </Link>
                        <Link
                            to="/how-it-works"
                            className="hidden md:block text-sm font-semibold text-brand-mid-gray hover:text-brand-orange transition-colors"
                        >
                            How It Works
                        </Link>

                        {user ? (
                            <>
                                {/* Customer Cart / Active Orders Icon */}
                                {user.role === 'customer' && (
                                    <Link 
                                        to="/customer/orders" 
                                        className="relative p-2 text-brand-dark-brown hover:text-brand-orange transition-colors rounded-full hover:bg-gray-50"
                                        title="Active Orders"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        {activeOrdersCount > 0 && (
                                            <span className={`absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white shadow-sm ring-2 ring-white ${badgeAnimated ? 'badge-pop' : ''}`}>
                                                {activeOrdersCount}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* User Profile Initials Dropdown */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center focus:outline-none"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm tracking-wide cursor-pointer shadow-sm border-2 border-brand-light-orange transition-transform hover:scale-105 btn-active-scale">
                                            {getInitials(user.name)}
                                        </div>
                                    </button>

                                    {dropdownOpen && (
                                        <>
                                            {/* Backdrop Click Handler */}
                                            <div 
                                                className="fixed inset-0 z-10" 
                                                onClick={() => setDropdownOpen(false)}
                                            ></div>
                                            
                                            {/* Dropdown Menu */}
                                            <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white py-2 shadow-xl border border-brand-border-gray z-20 transition-all duration-200 origin-top-right">
                                                <div className="px-4 py-2 border-b border-brand-border-gray">
                                                    <p className="text-sm font-semibold text-brand-dark-brown truncate">{user.name}</p>
                                                    <p className="text-xs text-brand-mid-gray truncate mt-0.5">{user.email}</p>
                                                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-brand-light-orange text-brand-orange px-2 py-0.5 rounded">
                                                        {user.role}
                                                    </span>
                                                </div>
                                                
                                                <div className="py-1">
                                                    {user.role === 'admin' && (
                                                        <Link 
                                                            to="/admin/dashboard" 
                                                            className="flex items-center px-4 py-2 text-sm text-brand-dark-brown hover:bg-brand-light-orange hover:text-brand-orange transition-colors"
                                                        >
                                                            Admin Area
                                                        </Link>
                                                    )}
                                                    {user.role === 'chef' && (
                                                        <>
                                                            <Link 
                                                                to="/chef/dashboard" 
                                                                className="flex items-center px-4 py-2 text-sm text-brand-dark-brown hover:bg-brand-light-orange hover:text-brand-orange transition-colors"
                                                            >
                                                                Chef Dashboard
                                                            </Link>
                                                            <Link 
                                                                to="/chef/profile/edit"
                                                                className="flex items-center px-4 py-2 text-sm text-brand-dark-brown hover:bg-brand-light-orange hover:text-brand-orange transition-colors"
                                                            >
                                                                Edit My Profile
                                                            </Link>
                                                            <Link 
                                                                to={`/chef/${user._id}`}
                                                                className="flex items-center px-4 py-2 text-sm text-brand-dark-brown hover:bg-brand-light-orange hover:text-brand-orange transition-colors"
                                                            >
                                                                My Public Profile
                                                            </Link>
                                                        </>
                                                    )}
                                                    {user.role === 'customer' && (
                                                        <Link 
                                                            to="/customer/orders" 
                                                            className="flex items-center px-4 py-2 text-sm text-brand-dark-brown hover:bg-brand-light-orange hover:text-brand-orange transition-colors"
                                                        >
                                                            My Orders
                                                        </Link>
                                                    )}
                                                </div>
                                                
                                                <div className="border-t border-brand-border-gray pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        Log Out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/how-it-works"
                                    className="hidden sm:block text-brand-mid-gray hover:text-brand-orange px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    How It Works
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="text-brand-mid-gray hover:text-brand-orange px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-hover-orange transition-colors shadow-sm btn-active-scale"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
