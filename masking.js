// -------------------------------------------------------
// GLOBAL MASK HELPERS – Szaki-App
// -------------------------------------------------------

// Telefonszám maszk: +3630*****67
export function maskPhone(phone) {
    if (!phone) return "";

    // Csak számokat + előjel
    const clean = phone.replace(/\D/g, "");

    // +36 formátumokra optimalizálva
    if (clean.length < 11) return phone;

    // +36 XX XXX XXXX
    const prefix = clean.substring(0, 3);  // +36
    const mid = clean.substring(3, 5);     // pl 30
    const last2 = clean.substring(clean.length - 2); // utolsó 2 számjegy

    return `+36${mid}*****${last2}`;
}


// Email maszk:
// pl: peter@gmail.com → p***r@gm***.com
export function maskEmail(email) {
    if (!email || !email.includes("@")) return email;

    const [user, domain] = email.split("@");

    const maskedUser =
        user.length <= 2
            ? user[0] + "*"
            : user[0] + "***" + user[user.length - 1];

    const dotIndex = domain.indexOf(".");
    const domainName = domain.substring(0, dotIndex);
    const domainExt = domain.substring(dotIndex);

    const maskedDomain =
        domainName.length <= 2
            ? domainName[0] + "*"
            : domainName.substring(0, 2) + "***";

    return `${maskedUser}@${maskedDomain}${domainExt}`;
}


// 5 megosztás után mutassuk ki a valós adatot
export function canRevealRealData(userName) {
    const count = Number(localStorage.getItem(userName + "_share") || 0);
    return count >= 5;
}


// Ezt hívjuk mindenhol, ahol telefonszámot vagy emailt kell mutatni
export function getMaskedContact(userName, contact) {
    if (!contact) return "";

    // ha megosztotta 5x → látja a valós adatot
    if (canRevealRealData(userName)) return contact;

    // maszk típusa
    if (contact.includes("@")) return maskEmail(contact);
    return maskPhone(contact);
}
