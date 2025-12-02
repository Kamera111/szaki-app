// =========================================================
//  SzakiChat – chat-create.js
//  Chat létrehozása megrendelő és szaki között
// =========================================================

import { db } from "./firebase-config.js";
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    generateChatId,
    initChatIfNeeded
} from "./messages.js";


// =========================================================
// CHAT INDÍTÁSA (megrendelő -> szaki)
// =========================================================
export async function startChatWithSzaki(szakiUid) {
    const myUid = localStorage.getItem("uid");

    if (!myUid) {
        alert("Hiba: nincs bejelentkezett felhasználó!");
        return;
    }

    // Chat létrehozása, ha még nincs
    const chatId = await initChatIfNeeded(myUid, szakiUid);

    // partner adatainak lekérése redirect előtt
    const partnerSnap = await getDoc(doc(db, "users", szakiUid));
    let partnerName = "Partner";

    if (partnerSnap.exists()) {
        partnerName = partnerSnap.data().name || "Partner";
    }

    // első üzenet létrehozása: csak ha új a chat
    await updateDoc(doc(db, "chatSessions", chatId), {
        lastMessage: "Chat elindult",
        lastSender: myUid,
        lastTime: serverTimestamp()
    });

    // átirányítás
    window.location.href = `chat.html?chatId=${chatId}&partner=${encodeURIComponent(partnerName)}`;
}
