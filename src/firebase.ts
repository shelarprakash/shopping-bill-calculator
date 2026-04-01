import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiLKQaHQxzvqHSkvkmnWT_B2HC35RLtvg",
  authDomain: "shopping-bill-calculator.firebaseapp.com",
  projectId: "shopping-bill-calculator",
  storageBucket: "shopping-bill-calculator.firebasestorage.app",
  messagingSenderId: "148595918560",
  appId: "1:148595918560:web:6f9e29d444a9a0ca0f7285",
  measurementId: "G-QKXCR1EQZ0",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export default app;
