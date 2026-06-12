import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps private routes with auth + role checks.
 *
 * Props:
 *   allowedRoles  string[]  — roles that may access this route (e.g. ['chef', 'admin'])
 *   children      ReactNode — the page component to render if access is granted
 *
 * Behaviour:
 *   - Not logged in          → redirect to /login (preserves intended destination)
 *   - Logged in, wrong role  → redirect to /
 *   - Logged in, right role  → render children
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // Wait for AuthContext to rehydrate from localStorage before deciding
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        // Preserve the page they were trying to reach so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
