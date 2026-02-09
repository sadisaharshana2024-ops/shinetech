import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, ShoppingBag, Menu, X, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../security/auth';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onCartToggle, onViewChange, currentView }) => {
    const { cartCount } = useCart();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/', view: 'home', isLink: true },
        { name: 'Shop', path: '/', view: 'shop', isLink: true },
        { name: 'Movies', path: '/movies', isLink: true },
        { name: 'Contact Us', path: '/#contact', view: 'home', hash: 'contact', isLink: true },
    ];

    const handleLinkClick = (e, link) => {
        const isHomePage = location.pathname === '/';

        if (link.name === 'Contact Us') {
            if (isHomePage && onViewChange) {
                e.preventDefault();
                onViewChange('home');
                setTimeout(() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                // If on movies or another page, we go home first
                // React Router takes us to / but we want the hash
                // We'll let the default Link behavior take us to / and add a listener in Shop.jsx to scroll
                // Or much simpler: navigate and then scroll.
            }
            return;
        }

        if (link.isLink && link.view && onViewChange && isHomePage) {
            e.preventDefault();
            onViewChange(link.view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav style={{
                padding: '1.2rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--surface)',
                borderBottom: '1px solid var(--glass-border)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }} onClick={() => onViewChange && onViewChange('home')}>
                    <Smartphone color="var(--primary)" size={32} />
                    <h1 style={{ fontSize: '1.4rem', margin: 0 }} className="neon-text">SHINE TECH</h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    {/* Desktop Links */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {navLinks.map((link, idx) => {
                            const isActive = link.view === currentView || (idx === 0 && !currentView && !link.view);
                            return link.isLink ? (
                                <Link
                                    key={idx}
                                    to={link.path}
                                    onClick={(e) => handleLinkClick(e, link)}
                                    style={{
                                        color: isActive ? 'white' : 'var(--text-muted)',
                                        textDecoration: 'none',
                                        fontWeight: isActive ? '700' : '500',
                                        transition: 'color 0.3s',
                                        borderBottom: isActive ? '2px solid var(--primary)' : 'none',
                                        paddingBottom: '4px'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    key={idx}
                                    href={link.path}
                                    style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                                >
                                    {link.name}
                                </a>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {/* Admin Entry */}
                        <Link to={user ? "/dashboard" : "/login"} style={{ color: user ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'all 0.3s' }}>
                            <motion.div whileHover={{ scale: 1.1 }} title={user ? "Admin Dashboard" : "Admin Login"}>
                                {user ? <ShieldCheck size={24} /> : <User size={24} />}
                            </motion.div>
                        </Link>

                        {/* Cart Toggle */}
                        {onCartToggle && (
                            <div
                                onClick={onCartToggle}
                                style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <ShoppingBag size={24} />
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--primary)',
                                    color: 'black',
                                    fontSize: '0.7rem',
                                    fontWeight: '900',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 10px var(--primary-glow)'
                                }}>
                                    {cartCount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

        </>
    );
};

export default Navbar;
