// ======================================================================
//  SzakiChat – szaki-profil.js
//  Szaki profil adatainak kezelése, Firestore szinkron
// ======================================================================

import { db } from "./firebase-config.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    saveName,
    saveSzakma,
    addShare,
    getUserData
} from "./profile-save.js";


// ======================================================================
//  GLOBÁLIS
// ======================================================================
const uid = localStorage.getItem("uid");
if (!uid) {
    alert("Nincs bejelentkezett felhasználó!");
    window.location.href = "login.html";
}

let userData = null;


// ======================================================================
//  ALAP BETÖLTÉS
// ======================================================================
export async function loadSzakiProfile() {
    userData = await getUserData(uid);

    if (!userData) {
        alert("Hiba: nincs felhasználói adat!");
        return;
    }

    // Név mező
    if (document.getElementById("nameInput"))
        document.getElementById("nameInput").value = userData.name || "";

    // Szakma mező
    if (document.getElementById("szakmaSelect"))
        document.getElementById("szakmaSelect").value = userData.szakma || "";

    // Megosztás számláló
    if (document.getElementById("shareCountBox"))
        document.getElementById("shareCountBox").innerText =
            `${userData.shareCount || 0} / 5`;

    // Feloldás jelzés
    if (document.getElementById("unlockInfo")) {
        if ((userData.shareCount || 0) >= 5) {
            document.getElementById("unlockInfo").innerHTML =
                "<span style='color:green; font-weight:bold;'>✔ Elérhetőség küldése feloldva</span>";
        } else {
            document.getElementById("unlockInfo").innerHTML =
                "<span style='color:red;'>🔒 Elérhetőség küldése zárolva</span>";
        }
    }
}


// ======================================================================
//  NÉV MENTÉSE
// ======================================================================
export async function saveNameClick() {
    const name = document.getElementById("nameInput").value.trim();

    const result = await saveName(uid, name);
    if (result.ok) alert("✔ Név elmentve!");
    else alert(result.msg);
}


// ======================================================================
//  SZAKMA MENTÉSE
// ======================================================================
export async function saveSzakmaClick() {
    const szakma = document.getElementById("szakmaSelect").value;

    await saveSzakma(uid, szakma);
    alert("✔ Szakma elmentve!");
}


// ======================================================================
//  MEGOSZTÁS +1 MENTÉSE
// ======================================================================
export async function addShareClick() {
    const newCount = await addShare(uid);

    if (document.getElementById("shareCountBox"))
        document.getElementById("shareCountBox").innerText = `${newCount} / 5`;

    if (newCount >= 5) {
        document.getElementById("unlockInfo").innerHTML =
            "<span style='color:green; font-weight:bold;'>✔ Elérhetőség feloldva</span>";
    }

    alert("Köszönjük a megosztást!");
}
