import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, user } = useContext(AuthContext);
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
            await login(email, password);
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-brand-dark-brown tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-brand-mid-gray">
                        Log in to order fresh homemade meals
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
                            <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                id="email-address"
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
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-3.5 py-2.5 border border-brand-border-gray placeholder-gray-400 text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange sm:text-sm bg-brand-light-gray/40 transition-all font-semibold"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-orange hover:bg-brand-hover-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all shadow-sm btn-active-scale cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center text-sm text-brand-mid-gray pt-2 border-t border-brand-border-gray">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-brand-orange hover:text-brand-hover-orange transition-colors">
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
