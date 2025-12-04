// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import {
    ArrowRight,
    Star,
    Truck,
    Shield,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    Eye,
    ArrowUpRight,
    Ruler,
    Info,
    Quote,
    Calendar,
    Sparkles,
    Headphones,
    RefreshCcw, // Using RefreshCcw from V2 for consistency/modern look
    Mail,
    MapPin,
    Phone
} from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiYoutube } from 'react-icons/si';

// NOTE: Ensure your Tailwind config includes:
// - A 'primary' color.
// - A 'gold-light' color.
// - A 'text-gradient-gold' class (e.g., via a custom utility or gradient stop definition).

// Mock Service Import (Keeping for structure, but using inline mock data)
// import { bestSellerService } from '../services/bestSellerService';

// =========================================================================
// ============================= ASSET IMPORTS (From V2) ===================
// =========================================================================
import cricketHeroImage from '../assets/cricket-Hero-Image.png';
import batImage from '../assets/generated_images/premium_cricket_bat_product.png'; // Used for Category Bats
import padsImage from '../assets/generated_images/cricket_pads_product_shot.png'; // Used for Category Pads / Bestsellers Mock
import glovesImage from '../assets/generated_images/cricket_gloves_product_shot.png'; // Used for Category Gloves / Bestsellers Mock
import helmetImage from '../assets/generated_images/cricket_helmet_product_shot.png'; // Used for Category Helmets / Bestsellers Mock
import ballImage from '../assets/generated_images/cricket_ball_product_shot.png'; // Used for Category Balls
import accessoriesImage from '../assets/generated_images/cricket_accessories_product_shot.png'; // Used for Category Accessories
import proSeriesImage from '../assets/generated_images/pro_series_action_shot.png'; // Used for Featured Collections
import starterKitImage from '../assets/generated_images/starter_kit_flat_lay.png'; // Used for Featured Collections
import newArrivalImage from '../assets/generated_images/new_arrival_3d_bat_render.png'; // Used for New Arrivals Promo BG
import pitchImage from '../assets/generated_images/cricket_pitch_editorial_photo.png'; // Used for Tips & News
import trainingImage from '../assets/generated_images/cricket_training_editorial.png';
import craftImage from '../assets/generated_images/bat_craftsmanship_editorial.png';

// =========================================================================
// ============================= MOCK DATA (From V2) =======================
// =========================================================================

/** @type {Product[]} */
const BESTSELLERS_DATA = [
    // Retaining V1 structure/naming but with V2 data flavor
    { id: "1", name: "Phoenix Elite Bat (SH)", price: 34999, originalPrice: 39999, rating: 5, reviews: 120, image: batImage, badge: 'NEW' },
    { id: "2", name: "Legend Batting Pads", price: 4500, originalPrice: 5500, rating: 4.5, reviews: 85, image: padsImage, badge: 'POPULAR' },
    { id: "3", name: "Elite Wicket Keeping Gloves", price: 6200, rating: 5, reviews: 40, image: glovesImage },
    { id: "4", name: "Pro Series Helmet", price: 7800, rating: 4, reviews: 65, image: helmetImage },
    { id: "5", name: "Leather Cricket Ball (Red)", price: 1500, rating: 4.8, reviews: 150, image: ballImage },
];

const CATEGORIES_DATA = [
    { id: 1, name: 'Cricket Bats', image: batImage, count: '120+ Products' },
    { id: 2, name: 'Batting Pads', image: padsImage, count: '85+ Products' },
    { id: 3, name: 'Gloves', image: glovesImage, count: '95+ Products' },
    { id: 4, name: 'Helmets', image: helmetImage, count: '45+ Products' },
    { id: 5, name: 'Cricket Balls', image: ballImage, count: '60+ Products' },
    { id: 6, name: 'Accessories', image: accessoriesImage, count: '200+ Products' }
];

const BRANDS_DATA = [
    { name: 'Kookaburra', logo: 'KOOKABURRA' },
    { name: 'Gray-Nicolls', logo: 'GRAY-NICOLLS' },
    { name: 'GM', logo: 'GM' },
    { name: 'MRF', logo: 'MRF' },
    { name: 'SG', logo: 'SG' },
    { name: 'SS', logo: 'SS' },
    { name: 'New Balance', logo: 'NEW BALANCE' },
    { name: 'Puma', logo: 'PUMA' },
    { name: 'Adidas', logo: 'ADIDAS' },
    { name: 'Masuri', logo: 'MASURI' }
];

const TESTIMONIALS_DATA = [
    { id: 1, name: 'Rajesh Kumar', role: 'State Level Player', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', content: 'The Kookaburra Kahuna Pro I bought from Cricket Legacy has completely transformed my game. The balance and pickup are phenomenal.', rating: 5 },
    { id: 2, name: 'Priya Sharma', role: 'Club Captain', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', content: 'Outstanding customer service! They helped me find the perfect bat for my daughter. The size guide was incredibly accurate.', rating: 5 },
    { id: 3, name: 'Amit Patel', role: 'Cricket Coach', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', content: "I've been ordering equipment for my academy from Cricket Legacy for 5 years. Best prices, authentic products, and fast delivery.", rating: 5 },
    { id: 4, name: 'Sneha Reddy', role: 'Junior National Player', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', content: 'The Pro Series gloves are worth every rupee. Superior protection without compromising on flexibility. Highly recommended!', rating: 5 },
    { id: 5, name: 'Vikram Singh', role: 'Weekend Warrior', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', content: 'Finally found a reliable store for authentic cricket gear. The starter kit for my son was exactly as described. Great quality!', rating: 5 }
];

const ARTICLES_DATA = [
    { id: 1, title: 'How to Choose the Perfect Cricket Bat', excerpt: 'A comprehensive guide to selecting the right bat based on your playing style, height, and skill level.', image: craftImage, category: 'Guide', date: 'Nov 28, 2024', readTime: '5 min read' },
    { id: 2, title: '5 Drills to Improve Your Batting Technique', excerpt: 'Professional training exercises that will help you develop better footwork and shot selection.', image: trainingImage, category: 'Tips', date: 'Nov 25, 2024', readTime: '4 min read' },
    { id: 3, title: 'Caring for Your Cricket Equipment', excerpt: 'Expert tips on maintaining your gear to ensure optimal performance and longevity.', image: pitchImage, category: 'Maintenance', date: 'Nov 22, 2024', readTime: '8 min read' }
];

// NOTE: CSS for custom utilities. If you are using a standard React/Tailwind setup, 
// you should place this CSS in a global stylesheet (e.g., App.css or index.css) or configure 
// Tailwind JIT/Custom Utilities to handle them.

// For demonstration, these selectors target the components as defined in the JSX.

const customStyles = `
/* Custom Tailwind Animations for Marquees and Promos */
@keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
}

.animate-marquee {
    animation: marquee 30s linear infinite;
    width: 200%; /* Double the width to hide the jump */
}

.animate-scroll-testimonials {
    animation: marquee 40s linear infinite;
    width: 200%; 
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.animate-float {
    animation: float 4s ease-in-out infinite;
}

@keyframes glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
}

.animate-glow {
    animation: glow 3s ease-in-out infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* Example Gradient Class - Assumes primary and gold-light are configured */
.text-gradient-gold {
    background-image: linear-gradient(90deg, #ffdb58, var(--color-primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
`;

// Inject the custom styles for the preview (In a real app, use CSS file or Tailwind config)
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = customStyles;
    document.head.appendChild(style);
}

// =========================================================================
// ========================== MAIN HOME COMPONENT ==========================
// =========================================================================

const Home = () => {
    const [bestsellers, setBestsellers] = useState([]);
    const [loadingBestsellers, setLoadingBestsellers] = useState(true);

    // Fetch Bestsellers on mount (Using V2 data structure in V1 useEffect logic)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Mocking API call:
                // const bestsellersResponse = await bestSellerService.getBestSellers();
                // setBestsellers(bestsellersResponse.data || []);
                setBestsellers(BESTSELLERS_DATA);

            } catch (error) {
                console.error('Failed to fetch best sellers:', error);
            } finally {
                setLoadingBestsellers(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        // Retaining V1's main wrapper styling
        <div className="home min-h-screen" style={{backgroundColor: 'var(--bg)'}} data-page="home">
            <header>{/* Your Header Component Goes Here */}</header>

            <main id="main-content">
                {/* ================== HERO (Light/Dark Contrast) ================== */}
                <section className="hero-stadium w-full min-h-[70vh] flex items-center justify-center relative" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="absolute inset-0 opacity-50 overflow-hidden">
                        <img
                            src={cricketHeroImage}
                            alt="Cricket Stadium"
                            className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0" style={{background: document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.7)'}} />
                    </div>
                    <div className="relative z-10 text-center container p-8">
                        {/* Text remains light against dark background */}
                        <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-4 text-gradient-gold drop-shadow-lg">
                            CRICKET LEGACY
                        </h1>
                        <p className="font-body text-xl text-white/80 max-w-3xl mx-auto">
                            Gear Up Like a Champion — Elite equipment trusted by international players since 1987.
                        </p>
                        <Link
                            to="/products"
                            className="mt-8 inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 shadow-xl shadow-primary/30"
                        >
                            Shop The Collections
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* ================== VALUE PROPS (Light Background) ================== */}
                <div className="value-props-section">
                    <ValuePropsSection />
                </div>
                <hr style={{borderColor: 'var(--line)'}} />

                {/* ================== SHOP BY CATEGORY (Light Background) ================== */}
                <div className="categories-section">
                    <CategoryGrid categories={CATEGORIES_DATA} />
                </div>

                {/* ================== FEATURED COLLECTIONS (Light Background) ================== */}
                <div className="featured-collections">
                    <FeaturedCollections />
                </div>

                {/* ================== BESTSELLERS (Darker Contrast Section) ================== */}
                <div className="bestsellers-section">
                    <BestsellersSection bestsellers={bestsellers} loading={loadingBestsellers} />
                </div>

                {/* ================== SHOP BY BRAND (Light Background) ================== */}
                <div className="brands-section">
                    <ShopByBrand brands={BRANDS_DATA} />
                </div>

                {/* ================== NEW ARRIVALS PROMO BLOCK (Dark Contrast Section) ================== */}
                <NewArrivalsSection />

                {/* ================== SIZE GUIDE (Light Background) ================== */}
                <div className="size-guide-section">
                    <SizeGuide />
                </div>

                {/* ================== TIPS & NEWS (Light Background) ================== */}
                <div className="tips-news-section">
                    <CricketTipsNews articles={ARTICLES_DATA} />
                </div>

                {/* ================== TESTIMONIALS (Darker Contrast Section) ================== */}
                <div className="testimonials-section">
                    <CustomerTestimonials testimonials={TESTIMONIALS_DATA} />
                </div>

                {/* ================== NEWSLETTER (Light/Dark Contrast) - V1 style retained ================== */}
                <section
                    className="newsletter-section newsletter py-16 border-t"
                    aria-labelledby="news-title"
                >
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="news-text text-center md:text-left">
                            <h2 id="news-title" className="font-display text-3xl font-bold text-gray-900">
                                Get match-winning deals 🏆
                            </h2>
                            <p className="font-body text-gray-600">
                                Sign up for exclusive drops, tips &amp; early access.
                            </p>
                        </div>
                        <form
                            className="news-form flex gap-4 w-full md:w-auto"
                            onSubmit={(e) => e.preventDefault()}
                            aria-label="Subscribe to newsletter"
                        >
                            <label className="sr-only" htmlFor="email-news">
                                Email
                            </label>
                            <input
                                id="email-news"
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="flex-grow p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-primary focus:border-primary transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary px-6 py-3 font-semibold bg-primary text-white hover:bg-primary/90 transition-opacity rounded-xl shadow-lg shadow-primary/30"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;

/* ===================================================================== */
/* ======================= SECTION COMPONENTS (MERGED) =================== */
/* ===================================================================== */

// Component for Product Card (Retaining V1 styling for Bestseller Section)
const ProductCard = ({ product, onMouseEnter, onMouseLeave, isHovered }) => {
    const {
        id, // Changed to 'id' from '_id' for V2 data consistency
        name,
        price,
        originalPrice,
        rating = 5,
        reviews = 0,
        image,
        badge
    } = product;

    return (
        <div
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Link to={`/products/${id}`} className="block">
                {/* Card: bg-white with light shadows and border */}
                <div className="group card-bg rounded-2xl overflow-hidden card-hover transition-all duration-300 transform hover:-translate-y-1 shadow-lg border">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Badge */}
                        {badge && (
                            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-md z-20">
                                {badge}
                            </span>
                        )}


                    </div>

                    {/* Content */}
                    <div className="p-5">


                        {/* Name */}
                        <h3 className="font-display text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                            {name}
                        </h3>

                        {/* Price and Cart */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                                <span className="font-body text-xl font-bold text-primary">
                                    ₹{price.toLocaleString()}
                                </span>
                                {originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                        ₹{originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

/* ---------- VALUE PROPS (Retaining V1 Style) ---------- */
const ValuePropsSection = () => {
    const props = [
        { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹2,999' },
        { icon: Shield, title: '100% Authentic', description: 'Guaranteed genuine products' },
        { icon: RefreshCcw, title: 'Easy Returns', description: '30-day hassle-free returns' },
        { icon: Headphones, title: 'Expert Support', description: 'Cricket experts at your service' }
    ];

    return (
        // V1 Styling
        <section className="py-8" style={{backgroundColor: 'var(--bg-hover)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {props.map((prop) => (
                        <div
                            key={prop.title}
                            className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left"
                        >
                            {/* Circle Accent - Primary/Light background */}
                            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/10">
                                <prop.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                {/* Text is dark/gray */}
                                <div className="font-display text-sm font-bold text-gray-900">{prop.title}</div>
                                <div className="font-body text-xs text-gray-600">{prop.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ---------- SECTION 2: SHOP BY CATEGORY (Retaining V1 Style, using V2 images) ---------- */
const CategoryGrid = () => {
    // Uses CATEGORIES_DATA from V2 asset paths
    const categories = CATEGORIES_DATA;

    return (
        <section id="categories" className="py-24" style={{backgroundColor: 'var(--bg)'}}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-body font-semibold text-primary tracking-widest uppercase mb-4">
                        Browse Collection
                    </span>
                    <h2 className="section-title font-display text-4xl md:text-5xl font-bold mb-4">
                        Shop by Category
                    </h2>
                    <p className="section-text font-body max-w-2xl mx-auto">
                        Explore our extensive range of premium cricket equipment, carefully curated for players of all levels.
                    </p>
                </div>

                {/* Grid - V1 Styling retained */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.name.split(' ')[0].toLowerCase()}`}
                            // 🛑 MODIFIED: Changed aspect-[4/5] to aspect-[3/2] to make the cards shorter (smaller overall size).
                            className="group relative aspect-[3/2] rounded-3xl overflow-hidden card-hover shadow-lg transition-shadow duration-500 hover:shadow-gray-400 border border-gray-200"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Image (V2 Image Path) */}
                            <img
                                src={category.image}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay is darker now for contrast with light text */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                            {/* Content is light text */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className="font-display text-3xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                        <p className="font-body text-sm text-white/80 font-semibold">
                                            {category.count}
                                        </p>
                                    </div>
                                    {/* Circle is Primary accent, white icon on hover */}
                                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 transform group-hover:scale-105">
                                        <ArrowUpRight className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ---------- SECTION 3: FEATURED COLLECTIONS (Retaining V1 Style, using V2 images) ---------- */
const FeaturedCollections = () => {
    return (
        <section id="collections" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-body font-semibold text-primary tracking-widest uppercase mb-4">
                        Curated For You
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
                        Featured Collections
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pro Series */}
<Link
    to="/products?collection=pro-series"
    className="group relative rounded-3xl overflow-hidden min-h-[500px] card-hover shadow-xl shadow-gray-300
    transition-all duration-500 hover:shadow-black/20 border border-gray-300 hover:border-black"
>
    <img
        src={proSeriesImage}
        alt="Pro Series Collection"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    {/* Soft gradient */}
    <div className="absolute inset-0" style={{background: document.documentElement.getAttribute('data-theme') === 'dark' ? 'linear-gradient(to right, rgba(251,191,36,0.8) 0%, rgba(251,191,36,0.4) 50%, transparent 100%)' : 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'}} />

    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full max-w-md">
        <span className="inline-block px-4 py-1 rounded-full bg-black/10 text-black text-sm font-semibold mb-6 w-fit border border-black/20">
            PROFESSIONAL GEAR
        </span>

        <h3 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pro Series
        </h3>

        <p className="font-body text-gray-700 mb-8">
            Elite equipment used by international players. Engineered for peak performance using
            premium **Grade 1+ English Willow** and aerospace-grade materials.
        </p>

        {/* Updated Black Button */}
        <div
            className="group/btn w-fit px-6 py-4 rounded-xl flex items-center gap-2 font-semibold
            bg-black text-white border-2 border-black
            hover:bg-white hover:text-black hover:shadow-xl hover:shadow-black/20
            hover:ring-2 hover:ring-black hover:ring-offset-2
            transition-all duration-300"
        >
            Explore Pro Series
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </div>
    </div>
</Link>

{/* Starter Kits */}
<Link
    to="/products?collection=starter-kits"
    className="group relative rounded-3xl overflow-hidden min-h-[500px] card-hover bg-white shadow-xl shadow-gray-300
    transition-all duration-500 hover:shadow-black/20 border border-gray-300 hover:border-black"
>
    <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-3/4 h-full">
            <img
                src={starterKitImage}
                alt="Starter Kits Collection"
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
        </div>

        {/* Gradient */}
        <div className="absolute inset-0" style={{background: document.documentElement.getAttribute('data-theme') === 'dark' ? 'linear-gradient(to right, rgba(251,191,36,0.8) 0%, rgba(251,191,36,0.4) 50%, transparent 100%)' : 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'}} />
    </div>

    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full max-w-md">
        <span className="inline-block px-4 py-1 rounded-full bg-black/10 text-black text-sm font-semibold mb-6 w-fit border border-black/20">
            BEST VALUE
        </span>

        <h3 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Starter Kits
        </h3>

        <p className="font-body text-gray-700 mb-4">
            Everything you need to begin your cricket journey. Quality equipment bundled at
            unbeatable prices for aspiring champions.
        </p>

        <div className="flex items-center gap-4 mb-8">
            <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-primary">₹4,999</span>
                <span className="text-gray-500 line-through">₹7,499</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-700 text-sm font-semibold border border-green-500/50">
                Save 33%
            </span>
        </div>

        {/* Updated Black Button */}
        <div
            className="group/btn w-fit px-6 py-5 rounded-xl flex items-center gap-2 font-semibold
            bg-black text-white border-2 border-black
            hover:bg-white hover:text-black hover:shadow-xl hover:shadow-black/20
            hover:ring-2 hover:ring-black hover:ring-offset-2
            transition-all duration-300"
        >
            Shop Starter Kits
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </div>
    </div>
</Link>

                </div>
            </div>
        </section>
    );
};

/* ---------- BESTSELLERS (CAROUSEL - Retaining V1 Style, using V2 data/images) ---------- */
const BestsellersSection = ({ bestsellers, loading }) => {
    const [hoveredId, setHoveredId] = useState(null);
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        if (!carouselRef.current) return;
        carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    };

    const scrollRight = () => {
        if (!carouselRef.current) return;
        carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    };

    if (loading)
        return (
            <div className="py-24 text-center bg-gray-900 text-white">
                Loading Bestsellers...
            </div>
        );
    if (bestsellers.length === 0) return null;

    return (
        // Changed to a dark background for visual contrast against the light sections
        <section id="bestsellers" className="py-24 bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <span className="inline-block text-sm font-body font-semibold text-primary tracking-widest uppercase mb-4">
                            Fan Favorites
                        </span>
                        {/* Text is white */}
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                            Bestsellers
                        </h2>
                    </div>
                    {/* Navigation Buttons - Dark background, primary hover */}
                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <Link to="/products" className="group inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-colors duration-300">
                             View All Products
                             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button
                            onClick={scrollLeft}
                            className="w-12 h-12 rounded-full border border-gray-700 bg-gray-800 hover:border-primary hover:bg-primary/20 flex items-center justify-center transition-all duration-300"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="w-12 h-12 rounded-full border border-gray-700 bg-gray-800 hover:border-primary hover:bg-primary/20 flex items-center justify-center transition-all duration-300"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Carousel (Using light-themed ProductCard components inside a dark section) */}
                <div
                    ref={carouselRef}
                    className="flex gap-6 overflow-x-scroll pb-4 pt-2 scrollbar-hide snap-x snap-mandatory"
                    // Inline style for scrollbar hide in browsers that respect it
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {bestsellers.map((product) => (
                        // Used the Light Theme ProductCard defined above
                        <ProductCard
                            key={product.id}
                            product={product}
                            onMouseEnter={() => setHoveredId(product.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            isHovered={hoveredId === product.id}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ---------- SHOP BY BRAND (MARQUEE - Retaining V1 Style/Data) ---------- */
const ShopByBrand = ({ brands }) => {
    return (
        <section id="brands" className="py-16 bg-white border-y border-gray-300 overflow-hidden">
            <div className="container mx-auto px-4 mb-8">
                <div className="text-center">
                    <span className="inline-block text-sm font-body font-semibold text-primary tracking-widest uppercase">
                        Trusted by Champions
                    </span>
                </div>
            </div>

            {/* Marquee Container - Fade from white/light background */}
            <div className="relative">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent opacity-95 z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent opacity-95 z-10" />

                {/* Marquee Track */}
                {/* NOTE: .animate-marquee class must be defined in CSS for the animation to work */}
                <div className="flex animate-marquee">
                    {[...brands, ...brands].map((brand, index) => (
                        <div key={`${brand.name}-${index}`} className="flex-shrink-0 px-12 py-6">
                            <Link to={`/products?brand=${brand.name}`} className="block">
                                {/* Text is dark/gray, fades to primary on hover */}
                                <span className="font-display text-3xl md:text-4xl font-bold text-gray-400 hover:text-primary/70 transition-colors duration-300 cursor-pointer whitespace-nowrap">
                                    {brand.logo}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ---------- NEW ARRIVALS PROMO (Retaining V1 Style, using V2 image/animation) ---------- */
const NewArrivalsSection = () => {
    return (
        <section 
            style={{
                position: 'relative',
                minHeight: '600px',
                overflow: 'hidden',
                color: 'white',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {/* Background Image - Full Section */}
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1
                }}
            >
                <img
                    src={newArrivalImage}
                    alt="Cricket Bat Background"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center right'
                    }}
                />
                {/* Dark Overlay for text readability */}
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to right, rgba(10, 15, 25, 0.95) 0%, rgba(10, 15, 25, 0.7) 50%, transparent 100%)'
                    }}
                />
            </div>

            {/* Content */}
            <div 
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '80px 16px',
                    position: 'relative',
                    zIndex: 10,
                    width: '100%'
                }}
            >
                <div 
                    style={{
                        maxWidth: '500px'
                    }}
                > 
                    {/* 'JUST LANDED' Tag */}
                    <div 
                        style={{
                            display: 'inline-flex',
                            padding: '6px 12px',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            marginBottom: '24px'
                        }}
                    >
                        JUST LANDED
                    </div>

                    {/* Title */}
                    <h2 
                        style={{
                            fontSize: '72px',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '24px',
                            lineHeight: '1.1'
                        }}
                    >
                        The All-New
                    </h2>

                    {/* Description */}
                    <p 
                        style={{
                            fontSize: '16px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '32px',
                            lineHeight: '1.6'
                        }}
                    >
                        Experience unmatched power and precision with our revolutionary Phoenix Elite bat. 
                        Featuring aerospace-grade carbon fiber spine and Grade 1+ English Willow.
                    </p>

                    {/* Price/Limit Display */}
                    <div 
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            padding: '24px',
                            width: 'fit-content',
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(10px)',
                            marginBottom: '32px'
                        }}
                    >
                        <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.2)', paddingRight: '32px' }}>
                            <div 
                                style={{
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginBottom: '4px'
                                }}
                            >
                                ₹34,999
                            </div>
                            <div 
                                style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                }}
                            >
                                Launch Price
                            </div>
                        </div>
                        <div style={{ paddingLeft: '32px' }}>
                            <div 
                                style={{
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginBottom: '4px'
                                }}
                            >
                                Limited
                            </div>
                            <div 
                                style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                }}
                            >
                                First 100 Units
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div 
                        style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap'
                        }}
                    >
                        {/* Primary Button */}
                        <button 
                            style={{
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: '600',
                                background: '#d4a027',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Pre-Order Now
                            <span>→</span>
                        </button>
                        {/* Secondary Button */}
                        <button
                            style={{
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: '600',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            View Details
                        </button>
                    </div>

                    {/* Badge positioned absolutely on the right side */}
                    <div 
                        style={{
                            position: 'absolute',
                            top: '80px',
                            right: '200px',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            zIndex: 20
                        }}
                    >
                        <span 
                            style={{
                                fontSize: '13px',
                                fontWeight: '500',
                                color: 'white'
                            }}
                        >
                            Grade 1+ Willow
                        </span>
                    </div>

                    {/* Carbon Fiber Spine text */}
                    <div 
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: '100px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            letterSpacing: '3px'
                        }}
                    >
                        Carbon Fiber Spine
                    </div>
                </div>
            </div>
        </section>
    );
};
const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('bats');

  const sizeData = {
    bats: [
      { size: "Short Handle (SH)", height: "5'9\" - 6'2\"", weight: "2.7 - 2.10 lbs", age: '15+ years' },
      { size: "Long Handle (LH)", height: "6'2\" and above", weight: "2.8 - 2.11 lbs", age: '15+ years' },
      { size: "Harrow", height: "5'4\" - 5'7\"", weight: "2.4 - 2.6 lbs", age: '13-15 years' },
      { size: "Size 6", height: "5'0\" - 5'4\"", weight: "2.2 - 2.4 lbs", age: '11-13 years' },
      { size: "Size 5", height: "4'7\" - 5'0\"", weight: "2.0 - 2.2 lbs", age: '10-11 years' },
    ],
    pads: [
      { size: "Men's Regular", height: "5'6\" - 5'10\"", fit: 'Standard calf', age: '14+ years' },
      { size: "Men's Large", height: "5'10\" and above", fit: 'Large calf', age: 'Adult' },
      { size: "Youth", height: "5'0\" - 5'6\"", fit: 'Medium calf', age: '10-14 years' },
      { size: "Boys", height: "4'6\" - 5'0\"", fit: 'Small calf', age: 'Up to 10 years' }
    ],
    gloves: [
      { size: "Men's Regular", palm: "7.5\" - 8.5\"", fit: 'Standard', age: '14+ years' },
      { size: "Men's Large", palm: "8.5\"+", fit: 'Wide palm', age: 'Adult' },
      { size: "Youth", palm: "6.5\" - 7.5\"", fit: 'Slim adult', age: '10-14 years' },
      { size: "Boys", palm: "5.5\" - 6.5\"", fit: 'Junior fingers', age: 'Up to 10 years' }
    ]
  };

  const tabs = [
    { key: 'bats', label: 'Cricket Bats' },
    { key: 'pads', label: 'Batting Pads' },
    { key: 'gloves', label: 'Gloves' }
  ];

  const getHeader = (tabKey) => {
    switch (tabKey) {
      case 'bats': return 'Player Height';
      case 'gloves': return 'Hand Size';
      case 'pads': return 'Player Height';
      default: return 'Measurement';
    }
  };

  const getFinalHeader = (tabKey) => {
    switch (tabKey) {
      case 'bats': return 'Weight';
      case 'gloves':
      case 'pads': return 'Fit / Details';
      default: return 'Details';
    }
  };

  return (
    <section id="size-guide" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500 bg-amber-100 mb-6">
            <Ruler className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-black">Find Your Perfect Fit</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Size Guide
          </h2>

          <p className="text-black/70 max-w-2xl mx-auto">
            Use our comprehensive size chart to find the perfect equipment for your game.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-black shadow-inner shadow-black/20">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                  activeTab === tab.key
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40 font-semibold'
                    : 'text-black hover:bg-black hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-black overflow-hidden shadow-xl shadow-black/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white uppercase">
                    <th className="px-6 py-4 text-left text-sm font-bold">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">{getHeader(activeTab)}</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Age Range</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">{getFinalHeader(activeTab)}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/20">
                  {sizeData[activeTab].map((row, index) => (
                    <tr key={index} className="hover:bg-amber-50 transition duration-200">
                      <td className="px-6 py-4 font-semibold text-amber-700">{row.size}</td>
                      <td className="px-6 py-4 text-black">
                        {'height' in row ? row.height : 'palm' in row ? row.palm : ''}
                      </td>
                      <td className="px-6 py-4 text-black">{row.age}</td>
                      <td className="px-6 py-4 text-black">
                        {'weight' in row ? row.weight : 'fit' in row ? row.fit : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pro Tip */}
            <div className="p-5 bg-amber-50 border-t border-amber-200 flex items-start gap-4">
              <Info className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-sm text-black">
                <strong className="text-amber-700">Pro Tip:</strong> Measure your height and wrist-to-floor distance to ensure the best pad fit.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
/* ---------- CRICKET TIPS & NEWS (Retaining V1 Style, using V2 data/images) ---------- */
const CricketTipsNews = ({ articles }) => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <span className="inline-block text-sm font-body font-semibold text-primary tracking-widest uppercase mb-4">
                            Knowledge Hub
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
                            Tips & News
                        </h2>
                    </div>
                    <a
                        href="/blog"
                        className="group inline-flex items-center gap-2 text-primary font-semibold mt-4 md:mt-0 hover:underline"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                {/* Articles Grid - Light card styling (V1 styling with V2 data/images) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-200 card-hover shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"
                        >
                            <Link to={`/blog/${article.id}`} className="block">
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-md">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta - Primary text accents on date */}
                                    <div className="flex items-center gap-4 text-sm text-primary/70 font-medium mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{article.date}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{article.readTime}</span>
                                    </div>

                                    {/* Title - Dark text, primary hover */}
                                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>

                                    {/* Excerpt - Gray text */}
                                    <p className="font-body text-gray-600 mb-4 line-clamp-2">
                                        {article.excerpt}
                                    </p>

                                    {/* Read More - Primary accent */}
                                    <div className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:underline">
                                        Read More
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ---------- CUSTOMER TESTIMONIALS (Retaining V1 Style/Animation, using V2 Data/Avatar structure) ---------- */
const CustomerTestimonials = ({ testimonials }) => {
    const renderTestimonialCard = (testimonial) => (
        <div
            key={testimonial.id}
            className="flex-shrink-0 w-[380px] mx-3"
            style={{ 
                 // Simple offset for a masonry-like feel
                transform: `translateY(${testimonial.id % 2 === 0 ? "0" : "20px"})`,
            }}
        >
            {/* Card: Dark card on dark background for subtle depth, white text */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-primary/20 shadow-xl shadow-black/30 h-full relative transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-1">
                {/* Quote Icon - Brighter accent */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                    <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Rating - Gold accent retained */}
                <div className="flex items-center gap-1 mb-4 pt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gold-light fill-gold-light" />
                    ))}
                </div>

                <p className="font-body text-white/90 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                </p>

                {/* Author - Border separates content from author, primary/white text */}
                <div className="flex items-center gap-3 border-t border-gray-700 pt-4">
                    <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/50 shadow-md"
                    />
                    <div>
                        <div className="font-display text-lg font-semibold text-white">
                            {testimonial.name}
                        </div>
                        <div className="font-body text-sm text-primary/70">
                            {testimonial.role}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        // Dark background for contrast
        <section className="py-24 bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center">
                    <span className="inline-block text-sm font-body font-semibold text-primary tracking-widest uppercase mb-4">
                        Player Stories
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                        What Our Champions Say
                    </h2>
                </div>
            </div>

            <div className="relative">
                {/* Gradient Masks - Fade from dark section BG */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent opacity-95 z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent opacity-95 z-10 pointer-events-none" />

                {/* NOTE: .animate-scroll-testimonials class must be defined in CSS for the animation to work */}
                <div className="flex animate-scroll-testimonials">
                    <div className="flex gap-6 items-start">
                        {testimonials.map(renderTestimonialCard)}
                    </div>
                    <div className="flex gap-6 items-start ml-6">
                        {testimonials.map(renderTestimonialCard)}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ---------- FOOTER (Retaining V1 structure with V2 contact details/icons) ---------- */
const Footer = () => {
    const footerLinks = {
        shop: [
            { label: "Bats", href: "#bats" },
            { label: "Pads", href: "#pads" },
            { label: "Gloves", href: "#gloves" },
            { label: "Helmets", href: "#helmets" },
            { label: "Balls", href: "#balls" },
            { label: "Accessories", href: "#accessories" },
        ],
        support: [
            { label: "Contact Us", href: "#contact" },
            { label: "FAQs", href: "#faqs" },
            { label: "Shipping Info", href: "#shipping" },
            { label: "Returns", href: "#returns" },
            { label: "Size Guide", href: "#size-guide" },
            { label: "Track Order", href: "#track" },
        ],
        company: [
            { label: "About Us", href: "#about" },
            { label: "Careers", href: "#careers" },
            { label: "Blog", href: "#blog" },
            { label: "Press", href: "#press" },
            { label: "Partners", href: "#partners" },
        ],
    };

    const socialLinks = [
        { icon: SiFacebook, href: "#", label: "Facebook" },
        { icon: SiInstagram, href: "#", label: "Instagram" },
        { icon: SiX, href: "#", label: "X" },
        { icon: SiYoutube, href: "#", label: "YouTube" },
    ];


    return (
        // V1 style with light background
        <footer className="border-t" style={{backgroundColor: 'var(--bg)', borderColor: 'var(--line)'}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-2">
                        <a href="/" className="inline-block mb-6">
                            <span className="text-2xl font-bold tracking-[0.2em] text-primary">
                                CRICKET LEGACY
                            </span>
                        </a>
                        <p className="text-gray-600 mb-6 max-w-sm">
                            Premium cricket equipment for players who demand excellence. Gear up like a champion with our world-class selection.
                        </p>

                        <div className="space-y-3 mb-6">
                             {/* V2 Contact Details and Icons */}
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm">123 Cricket Lane, Sports City</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-sm">support@cricketlegacy.com</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            &copy; 2024 Cricket Legacy. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a
                                href="#privacy"
                                className="text-gray-500 hover:text-primary transition-colors text-sm"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#terms"
                                className="text-gray-500 hover:text-primary transition-colors text-sm"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};