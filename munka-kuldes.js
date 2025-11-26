// =============================================================
// Szaki-App – MUNKA KÜLDÉS FIRESTORE + SZAKI MATCHING
// =============================================================

import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { assignWorkToSzakik } from "./matching.js";

// -------------------------------------------------------------
// MUNKA KÜLDÉSE
// -------------------------------------------------------------
export async function sendWork(details) {

    // 1) Elmentjük a munkát Firestore-ba
    const orderRef = await addDoc(collection(db, "orders"), {
        profession: details.profession,
        city: details.city,
        description: details.description,
        customerName: details.customerName,
        timestamp: serverTimestamp(),
        status: "new"
    });

    const orderId = orderRef.id;

    // 2) Automatikus szaki keresés
    const recommended = await assignWorkToSzakik(orderId, {
        profession: details.profession,
        city: details.city,
        description: details.description
    });

    console.log("Kiválasztott szakik:", recommended);

    // 3) Visszatérés az order ID-vel és ajánlott szakikkal
    return {
        orderId: orderId,
        recommendedSzakik: recommended
    };
}
