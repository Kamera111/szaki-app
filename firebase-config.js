// =====================================================
// Firebase config – SzakiChat
// =====================================================

import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔥 A SAJÁT PROJEKTED KONFIGJA
const firebaseConfig = {
  apiKey: "AIzaSyAKhHvi3yObUurBKhT1r_feg4g0A5w766Q",
  authDomain: "szaki-app.firebaseapp.com",
  projectId: "szaki-app",
  storageBucket: "szaki-app.appspot.com",
  messagingSenderId: "418149364598",
  appId: "1:418149364598:web:2ae4450dc8fadfbac30057"
};


// 🔥 Firebase INIT
export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
