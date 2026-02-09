import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBBnfoVDYOFTu8Ri9kEHkkKn2SQFTeRUXg",
    authDomain: "shine-tech-dfebf.firebaseapp.com",
    projectId: "shine-tech-dfebf",
    storageBucket: "shine-tech-dfebf.firebasestorage.app",
    messagingSenderId: "570549421083",
    appId: "1:570549421083:web:3eb293740bdc74c17324be",
    measurementId: "G-Q8HKTMEC57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
