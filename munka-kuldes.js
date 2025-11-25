// munka-kuldes.js
// Szaki-App – Automatikus szaki-kiválasztás + munka mentése + chat létrehozása

import { app, db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    doc,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🟧 1. MUNKA BEKÜLDÉSE
export async function kuldMunka(megrendeloNev, szakma, leiras) {
    if (!megrendeloNev || !szakma || !leiras) {
        throw new Error("Hiányzó mező!");
    }

    // MUNKA mentése Firestore-ba
    const munkaRef = await addDoc(collection(db, "munkak"), {
        megrendeloNev,
        szakma,
        leiras,
        status: "uj",
        createdAt: serverTimestamp()
    });

    // keres szakikat
    const valasztott = await valasszSzakit(szakma);

    if (!valasztott || valasztott.length === 0) {
        alert("Jelenleg nincs elérhető szakember ennél a szakmánál.");
        return;
    }

    // 1. szaki = fő szaki, akivel azonnal indul a chat
    const foSzaki = valasztott[0];

    // chat létrehozás
    const roomId = canonicalRoom(megrendeloNev, foSzaki.name);
    await letrehozChatSzobat(roomId, megrendeloNev, foSzaki.name, szakma);

    // szakik értesítése a munkáról
    for (const sz of valasztott) {
        await jelzesSzakinak(sz.name, munkaRef.id, szakma);
    }

    // megrendelő átirányítása a chatre
    window.location.href =
        `chat.html?sender=${encodeURIComponent(megrendeloNev)}&partner=${encodeURIComponent(foSzaki.name)}&szakma=${encodeURIComponent(szakma)}`;
}



// 🟧 2. SZAKI KIVÁLASZTÁSA (online + fallback szaki)
async function valasszSzakit(szakma) {
    const szakiKollekcio = collection(db, "szakik");
    const q = query(szakiKollekcio, where("profession", "==", szakma));
    const snap = await getDocs(q);

    const osszes = [];
    snap.forEach(doc => osszes.push(doc.data()));

    if (osszes.length === 0) return [];

    // először online szakik
    const online = osszes.filter(s => s.online === true);

    if (online.length > 0) {
        return online;
    }

    // ha nincs online, adok 3 random releváns szakembert
    const shuffled = osszes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}



// 🟧 3. CHAT SZOBÁNAK A LÉTREHOZÁSA
async function letrehozChatSzobat(roomId, megrendelo, szaki, szakma) {
    const chatRef = doc(db, "chats", roomId);

    await setDoc(chatRef, {
        roomId,
        megrendelo,
        szaki,
        szakma,
        status: "active",
        lastMessageAt: serverTimestamp()
    });
}



// 🟧 4. SZAKI ÉRTESÍTÉSE FIRESTORE-BAN
async function jelzesSzakinak(szakiNev, munkaId, szakma) {
    const jelzesRef = doc(db, "ertesitesek", `${szakiNev}_${munkaId}`);

    await setDoc(jelzesRef, {
        szakiNev,
        munkaId,
        szakma,
        createdAt: serverTimestamp(),
        read: false
    });
}



// 🟧 5. KANONIKUS CHAT SZOBANÉV
function canonicalRoom(a, b) {
    const x = (a || "").trim().toLowerCase();
    const y = (b || "").trim().toLowerCase();
    return [x, y].sort().join("__");
}
