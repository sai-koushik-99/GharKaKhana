import { useState } from 'react';
import { Link } from 'react-router-dom';

const sellerSteps = [
    {
        icon: '📝',
        title: 'Sign up for free',
        desc: 'Takes 2 minutes, no paperwork, no fees. Just your name, email, and a password.',
    },
    {
        icon: '👩‍🍳',
        title: 'Create your profile',
        desc: 'Tell customers who you are, what you cook best, and where you are located.',
    },
    {
        icon: '🍛',
        title: 'Add your dishes',
        desc: 'Set your price, your menu, your schedule. You are in full control.',
    },
    {
        icon: '🔔',
        title: 'Receive orders',
        desc: 'We notify you when a customer places an order. You cook, you earn.',
    },
    {
        icon: '💰',
        title: 'Get paid',
        desc: 'Money comes to you directly and safely. Cash, UPI, or card — your choice.',
    },
];

const buyerSteps = [
    {
        icon: '🔍',
        title: 'Browse home chefs near you',
        desc: 'Discover verified home chefs in your city. See their profiles, specialities, and ratings.',
    },
    {
        icon: '🍽️',
        title: 'Pick your meal and chef',
        desc: 'Browse menus, read reviews, and choose the dish that feels like home.',
    },
    {
        icon: '🛒',
        title: 'Place your order',
        desc: 'Set your delivery time and address. Pay fully or just 25% in advance.',
    },
    {
        icon: '👩‍🍳',
        title: 'Chef prepares fresh for you',
        desc: 'Your meal is cooked fresh to order — not reheated, not mass-produced.',
    },
    {
        icon: '😋',
        title: 'Enjoy and leave a review',
        desc: 'Enjoy real home food. Share your experience to help other customers.',
    },
];

const sellerFaqs = [
    { q: 'Do I need a food licence?', a: 'For home-based cooking at small scale, a FSSAI basic registration is recommended but not mandatory to get started. We recommend getting one as you grow.' },
    { q: 'Can I cook part-time?', a: 'Absolutely. You set your own availability. Use the Open/Closed toggle in your dashboard to control when you accept orders.' },
    { q: 'What if a customer cancels?', a: 'If a customer cancels after you have accepted, the advance payment (25%) is retained as compensation for your time and ingredients.' },
    { q: 'Is there any commission?', a: 'Currently HomeBite charges no commission. You keep 100% of what you earn. This may change as the platform grows.' },
    { q: 'How do I get verified?', a: 'Complete your profile fully and our admin team will review and verify you. Verified chefs get a green badge and appear on the Chefs discovery page.' },
];

const buyerFaqs = [
    { q: 'Is the food safe to eat?', a: 'All chefs on HomeBite are verified by our team. We check their profiles and encourage FSSAI registration. You can also read reviews from other customers.' },
    { q: 'Can I cancel my order?', a: 'You can cancel before the chef accepts your order. After acceptance, the 25% advance is non-refundable as the chef has already started preparing.' },
    { q: 'How far in advance do I need to order?', a: 'Orders must be placed at least 4 hours in advance so the chef has time to prepare fresh food for you.' },
    { q: 'What payment methods are accepted?', a: 'UPI, Credit/Debit Card, and Cash on delivery are all supported.' },
];

const StepCard = ({ step, index }) => (
    <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-light-orange flex items-center justify-center text-2xl shadow-sm border border-brand-orange/10">
            {step.icon}
        </div>
        <div className="flex-1 pt-1">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-brand-orange bg-brand-light-orange px-2 py-0.5 rounded-full">Step {index + 1}</span>
            </div>
            <h3 className="font-bold text-brand-dark-brown text-base">{step.title}</h3>
            <p className="text-sm text-brand-mid-gray mt-0.5 leading-relaxed">{step.desc}</p>
        </div>
    </div>
);

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-brand-border-gray rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-5 py-4 text-left bg-white hover:bg-brand-light-gray/50 transition-colors"
            >
                <span className="font-semibold text-brand-dark-brown text-sm">{q}</span>
                <span className={`text-brand-orange transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {open && (
                <div className="px-5 pb-4 bg-brand-light-gray/30 text-sm text-brand-mid-gray leading-relaxed border-t border-brand-border-gray">
                    <p className="pt-3">{a}</p>
                </div>
            )}
        </div>
    );
};

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('buyer');

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-dark-brown tracking-tight mb-3">
                    How HomeBite Works
                </h1>
                <p className="text-brand-mid-gray text-base max-w-xl mx-auto">
                    Whether you want to order home food or start earning from your kitchen — it takes just a few minutes to get started.
                </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex justify-center mb-10">
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-brand-border-gray gap-1">
                    <button
                        onClick={() => setActiveTab('buyer')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'buyer' ? 'bg-brand-orange text-white shadow-sm' : 'text-brand-mid-gray hover:text-brand-dark-brown'}`}
                    >
                        🙋 I want to order food
                    </button>
                    <button
                        onClick={() => setActiveTab('seller')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'seller' ? 'bg-brand-orange text-white shadow-sm' : 'text-brand-mid-gray hover:text-brand-dark-brown'}`}
                    >
                        👩‍🍳 I want to sell food
                    </button>
                </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-2xl border border-brand-border-gray shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 mb-10">
                <h2 className="text-xl font-extrabold text-brand-dark-brown mb-8">
                    {activeTab === 'buyer' ? '5 steps to your next home-cooked meal' : '5 steps to start earning from your kitchen'}
                </h2>
                <div className="space-y-7">
                    {(activeTab === 'buyer' ? buyerSteps : sellerSteps).map((step, i) => (
                        <StepCard key={i} step={step} index={i} />
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className={`rounded-2xl p-8 text-center mb-10 ${activeTab === 'buyer' ? 'bg-brand-light-orange border border-brand-orange/20' : 'bg-emerald-50 border border-brand-veg-green/20'}`}>
                {activeTab === 'buyer' ? (
                    <>
                        <p className="text-brand-dark-brown font-bold text-lg mb-1">Ready to taste home food?</p>
                        <p className="text-brand-mid-gray text-sm mb-4">Browse verified home chefs near you and place your first order today.</p>
                        <Link to="/chefs" className="inline-block bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-hover-orange transition-colors shadow-sm">
                            Browse Chefs →
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="text-brand-dark-brown font-bold text-lg mb-1">Ready to turn your kitchen into a business?</p>
                        <p className="text-brand-mid-gray text-sm mb-4">Join hundreds of home chefs already earning on HomeBite. It's free.</p>
                        <Link to="/register" className="inline-block bg-brand-veg-green text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                            Join as a Chef — It's Free →
                        </Link>
                    </>
                )}
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-xl font-extrabold text-brand-dark-brown mb-5">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    {(activeTab === 'buyer' ? buyerFaqs : sellerFaqs).map((faq, i) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
