// users-status.js – Szaki-App
// Egységes online státusz követés Firestore-ban
// Minden oldalon működik, ahol importálod: <script type="module" src="users-status.js"></script>

import { app, db } from "./firebase-config.js";
import {
    doc,
    setDoc,
    updateDoc,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// -------------------------------------------------------------
// KÖTELEZŐ PARAMÉTEREK: USER NÉV + USER TÍPUS
// -------------------------------------------------------------
export function initUserStatus(options = {}) {

    const USER_NAME = options.userName || "ismeretlen_user";
    const USER_ROLE = options.role || "megrendelő";   // vagy: "szaki"
    const RAW_PHONE  = options.phone || "";
    const RAW_EMAIL  = options.email || "";

    const maskedPhone = maskPhone(RAW_PHONE);
    const maskedEmail = maskEmail(RAW_EMAIL);

    // Firestore dokumentum: users_status/USERNAME
    const ref = doc(db, "users_status", USER_NAME.toLowerCase());

    // Azonnal létrehozzuk / frissítjük
    setDoc(ref, {
        userName: USER_NAME,
        role: USER_ROLE,
        isOnline: true,
        lastActive: serverTimestamp(),
        maskedPhone,
        maskedEmail
    }, { merge: true });

    // PING 30 másodpercenként → “online vagyok”
    const ping = setInterval(() => {
        updateDoc(ref, {
            isOnline: true,
            lastActive: serverTimestamp()
        });
    }, 30000);

    // Ablak bezárásakor → OFFLINE
    window.addEventListener("beforeunload", () => {
        navigator.sendBeacon(
            `/offline`,
            JSON.stringify({ user: USER_NAME })
        );

        // offline-ra állítjuk Firestore-ban
        updateDoc(ref, {
            isOnline: false,
            lastActive: serverTimestamp()
        });
    });

    // Inaktivitás figyelése → ha 2 percig nincs input → OFFLINE
    let lastInteraction = Date.now();
    function activity() { lastInteraction = Date.now(); }
    window.addEventListener("mousemove", activity);
    window.addEventListener("keydown", activity);
    window.addEventListener("scroll", activity);

    setInterval(() => {
        if (Date.now() - lastInteraction > 120000) {  // 120 sec
            updateDoc(ref, {
                isOnline: false
            });
        }
    }, 15000);

    // API visszaadja a Firestore referenciát
    return { ref };
}

// -------------------------------------------------------------
// MÁSOK ONLINE STÁTUSZÁNAK FIGYELÉSE
// -------------------------------------------------------------
export function watchUserStatus(userName, callback) {
    const ref = doc(db, "users_status", userName.toLowerCase());
    return onSnapshot(ref, (snap) => {
        if (snap.exists()) {
            callback(snap.data());
        }
    });
}

// -------------------------------------------------------------
// MASZKOLÁS – ALAP SZABÁLYOK
// -------------------------------------------------------------
export function maskPhone(phone) {
    if (!phone) return "";
    // Példa: +36301234567 → +3630*****67
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 5) return phone;

    const start = cleaned.slice(0, 4);
    const end = cleaned.slice(-2);
    return `+${start}*****${end}`;
}

export function maskEmail(email) {
    if (!email.includes("@")) return email;

    const [user, domain] = email.split("@");
    if (user.length <= 2) return "*@" + maskDomain(domain);

    const first = user[0];
    const last = user[user.length - 1];
    const stars = "*".repeat(user.length - 2);

    return `${first}${stars}${last}@${maskDomain(domain)}`;
}

function maskDomain(domain) {
    // pl.: gmail.com → g****.com
    const parts = domain.split(".");
    if (parts.length < 2) return "***";

    const first = parts[0][0];
    const stars = "*".repeat(parts[0].length - 1);
    return `${first}${stars}.${parts[1]}`;
}

// -------------------------------------------------------------
// UTOLSÓ AKTIVITÁS FORMÁZÓ
// -------------------------------------------------------------
export function formatLastActive(ts) {
    try {
        const d = ts.toDate();
        const now = new Date();
        const diff = (now - d) / 1000; // mp-ben

        if (diff < 60) return "Az imént online volt";
        if (diff < 300) return "5 percen belül aktív";
        if (diff < 3600) return "Az elmúlt órában aktív";
        return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
        return "Nincs adat";
    }
}

function pad(n) { return n < 10 ? "0"+n : n; }
