import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
    getDocs,
    query,
    orderBy
} from 'firebase/firestore';

const InventoryContext = createContext();

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};

export const InventoryProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultInventory = [
        {
            name: 'Neo-Buds Pro',
            brand: 'Shine Tech',
            category: 'Audio & Sounds',
            price: 38500,
            stock: 25,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800',
            description: 'Next-generation wireless audio with active noise cancellation and spatial sound tracking.',
            specs: ['Bluetooth 5.3', '40h Battery Life', 'IPX7 Waterproof', 'Dual Driver System']
        },
        {
            name: 'MagVolt 10K',
            brand: 'PowerGrid',
            category: 'Battery & Capacity',
            price: 26500,
            stock: 15,
            image: 'https://images.unsplash.com/photo-1622322062793-9c094f068305?q=80&w=800',
            description: 'Ultra-slim magnetic power bank with 15W fast wireless charging and multi-device support.',
            specs: ['10,000mAh Capacity', 'MagSafe Compatible', 'USB-C PD 20W', 'LED Status Ring']
        }
    ];

    const defaultMovies = [
        {
            name: 'Avatar: The Way of Water',
            genre: 'Sci-Fi',
            isLatest: true,
            quality: '1080p',
            size: '3 GB',
            size720: '1.7 GB',
            size1080: '3 GB',
            image: '/movies/avatar_2022.jpg',
            duration: '3h 12m',
            downloadLink720: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/69897d37a6be886707a2c7e4',
            downloadLink1080: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/69897d4da6be886707a2c7e6',
            telegramLink720: 'https://t.me/AnyFileStoreRoBot?start=ODUwMA==',
            telegramLink1080: 'https://t.me/AnyFileStoreRoBot?start=ODUwMg==',
            downloadLink: '#'
        },
        {
            name: 'Inception',
            genre: 'Sci-Fi',
            quality: '1080p',
            size: '1.1 GB',
            size720: '437 MB',
            size1080: '1.1 GB',
            image: '/movies/inception_2010.jpg',
            duration: '2h 28m',
            downloadLink720: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/69897b26a6be886707a2c7cf',
            downloadLink1080: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/69897b2ba6be886707a2c7d1',
            telegramLink720: 'https://t.me/AnyFileStoreRoBot?start=ODQ5NA==',
            telegramLink1080: 'https://t.me/AnyFileStoreRoBot?start=ODQ5Ng==',
            downloadLink: '#'
        },
        {
            name: 'The Dark Knight',
            genre: 'Action',
            quality: '1080p',
            size: '947 MB',
            size720: '665 MB',
            size1080: '947 MB',
            image: '/movies/dark_knight_2008.jpg',
            duration: '2h 32m',
            isLatest: true,
            downloadLink720: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/698975ada6be886707a2c7c3',
            downloadLink1080: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/698975b4a6be886707a2c7c5',
            telegramLink720: 'https://t.me/AnyFileStoreRoBot?start=ODQ5MA==',
            telegramLink1080: 'https://t.me/AnyFileStoreRoBot?start=ODQ5Mg==',
            downloadLink: '#'
        },
        {
            name: 'Interstellar',
            genre: 'Sci-Fi',
            quality: '1080p',
            size: '1.2 GB',
            size720: '625 MB',
            size1080: '1.2 GB',
            image: '/movies/interstellar_2014.jpg',
            duration: '2h 49m',
            isLatest: true,
            downloadLink720: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/6989703ca6be886707a2c7bf',
            downloadLink1080: 'https://steve-fs1-ring-496ad73f3755.herokuapp.com/dl/6989707aa6be886707a2c7c1',
            telegramLink720: 'https://t.me/AnyFileStoreRoBot?start=ODQ4Ng==',
            telegramLink1080: 'https://t.me/AnyFileStoreRoBot?start=ODQ4OA==',
            downloadLink: '#'
        }
    ];

    useEffect(() => {
        let productsInitialLoaded = false;
        let moviesInitialLoaded = false;
        let maintenanceDone = false;

        const checkReady = (pLoaded, mLoaded) => {
            if (pLoaded && mLoaded) {
                setLoading(false);
            }
        };

        // 1. Real-time Products (Immediate Start)
        const unsubscribeProducts = onSnapshot(query(collection(db, 'products')), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(data);

            if (!productsInitialLoaded) {
                productsInitialLoaded = true;
                checkReady(productsInitialLoaded, moviesInitialLoaded);

                // Background Seeding (Non-blocking)
                if (data.length === 0) {
                    defaultInventory.forEach(item => addProduct(item));
                }
            }
        }, (error) => {
            console.error("Products Stream Error:", error);
            productsInitialLoaded = true;
            checkReady(true, moviesInitialLoaded);
        });

        // 2. Real-time Movies (Immediate Start)
        const unsubscribeMovies = onSnapshot(query(collection(db, 'movies')), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMovies(data);

            if (!moviesInitialLoaded) {
                moviesInitialLoaded = true;
                checkReady(productsInitialLoaded, moviesInitialLoaded);
            }

            // Background Maintenance (Non-blocking Sync)
            if (!maintenanceDone) {
                if (data.length > 0) {
                    maintenanceDone = true;
                    defaultMovies.forEach(defMovie => {
                        const existing = data.find(m => m.name === defMovie.name);
                        if (!existing) {
                            addMovie(defMovie);
                        } else if (existing.image?.startsWith('http') || existing.downloadLink720 === '#') {
                            updateMovie(existing.id, defMovie);
                        }
                    });
                } else if (snapshot.metadata.fromCache === false) {
                    // Only seed if we are sure it's empty in cloud
                    maintenanceDone = true;
                    defaultMovies.forEach(defMovie => addMovie(defMovie));
                }
            }
        }, (error) => {
            console.error("Movies Stream Error:", error);
            moviesInitialLoaded = true;
            setLoading(false);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeMovies();
        };
    }, []);

    const addProduct = async (product) => {
        try {
            await addDoc(collection(db, 'products'), product);
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    const removeProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (error) {
            console.error("Error removing product: ", error);
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, updatedProduct);
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };

    const addMovie = async (movie) => {
        try {
            await addDoc(collection(db, 'movies'), movie);
        } catch (error) {
            console.error("Error adding movie: ", error);
        }
    };

    const removeMovie = async (id) => {
        try {
            await deleteDoc(doc(db, 'movies', id));
        } catch (error) {
            console.error("Error removing movie: ", error);
        }
    };

    const updateMovie = async (id, updatedMovie) => {
        try {
            const movieRef = doc(db, 'movies', id);
            await updateDoc(movieRef, updatedMovie);
        } catch (error) {
            console.error("Error updating movie: ", error);
        }
    };

    const resetInventory = async () => {
        // Warning: This only clears local state in this implementation, 
        // for Firebase we'd need to delete all docs which is destructive.
        console.warn("Reset inventory called. Cloud data remains unless manually cleared.");
    };

    const updateStock = async (id, newStock) => {
        try {
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, { stock: newStock });
        } catch (error) {
            console.error("Error updating stock: ", error);
        }
    };

    return (
        <InventoryContext.Provider value={{
            products, addProduct, removeProduct, updateProduct, updateStock,
            movies, addMovie, removeMovie, updateMovie, resetInventory,
            loading
        }}>
            {children}
        </InventoryContext.Provider>
    );
};
