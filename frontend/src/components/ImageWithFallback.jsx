import { useState } from 'react';

const ImageWithFallback = ({ src, alt, dishName, className = '' }) => {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div className={`relative flex items-center justify-center bg-gradient-to-br from-brand-orange to-amber-500 overflow-hidden ${className}`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="text-center px-4 z-10 select-none">
                    <span className="block text-white font-bold text-lg tracking-wide uppercase drop-shadow-sm truncate max-w-full">
                        {dishName || alt}
                    </span>
                    <span className="block text-amber-100 text-xs mt-1 font-medium opacity-90">
                        Homemade with love
                    </span>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-md"></div>
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-amber-300/20 blur-md"></div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden group ${className}`}>
            <img
                src={src}
                alt={alt}
                onError={() => setError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle darkening gradient overlay at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 pointer-events-none"></div>
        </div>
    );
};

export default ImageWithFallback;
