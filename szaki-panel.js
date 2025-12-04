// ===============================
// FIREBASE IMPORT
// ===============================
import { db, auth } from "./firebase.js";

import {
    doc, getDoc, updateDoc, setDoc,
    collection, query, where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ===============================
// GLOBÁLIS VÁLTOZÓK
// ===============================
let uid = null;
let szaki = null;
let activeChats = [];
let blockedUsers = [];

// ===============================
// BELÉPÉS FIGYELÉSE
// ===============================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    uid = user.uid;
    await loadSzakiProfile();
    await setOnlineStatus(true);
    watchIncomingChats();
});

// ===============================
// SZAKI PROFIL BETÖLTÉSE
// ===============================
async function loadSzakiProfile() {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        alert("Hiba: nincs szaki profil!");
        return;
    }

    szaki = snap.data();
    activeChats = szaki.activeChats || [];
    blockedUsers = szaki.blockedUsers || [];

    document.getElementById("nameBox").innerText = szaki.name;
    document.getElementById("skillBox").innerText = szaki.skills.join(", ");
    document.getElementById("cityBox").innerText = szaki.city;
    document.getElementById("onlineBox").innerText = "🟢 Online";

    renderActiveUsers();
}

// ===============================
// ONLINE ÁLLAPOT FIRESTORE-BE
// ===============================
async function setOnlineStatus(state) {
    await updateDoc(doc(db, "users", uid), {
        online: state,
        lastSeen: Date.now()
    });
}

// ===============================
// AKTÍV MEGRENDELŐK LISTÁJA
// ===============================
function renderActiveUsers() {
    const box = document.getElementById("activeUsers");
    box.innerHTML = "";

    if (activeChats.length === 0) {
        box.innerHTML = "<i>Nincs aktív beszélgetés.</i>";
        return;
    }

    activeChats.forEach(userID => {
        box.innerHTML += `
            <div class="userItem">
                <b>${userID}</b><br>
                <button class="btn" onclick="openChat('${userID}')">Chat megnyitása</button>
                <button class="removeBtn" onclick="removeUser('${userID}')">X</button>
            </div>
        `;
    });
}

// ===============================
// ÚJ MEGRENDELŐK FIGYELÉSE REALTIME
// ===============================
function watchIncomingChats() {
    const q = query(
        collection(db, "chats"),
        where("szakiID", "==", uid)
    );

    const newUsersBox = document.getElementById("newUsers");

    onSnapshot(q, (snapshot) => {
        newUsersBox.innerHTML = "";

        snapshot.forEach(docu => {
            const chat = docu.data();

            // ha már aktív vagy tiltott → NEM jelenítjük meg
            if (activeChats.includes(chat.userID)) return;
            if (blockedUsers.includes(chat.userID)) return;

            newUsersBox.innerHTML += `
                <div class="userItem">
                    <b>${chat.userName}</b><br>
                    <span class="small">Új megkeresés</span><br>
                    <button class="btn" onclick="acceptUser('${chat.userID}')">Elfogadás</button>
                    <button class="removeBtn" onclick="rejectUser('${chat.userID}')">X</button>
                </div>
            `;
        });
    });
}

// ===============================
// ÚJ MEGRENDELŐ ELFOGADÁSA
// ===============================
window.acceptUser = async function(userID) {
    if (activeChats.length >= 3) {
        alert("Egyszerre maximum 3 megrendelővel beszélhetsz!");
        return;
    }

    activeChats.push(userID);

    await updateDoc(doc(db, "users", uid), {
        activeChats
    });

    renderActiveUsers();
};

// ===============================
// MEGRENDELŐ ELUTASÍTÁSA (X)
// ===============================
window.rejectUser = async function(userID) {
    if (!blockedUsers.includes(userID)) {
        blockedUsers.push(userID);
    }

    await updateDoc(doc(db, "users", uid), {
        blockedUsers
    });

    alert("A megrendelő tájékoztatva lett: „Köszönöm a megbeszélést, 24 órán belül döntök.”");
};

// ===============================
// AKTÍV ÜGYFÉL TÖRLÉSE (X)
// ===============================
window.removeUser = async function(userID) {
    activeChats = activeChats.filter(x => x !== userID);

    if (!blockedUsers.includes(userID)) {
        blockedUsers.push(userID);
    }

    await updateDoc(doc(db, "users", uid), {
        activeChats,
        blockedUsers
    });

    renderActiveUsers();
};

// ===============================
// CHAT MEGNYITÁSA
// ===============================
window.openChat = function(userID) {
    window.location.href = `szaki-chat.html?partner=${userID}`;
};
