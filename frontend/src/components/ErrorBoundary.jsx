import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <span className="text-6xl block mb-4">😵</span>
                        <h1 className="text-2xl font-extrabold text-brand-dark-brown mb-2">Something went wrong</h1>
                        <p className="text-brand-mid-gray text-sm mb-6">
                            An unexpected error occurred. Please refresh the page to continue.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
