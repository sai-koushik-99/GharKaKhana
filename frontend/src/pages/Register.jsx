import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); // Default role
    const [error, setError] = useState('');

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'chef' && (user.onboardingStep === 0 || user.onboardingStep === undefined)) {
                navigate('/chef/onboarding');
            } else if (user.role === 'chef') {
                navigate('/chef/dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-brand-border-gray/50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-light-orange text-brand-orange mb-4 shadow-sm">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-brand-dark-brown tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-brand-mid-gray">
                        Join HomeBite to access fresh homemade food
                    </p>
                </div>
                
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-xl relative block w-full px-3.5 py-2.5 border border-brand-border-gray placeholder-gray-400 text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange sm:text-sm bg-brand-light-gray/40 transition-all font-semibold"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-3.5 py-2.5 border border-brand-border-gray placeholder-gray-400 text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange sm:text-sm bg-brand-light-gray/40 transition-all font-semibold"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-3.5 py-2.5 border border-brand-border-gray placeholder-gray-400 text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange sm:text-sm bg-brand-light-gray/40 transition-all font-semibold"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Join HomeBite as a:</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="block w-full px-3.5 py-2.5 border border-brand-border-gray text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange sm:text-sm rounded-xl bg-white cursor-pointer hover:border-brand-orange transition-colors font-semibold"
                            >
                                <option value="customer">🙋‍♂️ Customer (Order Food)</option>
                                <option value="chef">🧑‍🍳 Home Chef (Sell Food)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-orange hover:bg-brand-hover-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all shadow-sm btn-active-scale cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="text-center text-sm text-brand-mid-gray pt-2 border-t border-brand-border-gray">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-brand-orange hover:text-brand-hover-orange transition-colors">
                            Log in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
