// =========================================================
//  SzakiChat – messages.js
//  Valós idejű üzenetkezelő és chat motor
// =========================================================

import { db } from "./firebase-config.js";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    onSnapshot,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =========================================================
// CHAT ID GENERÁLÁS (2 user azonosítása)
// Mindig ugyanaz legyen: ABC sorrend!
// =========================================================
export function generateChatId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}


// =========================================================
// CHAT LÉTREHOZÁSA (ha még nincs)
// Mindkét fél chatlistájába beírjuk
// =========================================================
export async function initChatIfNeeded(uid, partnerUid) {
    const chatId = generateChatId(uid, partnerUid);

    const chatRef = doc(db, "chatSessions", chatId);
    const snap = await getDoc(chatRef);

    if (!snap.exists()) {
        // partner adatok lekérése
        const partnerRef = doc(db, "users", partnerUid);
        const partner = (await getDoc(partnerRef)).data();

        const meRef = doc(db, "users", uid);
        const me = (await getDoc(meRef)).data();

        // chat létrehozása
        await setDoc(chatRef, {
            chatId,
            users: [uid, partnerUid],
            lastMessage: "",
            lastSender: "",
            lastTime: serverTimestamp()
        });

        // chat-lista létrehozása mindkét félnek
        await updateDoc(doc(db, "users", uid), {
            [`chatList.${chatId}`]: {
                uid: partnerUid,
                name: partner.name,
                lastMessage: "",
                unread: 0
            }
        });

        await updateDoc(doc(db, "users", partnerUid), {
            [`chatList.${chatId}`]: {
                uid,
                name: me.name,
                lastMessage: "",
                unread: 0
            }
        });
    }

    return chatId;
}


// =========================================================
// ÜZENET KÜLDÉSE
// =========================================================
export async function sendMessage(chatId, senderUid, text) {
    if (!text.trim()) return;

    // Üzenet mentése
    await addDoc(collection(db, "messages", chatId, "items"), {
        sender: senderUid,
        text,
        time: serverTimestamp()
    });

    // ChatSession frissítése
    await updateDoc(doc(db, "chatSessions", chatId), {
        lastMessage: text,
        lastSender: senderUid,
        lastTime: serverTimestamp()
    });
}


// =========================================================
// VALÓS IDEJŰ ÜZENETFIGYELÉS
// callback(messagesList)
// =========================================================
export function subscribeToMessages(chatId, callback) {
    const q = query(
        collection(db, "messages", chatId, "items"),
        orderBy("time", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        callback(messages);
    });
}


// =========================================================
// PARTNER ADATAINAK LEKÉRÉSE
// =========================================================
export async function getPartnerData(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.data();
}
