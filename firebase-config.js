// [firebase-config - START]
// Firebase inicializálás a Szaki-Apphoz.

// FIGYELEM: a firebaseConfig objektumba a SAJÁT adataidat kell bemásolnod
// a Firebase konzolból (Project settings → General → Your apps → Web app).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "IDE-JÖN-A-TE-API-KEY",
  authDomain: "IDE-JÖN-A-TE-PROJECT.firebaseapp.com",
  projectId: "IDE-JÖN-A-TE-PROJECT-ID",
  storageBucket: "IDE-JÖN-A-TE-PROJECT.appspot.com",
  messagingSenderId: "IDE-JÖN-A-TE-SENDER-ID",
  appId: "IDE-JÖN-A-TE-APP-ID"
};

// Itt indítjuk a Firebase appot
export const app = initializeApp(firebaseConfig);

// Firestore példány – ezt importáljuk majd minden oldalról
export const db = getFirestore(app);

// [firebase-config - END]
