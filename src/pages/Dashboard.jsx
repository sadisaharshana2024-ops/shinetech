import React, { useState } from 'react';
import { useAuth } from '../security/auth';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Plus, Trash2, X, Image as ImageIcon, Film, Download, ShieldCheck, HardDrive, Monitor, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import { sanitizeInput, validateUrl } from '../utils/securityUtils';
import { formatPrice } from '../utils/formatUtils';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { products, addProduct, removeProduct, updateProduct, movies, addMovie, removeMovie, updateMovie, resetInventory, loading } = useInventory();


    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'movies', or 'orders'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Simulated Analytics
    const stats = [
        { title: 'Monthly Revenue', value: 'Rs. 4.2M', icon: <ShoppingCart size={24} />, color: 'var(--primary)', trend: '+12.5%' },
        { title: 'Total Inventory', value: products.length + movies.length, icon: <Package size={24} />, color: 'var(--accent)', trend: 'Healthy' },
        { title: 'Site Visitors', value: '12.8K', icon: <Monitor size={24} />, color: 'var(--success)', trend: '+5.2%' },
        { title: 'Storage Used', value: '1.4 TB', icon: <HardDrive size={24} />, color: '#ff00ff', trend: '85%' },
    ];

    // Simulated Orders Data
    const mockOrders = [
        { id: 'ORD-7721', customer: 'Arjun Perera', amount: 38500, status: 'Shipped', date: '2h ago' },
        { id: 'ORD-7722', customer: 'Sarah Mendis', amount: 10500, status: 'Processing', date: '5h ago' },
        { id: 'ORD-7723', customer: 'Kasun Wickrama', amount: 26500, status: 'Delivered', date: '1d ago' },
        { id: 'ORD-7724', customer: 'Nimal Silva', amount: 8500, status: 'Processing', date: '1d ago' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shipped': return 'var(--primary)';
            case 'Delivered': return 'var(--success)';
            case 'Processing': return 'var(--accent)';
            default: return 'var(--text-muted)';
        }
    };

    // Form States
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: 'Audio & Sounds', price: '', stock: '', image: '' });
    const [newMovie, setNewMovie] = useState({ name: '', genre: 'Action', quality: '4K', size720: '', size1080: '', image: '', downloadLink: '', downloadLink720: '', downloadLink1080: '', telegramLink720: '', telegramLink1080: '' });

    const openEditModal = (item) => {
        setEditingItem(item);
        if (activeTab === 'inventory') {
            setNewProduct({ ...item });
        } else {
            setNewMovie({ ...item });
        }
        setIsAddModalOpen(true);
    };

    const closeFormModal = () => {
        setIsAddModalOpen(false);
        setEditingItem(null);
        setNewProduct({ name: '', brand: '', category: 'Audio & Sounds', price: '', stock: '', image: '' });
        setNewMovie({ name: '', genre: 'Action', quality: '4K', size720: '', size1080: '', image: '', downloadLink: '', downloadLink720: '', downloadLink1080: '', telegramLink720: '', telegramLink1080: '' });
    };

    const handleImageUpload = (e, target, setter) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                alert('File is too large. Max 2MB allowed.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setter({ ...target, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        if (!newProduct.image) { alert('Please upload a product image.'); return; }

        const productData = {
            ...newProduct,
            name: sanitizeInput(newProduct.name),
            brand: sanitizeInput(newProduct.brand),
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock)
        };

        if (editingItem) {
            updateProduct(editingItem.id, productData);
        } else {
            addProduct(productData);
        }
        closeFormModal();
    };

    const handleAddMovie = (e) => {
        e.preventDefault();
        if (!newMovie.image) {
            alert('Security Error: Please upload a poster image.');
            return;
        }

        const movieData = {
            ...newMovie,
            name: sanitizeInput(newMovie.name),
            genre: sanitizeInput(newMovie.genre),
            size720: sanitizeInput(newMovie.size720),
            size1080: sanitizeInput(newMovie.size1080),
            downloadLink: newMovie.downloadLink || '#',
            downloadLink720: newMovie.downloadLink720 || '#',
            downloadLink1080: newMovie.downloadLink1080 || '#',
            telegramLink720: newMovie.telegramLink720 || '#',
            telegramLink1080: newMovie.telegramLink1080 || '#'
        };

        if (editingItem) {
            updateMovie(editingItem.id, movieData);
        } else {
            addMovie(movieData);
        }
        closeFormModal();
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#020305' }}>
            {/* Sidebar */}
            <div style={{
                width: '300px',
                background: 'var(--surface)',
                borderRight: '1px solid var(--glass-border)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
                    <ShieldCheck color="var(--primary)" size={32} />
                    <h2 className="neon-text" style={{ fontSize: '1.5rem', margin: 0 }}>SHINE ADMIN</h2>
                </div>

                <nav style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[
                        { id: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
                        { id: 'movies', label: 'Movies', icon: <Film size={20} /> },
                        { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} />, badge: 'New' },
                    ].map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="btn"
                            style={{
                                justifyContent: 'flex-start',
                                background: activeTab === tab.id ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                border: '1px solid',
                                borderColor: activeTab === tab.id ? 'rgba(0, 102, 255, 0.2)' : 'transparent',
                                position: 'relative'
                            }}
                        >
                            {tab.icon} {tab.label}
                            {tab.badge && (
                                <span style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    background: 'var(--primary)',
                                    color: 'black',
                                    fontSize: '0.6rem',
                                    fontWeight: '900',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '10px'
                                }}>{tab.badge}</span>
                            )}
                        </div>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: '700', margin: 0 }}>{user?.name || 'Administrator'}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>System Root</p>
                        </div>
                    </div>
                    <button onClick={logout} className="btn" style={{ width: '100%', color: 'var(--danger)', background: 'rgba(255, 59, 48, 0.05)', justifyContent: 'center' }}>
                        <LogOut size={20} /> Logout System
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ marginLeft: '300px', flexGrow: 1, padding: '3rem', maxWidth: '1600px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }} className="neon-text">
                            {activeTab === 'inventory' ? 'Inventory Control' : activeTab === 'movies' ? 'Media Archive' : 'Order Management'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back, {user?.name}. Everything is online and secure.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={resetInventory} className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>Soft Reset</button>
                        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                            <Plus size={20} /> New Entry
                        </button>
                    </div>
                </header>

                {/* Analytics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card"
                            style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ color: stat.color, background: `${stat.color}15`, padding: '0.8rem', borderRadius: '12px' }}>
                                    {stat.icon}
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: stat.trend.includes('+') ? 'var(--success)' : 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>{stat.title}</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stat.value}</p>
                            {/* Decorative background glow */}
                            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: stat.color, filter: 'blur(60px)', opacity: 0.1, pointerEvents: 'none' }} />
                        </motion.div>
                    ))}
                </div>

                <section>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {activeTab === 'inventory' ? <Package color="var(--primary)" /> : activeTab === 'movies' ? <Film color="var(--primary)" /> : <ShoppingCart color="var(--primary)" />}
                                Recent {activeTab === 'inventory' ? 'Stock' : activeTab === 'movies' ? 'Archive' : 'Orders'}
                            </h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem' }}>Export CSV</button>
                                <button className="btn" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem' }}>Reload</button>
                            </div>
                        </div>

                        {activeTab === 'orders' ? (
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <th style={{ padding: '0 1rem' }}>ORDER ID</th>
                                        <th style={{ padding: '0 1rem' }}>CUSTOMER</th>
                                        <th style={{ padding: '0 1rem' }}>AMOUNT</th>
                                        <th style={{ padding: '0 1rem' }}>DATE</th>
                                        <th style={{ padding: '0 1rem' }}>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockOrders.map((order, idx) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}
                                        >
                                            <td style={{ padding: '1.5rem 1rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                                <div style={{ fontWeight: '800' }}>#{order.id}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem' }}>{order.customer}</td>
                                            <td style={{ padding: '1.5rem 1rem', fontWeight: '800' }}>{formatPrice(order.amount)}</td>
                                            <td style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>{order.date}</td>
                                            <td style={{ padding: '1.5rem 1rem', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: '900',
                                                    background: `${getStatusColor(order.status)}15`,
                                                    color: getStatusColor(order.status),
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '20px',
                                                    border: `1px solid ${getStatusColor(order.status)}30`
                                                }}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <th style={{ padding: '0 1rem' }}>NAME / ID</th>
                                        <th style={{ padding: '0 1rem' }}>{activeTab === 'inventory' ? 'BRAND / CATEGORY' : 'GENRE / QUALITY'}</th>
                                        <th style={{ padding: '0 1rem' }}>{activeTab === 'inventory' ? 'PRICE / STOCK' : 'SIZE / DURATION'}</th>
                                        <th style={{ padding: '0 1rem' }}>STATUS</th>
                                        <th style={{ padding: '0 1rem' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeTab === 'inventory' ? products : (activeTab === 'movies' ? movies : [])).map((item, idx) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}
                                        >
                                            <td style={{ padding: '1.5rem 1rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                                <div style={{ fontWeight: '800' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: #{item.id}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem' }}>
                                                <div style={{ color: 'white', fontWeight: '600' }}>{activeTab === 'inventory' ? item.brand : item.genre}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>{activeTab === 'inventory' ? item.category : item.quality}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem' }}>
                                                <div style={{ fontWeight: '800' }}>{activeTab === 'inventory' ? formatPrice(item.price) : (item.size1080 || item.size720 || item.size || 'N/A')}</div>
                                                <div style={{ fontSize: '0.7rem', color: activeTab === 'inventory' && item.stock <= 5 ? 'var(--danger)' : 'var(--text-muted)' }}>
                                                    {activeTab === 'inventory' ? `${item.stock} in stock` : item.duration}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: '900',
                                                    background: 'rgba(0, 255, 102, 0.1)',
                                                    color: 'var(--success)',
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '20px',
                                                    border: '1px solid rgba(0, 255, 102, 0.2)'
                                                }}>
                                                    ACTIVE
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => activeTab === 'inventory' ? removeProduct(item.id) : removeMovie(item.id)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--danger)', opacity: 0.6, cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>

            {/* Add Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeFormModal} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass-card" style={{ position: 'relative', zIndex: 1001, maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2>{editingItem ? 'Edit' : 'Add New'} {activeTab === 'inventory' ? 'Product' : 'Movie'}</h2>
                                <button onClick={closeFormModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            {activeTab === 'inventory' ? (
                                <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <input required type="text" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input required type="text" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} placeholder="Brand" />
                                        <select className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left' }} value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                                            {['Audio & Sounds', 'Battery & Capacity', 'Case & Protection', 'Data & Storage', 'Cables & Adapters', 'Wearables & Trackers'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input required type="number" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Price (Rs.)" />
                                        <input required type="number" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Initial Stock" />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input required={!editingItem} type="file" accept="image/*" className="btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', width: '100%', fontSize: '0.8rem' }} onChange={(e) => handleImageUpload(e, newProduct, setNewProduct)} />
                                        {newProduct.image && <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '30px', height: '30px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--primary)' }}><img src={newProduct.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>{editingItem ? 'Save Changes' : 'Submit Product'}</button>
                                </form>
                            ) : (
                                <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <input required type="text" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newMovie.name} onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })} placeholder="Movie Title" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <select className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left' }} value={newMovie.genre} onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}>
                                            {['Action', 'Sci-Fi', 'Horror', 'Drama', 'Adventure', 'Animation'].map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                        <select className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left' }} value={newMovie.quality} onChange={(e) => setNewMovie({ ...newMovie, quality: e.target.value })}>
                                            {['4K', '1080p', '720p', 'Blu-ray'].map(q => <option key={q} value={q}>{q}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input required={!editingItem} type="file" accept="image/*" className="btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', width: '100%', fontSize: '0.8rem' }} onChange={(e) => handleImageUpload(e, newMovie, setNewMovie)} />
                                        {newMovie.image && <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '30px', height: '30px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--primary)' }}><img src={newMovie.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="text" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newMovie.size720} onChange={(e) => setNewMovie({ ...newMovie, size720: e.target.value })} placeholder="720p Size (e.g. 600MB)" />
                                        <input type="text" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newMovie.size1080} onChange={(e) => setNewMovie({ ...newMovie, size1080: e.target.value })} placeholder="1080p Size (e.g. 1.2GB)" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="url" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newMovie.downloadLink720} onChange={(e) => setNewMovie({ ...newMovie, downloadLink720: e.target.value })} placeholder="720p Direct Link" />
                                        <input type="url" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newMovie.telegramLink720} onChange={(e) => setNewMovie({ ...newMovie, telegramLink720: e.target.value })} placeholder="720p Telegram Link" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="url" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newMovie.downloadLink1080} onChange={(e) => setNewMovie({ ...newMovie, downloadLink1080: e.target.value })} placeholder="1080p Direct Link" />
                                        <input type="url" className="btn" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} value={newMovie.telegramLink1080} onChange={(e) => setNewMovie({ ...newMovie, telegramLink1080: e.target.value })} placeholder="1080p Telegram Link" />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>{editingItem ? 'Save Changes' : 'Add to Archive'}</button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default Dashboard;
