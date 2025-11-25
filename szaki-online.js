// szaki-online.js
// ---------------------------------------
// Szaki-App – Online státusz figyelő
// Élő Firestore "online" frissítés
// ---------------------------------------

import { db } from "./firebase-config.js";
import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ---------------------------------------
// 1) Ki a bejelentkezett szakember?
// ---------------------------------------
let SZAKI_NEV = localStorage.getItem("szakiName");

// Ha nincs név mentve → kérdezzük meg
if (!SZAKI_NEV) {
    SZAKI_NEV = prompt("Add meg a szakember nevét:") || "Ismeretlen";
    localStorage.setItem("szakiName", SZAKI_NEV);
}

// Firestore dokumentum helye
const ref = doc(db, "szakik_online", SZAKI_NEV);

// ---------------------------------------
// 2) Online jelzés mentése Firestore-ba
// ---------------------------------------
async function setOnline() {
    try {
        await setDoc(ref, {
            name: SZAKI_NEV,
            online: true,
            lastSeen: serverTimestamp()
        }, { merge: true });
        console.log("ONLINE:", SZAKI_NEV);
    } catch (err) {
        console.error("Online állapot hiba:", err);
    }
}

// ---------------------------------------
// 3) Offline jelzés kilépéskor
// ---------------------------------------
async function setOffline() {
    try {
        await setDoc(ref, {
            name: SZAKI_NEV,
            online: false,
            lastSeen: serverTimestamp()
        }, { merge: true });
        console.log("OFFLINE:", SZAKI_NEV);
    } catch (err) {
        console.error("Offline állapot hiba:", err);
    }
}

// ---------------------------------------
// 4) Böngésző eseményekhez kötve
// ---------------------------------------
window.addEventListener("beforeunload", setOffline);
window.addEventListener("blur", setOffline);

// amikor visszajön az oldalra: legyen újra online
window.addEventListener("focus", setOnline);

// oldal betöltésekor azonnal online-ra tesszük
setOnline();

// ---------------------------------------
// Kész.
// Innen minden szakember ÉLŐBEN látható a Firestore-ban:
//  - szakik_online / NÉV / { online: true/false, lastSeen: ... }
// ---------------------------------------
