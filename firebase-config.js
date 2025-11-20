// [firebase-config - START]
// Firebase inicializálás a Szaki-Apphoz.

// FIGYELEM:
// Ezeket az értékeket a Firebase konzolból kell bemásolni:
// Project settings → General → Your apps → Web app.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- IDE JÖNNEK A TE ADATAID ---
// (Most másold be ide a saját firebaseConfig objektumodat!)
const firebaseConfig = {
  apiKey: "AIzaSyAKhHvi3yObUurBKhT1r_feg4g0A5w766Q",
  authDomain: "szaki-app.firebaseapp.com",
  projectId: "szaki-app",
  storageBucket: "szaki-app.firebasestorage.app",
  messagingSenderId: "418149364598",
  appId: "1:418149364598:web:2ae4450dc8fadfbac30057"
};

// App indítása
export const app = initializeApp(firebaseConfig);

// Firestore inicializálása
export const db = getFirestore(app);

// [firebase-config - END]
