import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const StarPicker = ({ value, onChange }) => (
    <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map(star => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className={`text-4xl transition-transform hover:scale-110 focus:outline-none ${star <= value ? 'text-amber-400' : 'text-gray-200'}`}
            >
                ★
            </button>
        ))}
    </div>
);

/**
 * ReviewModal
 * Props:
 *   orderId   string   — the order being reviewed
 *   chefName  string   — shown in the modal heading
 *   onClose   fn       — called when modal should close
 *   onSuccess fn       — called after successful submission
 */
const ReviewModal = ({ orderId, chefName, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await axiosInstance.post('/api/reviews', { orderId, rating, comment });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSubmitting(false);
        }
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] px-4 pb-4 sm:pb-0"
            onClick={onClose}
        >
            {/* Modal panel — bottom sheet on mobile, centered on desktop */}
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h3 className="text-xl font-extrabold text-brand-dark-brown">Rate your order</h3>
                        <p className="text-sm text-brand-mid-gray mt-0.5">from Chef {chefName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-brand-mid-gray hover:text-brand-dark-brown transition-colors p-1"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold text-center">
                            {error}
                        </div>
                    )}

                    {/* Star picker */}
                    <div>
                        <p className="text-xs font-bold text-brand-mid-gray uppercase tracking-wider text-center mb-3">
                            How was the food?
                        </p>
                        <StarPicker value={rating} onChange={setRating} />
                        {rating > 0 && (
                            <p className="text-center text-xs text-brand-mid-gray mt-2 font-semibold">
                                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">
                            Your comment (optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Tell others about the taste, freshness, packaging..."
                            rows={3}
                            maxLength={500}
                            className="w-full px-3.5 py-2.5 border border-brand-border-gray rounded-xl text-sm font-semibold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-brand-light-gray/40 resize-none"
                        />
                        <p className="text-xs text-brand-mid-gray text-right mt-1">{comment.length}/500</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-brand-light-gray border border-brand-border-gray text-brand-dark-brown py-2.5 rounded-xl font-bold text-sm hover:bg-brand-border-gray/40 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-brand-orange text-white py-2.5 rounded-xl font-bold text-sm hover:bg-brand-hover-orange transition-colors shadow-sm disabled:bg-gray-300"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
