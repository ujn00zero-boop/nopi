import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1lYx9YpuD4CmuWDUMQnL26P4eGGmmMoI",
  authDomain: "ipon-35623.firebaseapp.com",
  projectId: "ipon-35623",
  storageBucket: "ipon-35623.firebasestorage.app",
  messagingSenderId: "952404775755",
  appId: "1:952404775755:web:7fbcc4169a537f4961cece",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);