import React, { useState, useEffect } from 'react';
import { Smartphone, ShoppingBag, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight, X, Maximize2, Trash2, Plus, Minus, ShoppingCart, MessageCircle, MapPin, Eye, CheckCircle2, User, Mail, Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import Navbar from '../components/Navbar';
import { formatPrice } from '../utils/formatUtils';

const Shop = ({ initialView = 'home' }) => {
    const { addToCart, cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
    const { products, loading } = useInventory();

    const location = useLocation();
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentView, setCurrentView] = useState(initialView);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = [
        { title: "Audio & Sounds", sub: ["Earbuds", "Earphones", "Headphones"], image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400" },
        { title: "Battery & Capacity", sub: ["Power Banks", "Smartphone Battery"], image: "https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=400" },
        { title: "Cables & Adapters", sub: ["Data Cables", "Power Adapters", "Power Cables"], image: "https://images.unsplash.com/photo-1610945415295-d9baf0602581?q=80&w=400" },
        { title: "Case & Protection", sub: ["Back Covers", "Pouches", "Tempered Glass"], image: "https://images.unsplash.com/photo-1544816153-12ad5d714b21?q=80&w=400" },
        { title: "Data & Storage", sub: ["External Drives", "External Hard Disks", "Micro SD Cards"], image: "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=400" },
        { title: "Wearables & Trackers", sub: ["Fitness Trackers", "Smart Bands", "Smart Watches"], image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400" },
    ];

    const rankedProducts = {
        topRated: [
            { id: 10, name: 'Xiaomi Redmi Poco BN5X Battery', price: 7999, oldPrice: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
            { id: 11, name: 'Samsung Note 5 Battery', price: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
            { id: 12, name: 'ZTE Blade Redmagic Battery', price: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
        ],
        bestSelling: [
            { id: 10, name: 'Xiaomi Redmi Poco BN5X Battery', price: 7999, oldPrice: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
            { id: 13, name: 'Samsung Note 5 Battery', price: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
            { id: 14, name: 'ZTE Blade Redmagic Battery', price: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
        ],
        onSale: [
            { id: 10, name: 'Xiaomi Redmi Poco BN5X Battery', price: 7999, oldPrice: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
            { id: 15, name: 'Samsung Note 5 Battery', price: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
            { id: 16, name: 'ZTE Blade Redmagic Battery', price: 20000, image: 'https://images.unsplash.com/photo-16104924ec985-b145c7d0de0f?q=80&w=100' },
        ]
    };

    const carouselSlides = [
        {
            id: 1,
            title: "Premium Protection",
            subtitle: "Luxury Leather Series.",
            description: "Experience the ultimate touch of class with our hand-crafted Italian leather cases.",
            image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1920",
            accent: "var(--primary)"
        },
        {
            id: 2,
            title: "Charging Redefined",
            subtitle: "3-in-1 Wireless Hub.",
            description: "Power your ecosystem with our sleek, high-speed magnetic charging stations.",
            image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=1920",
            accent: "var(--accent)"
        },
        {
            id: 3,
            title: "Audio Perfection",
            subtitle: "Crystal Clear Acoustics.",
            description: "Immerse yourself in high-fidelity sound with our premium wireless earbud collection.",
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1920",
            accent: "var(--primary-glow)"
        },
        {
            id: 4,
            title: "MagSafe Collection",
            subtitle: "Magnetic Elegance.",
            description: "Discover our full range of magnetic wallets, mounts, and accessories for the modern explorer.",
            image: "https://images.unsplash.com/photo-1629131726692-1accd0c93ce0?q=80&w=1920",
            accent: "var(--success)"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Effect to handle scrolling to hash on load (e.g. from /movies to /#contact)
    useEffect(() => {
        if (window.location.hash === '#contact') {
            setTimeout(() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [location.pathname]);

    // Effect to handle view changes from parent/navbar via custom event or prop
    // For now, we'll rely on the navbar passing the state setter if we structure it that way,
    // but a cleaner way for this setup is to listen for a custom event or just export the state.
    // However, since Navbar is inside Shop here, we can just pass the setter.

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' ||
            (p.category && p.category === activeCategory) ||
            (p.genre && p.genre === activeCategory); // Fallback for movies/products mix if any
        return matchesSearch && matchesCategory;
    });

    const displayProducts = currentView === 'home' ? products.slice(0, 8) : filteredProducts;
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

    return (
        <div style={{ background: 'var(--background)', color: 'white', minHeight: '100vh', position: 'relative' }}>
            <Navbar onCartToggle={() => setIsCartOpen(true)} onViewChange={setCurrentView} currentView={currentView} />

            {/* Hero Carousel - Only on Home */}
            <AnimatePresence>
                {currentView === 'home' && (
                    <motion.section
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: '600px', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ position: 'relative', overflow: 'hidden', background: '#000' }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                style={{ height: '100%', width: '100%', position: 'relative' }}
                            >
                                {/* Background Image */}
                                <img
                                    src={carouselSlides[currentSlide].image}
                                    alt={carouselSlides[currentSlide].title}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 1,
                                        filter: 'brightness(0.5) contrast(1.1)',
                                        cursor: 'zoom-in'
                                    }}
                                />

                                {/* Gradient Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)',
                                    zIndex: 1,
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    position: 'relative',
                                    zIndex: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    padding: '0 4rem',
                                    maxWidth: '800px',
                                    pointerEvents: 'none'
                                }}>
                                    <motion.span
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        style={{ color: carouselSlides[currentSlide].accent, fontWeight: '800', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1rem' }}
                                    >
                                        PREMIUM COLLECTION
                                    </motion.span>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        style={{ fontSize: '4rem', marginBottom: '0.8rem', lineHeight: '1.1' }}
                                    >
                                        {carouselSlides[currentSlide].title}
                                    </motion.h2>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.9 }}
                                        className="neon-text"
                                    >
                                        {carouselSlides[currentSlide].subtitle}
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px' }}
                                    >
                                        {carouselSlides[currentSlide].description}
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <button className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                                            EXPLORE NOW <ArrowRight size={20} />
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Carousel Controls */}
                        <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '1rem', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '1rem', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                            <ChevronRight size={24} />
                        </button>

                        {/* Pagination Dots */}
                        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '1rem' }}>
                            {carouselSlides.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    style={{
                                        width: index === currentSlide ? '40px' : '12px',
                                        height: '12px',
                                        borderRadius: '6px',
                                        background: index === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: index === currentSlide ? '0 0 10px var(--primary-glow)' : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Featured Categories - Only on Home */}
            {currentView === 'home' && (
                <section className="shop-section" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title" style={{ marginBottom: '2.5rem', textAlign: 'center', fontSize: '2.5rem' }}>Featured <span className="neon-text">Categories</span></h2>
                    <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="glass-card"
                                style={{ display: 'flex', padding: '1.5rem', gap: '1rem', alignItems: 'center' }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>{cat.title}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        {cat.sub.map((s, i) => (
                                            <span key={i} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s}</span>
                                        ))}
                                    </div>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        Shop All <ArrowRight size={16} />
                                    </button>
                                </div>
                                <img src={cat.image} alt={cat.title} style={{ width: '120px', height: '120px', objectFit: 'contain', opacity: 0.8 }} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Product Grid / Full Catalog */}
            <main className="shop-section" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        {currentView === 'home' ? 'Featured' : 'Smart'} <span className="neon-text">{currentView === 'home' ? 'Arrivals' : 'Catalog'}</span>
                    </h2>

                    {currentView === 'shop' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}
                        >
                            {/* Search Bar */}
                            <div style={{ position: 'relative', width: '100%' }}>
                                <Smartphone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for premium gear..."
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '1rem 1rem 1rem 3.5rem',
                                        textAlign: 'left',
                                        fontSize: '1.1rem',
                                        borderRadius: '16px'
                                    }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Category Quick Filters */}
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0', marginBottom: '3rem' }} className="hide-scrollbar">
                                {['All', ...categories.map(c => c.title)].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className="glass-card"
                                        style={{
                                            padding: '0.8rem 1.8rem',
                                            whiteSpace: 'nowrap',
                                            background: activeCategory === cat ? 'var(--primary)' : 'var(--glass)',
                                            borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--glass-border)',
                                            color: activeCategory === cat ? 'black' : 'white',
                                            fontWeight: '700',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
                    {displayProducts.map(product => (
                        <motion.div
                            key={product.id}
                            whileHover={{ y: -10 }}
                            className="glass-card"
                            style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => setSelectedProduct(product)}
                        >
                            <div className="product-card-image" style={{ position: 'relative', overflow: 'hidden', height: '300px' }}>
                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                                >
                                    <div style={{ background: 'var(--primary)', color: 'black', borderRadius: '50%', padding: '0.8rem', display: 'flex', boxShadow: '0 0 20px var(--primary-glow)' }}>
                                        <Eye size={24} />
                                    </div>
                                </motion.div>
                            </div>
                            <div className="product-card-info" style={{ padding: '1.5rem' }}>
                                <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '800' }}>{product.brand.toUpperCase()}</span>
                                <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{formatPrice(product.price)}</span>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.6rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                            setIsCartOpen(true);
                                        }}
                                    >
                                        <ShoppingBag size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {currentView === 'home' && (
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}
                            onClick={() => {
                                setCurrentView('shop');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            VIEW FULL CATALOG <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </main>

            {/* Ranked Lists - Only on Home */}
            {currentView === 'home' && (
                <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', marginBottom: '4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                        <div>
                            <h2 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Top Rated</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {rankedProducts.topRated.map((p, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{p.name}</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.85rem' }}>{formatPrice(p.price)}</span>
                                                {p.oldPrice && <span style={{ opacity: 0.5, textDecoration: 'line-through', fontSize: '0.75rem' }}>{formatPrice(p.oldPrice)}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Best Selling</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {rankedProducts.bestSelling.map((p, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{p.name}</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: '800', color: 'var(--accent)', fontSize: '0.85rem' }}>{formatPrice(p.price)}</span>
                                                {p.oldPrice && <span style={{ opacity: 0.5, textDecoration: 'line-through', fontSize: '0.75rem' }}>{formatPrice(p.oldPrice)}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 style={{ borderBottom: '2px solid var(--success)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>On Sale</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {rankedProducts.onSale.map((p, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{p.name}</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: '800', color: 'var(--success)', fontSize: '0.85rem' }}>{formatPrice(p.price)}</span>
                                                {p.oldPrice && <span style={{ opacity: 0.5, textDecoration: 'line-through', fontSize: '0.75rem' }}>{formatPrice(p.oldPrice)}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {/* Cart Sidebar */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: '100%',
                                maxWidth: '400px',
                                background: 'var(--surface)',
                                zIndex: 1001,
                                display: 'flex',
                                flexDirection: 'column',
                                borderLeft: '1px solid var(--glass-border)',
                                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <ShoppingCart color="var(--primary)" size={24} />
                                    <h2 style={{ fontSize: '1.2rem' }}>Your Cart</h2>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                                {cartItems.length === 0 ? (
                                    <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                                        <ShoppingBag size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                        <p>Your cart is empty</p>
                                        <button onClick={() => setIsCartOpen(false)} className="btn btn-primary" style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem' }}>
                                            Go Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {cartItems.map(item => (
                                            <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{item.name}</h4>
                                                    <p style={{ color: 'var(--primary)', fontWeight: '700', margin: '0.2rem 0', fontSize: '0.9rem' }}>{formatPrice(item.price)}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '4px', padding: '2px' }}>
                                                            <Minus size={14} />
                                                        </button>
                                                        <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '4px', padding: '2px' }}>
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cartItems.length > 0 && (
                                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Total</span>
                                        <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>{formatPrice(cartTotal)}</span>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', fontWeight: '700' }}>
                                        CHECKOUT NOW
                                    </button>
                                    <button onClick={clearCart} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                                        Clear Cart
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 3000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem',
                        pointerEvents: 'auto'
                    }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.92)',
                                backdropFilter: 'blur(15px)',
                                cursor: 'zoom-out'
                            }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '1100px',
                                maxHeight: '90vh',
                                background: 'var(--surface)',
                                borderRadius: '32px',
                                border: '1px solid var(--glass-border)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'row',
                                boxShadow: '0 40px 100px rgba(0,0,0,1)',
                                zIndex: 1
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%'
                            }}>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    style={{ position: 'absolute', top: '25px', right: '25px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '50%', padding: '0.8rem', cursor: 'pointer', zIndex: 10, display: 'flex', transition: 'all 0.3s' }}
                                >
                                    <X size={24} />
                                </button>

                                <div style={{ flex: '1.3', position: 'relative', minHeight: 'auto', background: 'var(--surface-brighter)' }}>
                                    <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>

                                <div style={{ flex: 1, padding: '4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
                                    <div style={{ marginBottom: 'auto' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '900', letterSpacing: '4px', fontSize: '0.7rem', textTransform: 'uppercase' }}>{selectedProduct.brand}</span>
                                            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, var(--primary), transparent)', opacity: 0.2 }} />
                                        </div>
                                        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '2.5rem', lineHeight: '1', color: 'white' }}>{selectedProduct.name}</h2>

                                        <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                                            <div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Unit Price</p>
                                                <p style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--primary)', textShadow: '0 0 20px var(--primary-glow)' }}>{formatPrice(selectedProduct.price)}</p>
                                            </div>
                                            <div style={{ width: '1px', background: 'var(--glass-border)' }} />
                                            <div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Inventory</p>
                                                <p style={{ fontSize: '1.2rem', fontWeight: '800', color: selectedProduct.stock > 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    {selectedProduct.stock > 0 ? <><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 15px var(--success)' }} /> SECURED</> : 'DEPLETED'}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '3rem' }}>
                                            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'white', fontWeight: '800', letterSpacing: '1px' }}>CORE FEATURES</h4>
                                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', fontWeight: '400' }}>{selectedProduct.description || 'Engineered for absolute performance and reliability. This unit represents the peak of our technological development, offering unmatched speed and efficiency for professional workflows.'}</p>
                                        </div>

                                        {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                                            <div style={{ marginBottom: '3rem' }}>
                                                <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white', fontWeight: '800', letterSpacing: '1px' }}>SPECIFICATIONS</h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                    {selectedProduct.specs.map((spec, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>
                                                            <CheckCircle2 size={18} color="var(--primary)" />
                                                            {spec}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem' }}>
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 1, padding: '1.8rem', justifyContent: 'center', borderRadius: '20px', fontSize: '1.2rem', fontWeight: '900', gap: '1.2rem', letterSpacing: '2px', boxShadow: '0 10px 30px var(--primary-shadow)' }}
                                            onClick={() => {
                                                addToCart(selectedProduct);
                                                setIsCartOpen(true);
                                                setSelectedProduct(null);
                                            }}
                                        >
                                            <ShoppingBag size={28} /> AUTHORIZE PURCHASE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Contact Us Section */}
            <section id="contact" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto 0 0', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '3.5rem', color: 'white' }}>Contact Us</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}>
                            <span style={{ color: '#0066FF', fontSize: '1.6rem', fontWeight: '800', whiteSpace: 'nowrap' }}>Address:</span>
                            <span style={{ color: 'white', fontSize: '1.6rem', fontWeight: '500', maxWidth: '600px' }}>368/4 , Baseline Road , Dematagoda , Colombo 09</span>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}>
                            <span style={{ color: '#0066FF', fontSize: '1.6rem', fontWeight: '800', whiteSpace: 'nowrap' }}>Phone:</span>
                            <span style={{ color: 'white', fontSize: '1.6rem', fontWeight: '500', maxWidth: '600px' }}>+94 70 753 3476</span>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}>
                            <span style={{ color: '#0066FF', fontSize: '1.6rem', fontWeight: '800', whiteSpace: 'nowrap' }}>E-mail:</span>
                            <span style={{ color: 'white', fontSize: '1.6rem', fontWeight: '500', maxWidth: '600px' }}>shinetech@gmail.com</span>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}>
                            <span style={{ color: '#0066FF', fontSize: '1.6rem', fontWeight: '800', whiteSpace: 'nowrap' }}>Hours:</span>
                            <span style={{ color: 'white', fontSize: '1.6rem', fontWeight: '500', maxWidth: '600px' }}>7:00 AM – 07:00 PM, Everyday</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ marginTop: '0', padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <Smartphone size={24} color="var(--primary)" />
                    <h3 className="neon-text">SHINE TECH</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 High-Security Commerce System. All rights reserved.</p>
            </footer>

            {/* Floating Contact Bar */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                zIndex: 100
            }}>
                <motion.a
                    href="https://wa.me/94707533476"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="glass-card"
                    style={{
                        width: '55px',
                        height: '55px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#25D366',
                        background: 'rgba(37, 211, 102, 0.1)',
                        boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)',
                        border: '2px solid rgba(37, 211, 102, 0.3)',
                        padding: 0
                    }}
                >
                    <MessageCircle size={28} />
                </motion.a>

                <motion.a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="glass-card"
                    style={{
                        width: '55px',
                        height: '55px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FF3B30',
                        background: 'rgba(255, 59, 48, 0.1)',
                        boxShadow: '0 0 20px rgba(255, 59, 48, 0.4)',
                        border: '2px solid rgba(255, 59, 48, 0.3)',
                        padding: 0
                    }}
                >
                    <MapPin size={28} />
                </motion.a>
            </div>
        </div>
    );
};

export default Shop;
