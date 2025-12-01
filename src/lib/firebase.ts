import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9dmguyz9cz-0C2Ut_Jkb-13DCLvMZ37E",
  authDomain: "assets-manage-f0def.firebaseapp.com",
  projectId: "assets-manage-f0def",
  storageBucket: "assets-manage-f0def.firebasestorage.app",
  messagingSenderId: "614818395750",
  appId: "1:614818395750:web:d54152fdc46098a2a59fa7",
  measurementId: "G-YWKDQMBRXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
