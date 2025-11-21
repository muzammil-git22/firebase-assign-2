// Sare links ka version ab same hai (10.12.5)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

import {  getFirestore, setDoc, deleteField, updateDoc, getDocs, doc, getDoc, collection, query, where, arrayUnion, arrayRemove 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
// Storage import bhi same version (10.12.5)
import {   getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";  
const firebaseConfig = {
    apiKey: "AIzaSyD4giLD0xALu9dBiDsW2DfsH4E_aiws0Fo",
    authDomain: "saas-dashboard-f253d.firebaseapp.com",
    projectId: "saas-dashboard-f253d",
    storageBucket: "saas-dashboard-f253d.firebasestorage.app", // Ye line check karein, 'firebasestorage.app' hona chahiye
    messagingSenderId: "648086624467",
    appId: "1:648086624467:web:c279cd9b6c1ce1f66e9c26",
    measurementId: "G-GNKB8D2N93"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Ab ye error nahi dega kyunki version match ho gaya hai

export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    setDoc,
    doc,
    db,
    where,
    collection,
    query,
    getDocs,
    arrayUnion,
    getDoc,
    updateDoc,
    deleteField,
    arrayRemove,
    storage, 
    ref,
    uploadBytes,
    getDownloadURL
};