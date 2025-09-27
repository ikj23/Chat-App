// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // We need this for authentication
import { getFirestore } from "firebase/firestore"; // We will need this for the database

// Your web app's Firebase configuration from your screenshot
const firebaseConfig = {
  apiKey: "AIzaSyCjs5Nm0ZCbSs7IQLVQ_gu05D0ak-701tA",
  authDomain: "whatsapp-dashboard-fc941.firebaseapp.com",
  projectId: "whatsapp-dashboard-fc941",
  storageBucket: "whatsapp-dashboard-fc941.firebasestorage.app", // Note: I corrected this to match your screenshot
  messagingSenderId: "1011523989027",
  appId: "1:1011523989027:web:af7cc3bc27e03b18120b96",
  measurementId: "G-RSCWVPRT63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the services we need
const auth = getAuth(app);
const db = getFirestore(app);

// This export line is the most important part that was missing.
// It allows other files to import { auth, db } from './firebase';
export { auth, db };