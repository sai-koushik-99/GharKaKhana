import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
            <span className="text-7xl block mb-4">🍽️</span>
            <h1 className="text-5xl font-extrabold text-brand-orange mb-2">404</h1>
            <h2 className="text-xl font-bold text-brand-dark-brown mb-3">Page not found</h2>
            <p className="text-brand-mid-gray text-sm mb-8">
                Looks like this page went out of stock. Let's get you back to the menu.
            </p>
            <Link
                to="/"
                className="inline-block bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm"
            >
                Back to Menu
            </Link>
        </div>
    </div>
);

export default NotFound;
