// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyDZAE8KGN0sd-Qga_x2oC53g_7T9LRjHgY",
    authDomain: "final-lab-media-manager.firebaseapp.com",
    projectId: "final-lab-media-manager",
    storageBucket: "final-lab-media-manager.firebasestorage.app",
    messagingSenderId: "453602607950",
    appId: "1:453602607950:web:e0c28600961a5dd007141f",
    measurementId: "G-RYD4316M0R"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
