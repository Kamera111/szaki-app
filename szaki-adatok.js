// =====================================================
// Szaki-App – Teljes szaki-adatbázis (valódi + ál-szakik)
// AI automata válaszokkal és megjelenési logikával
// =====================================================

(function () {

    // -----------------------------------------
    // 1) TELEFONSZÁM MASZKOLÁS
    // -----------------------------------------
    function maskPhone(phone) {
        if (!phone) return "";
        let clean = phone.replace(/[^0-9+]/g, "");
        if (clean.length < 6) return clean;
        const prefix = clean.slice(0, 4);
        const suffix = clean.slice(-2);
        return prefix + "*****" + suffix;
    }

    // -----------------------------------------
    // 2) EMAIL MASZKOLÁS
    // -----------------------------------------
    function maskEmail(email) {
        if (!email || !email.includes("@")) return "";
        const [local, domain] = email.split("@");
        return local[0] + "*****@" + domain;
    }

    // -----------------------------------------
    // 3) ÁLSZAKI NEVEK
    // -----------------------------------------
    const VEZETEK = [
        "K.", "S.", "T.", "F.", "P.", "V.", "M.", "B.", "H.", "Cs."
    ];
    const KERESZT = [
        "Béla", "András", "Tamás", "Jenő", "Gábor", "László", "Tibi",
        "Jani", "Pista", "Ákos", "Kornél", "Attila", "Zoli", "Robi",
        "Dani", "Miki", "Ferenc", "Csaba", "Péter"
    ];

    // -----------------------------------------
    // 4) SZAKMÁK – MIND BŐVÍTVE, AHOGY KÉRTED
    // -----------------------------------------
    const SZAKMAK = [
        "Festő", "Burkoló", "Gipszkarton", "Villanyszerelő",
        "Gázkészülék-szerelő", "Autószerelő", "Asztalos",
        "Épületasztalos", "Bútorasztalos", "Bútor összeszerelő",
        "Kőműves", "Víz-gáz-fűtés", "Tetőfedő", "Kertész",
        "Teljes felújítás"
    ];

    // -----------------------------------------
    // 5) ÁLSZAKIK GENERÁLÁSA (50+ db)
    // -----------------------------------------
    function generateFakeWorkers() {
        const list = [];

        SZAKMAK.forEach(szakma => {

            // 2 online + 3 offline / szakma
            for (let i = 0; i < 5; i++) {
                const name = `${VEZETEK[Math.floor(Math.random() * VEZETEK.length)]} ${KERESZT[Math.floor(Math.random() * KERESZT.length)]}`;

                list.push({
                    name,
                    profession: szakma,
                    isReal: false,
                    isFake: true,

                    // első 2 → online, többi offline
                    isOnline: i < 2,

                    // random utolsó aktivitás (5–120 perc)
                    lastActiveMinutes: i < 2 ? 0 : Math.floor(Math.random() * 115) + 5,

                    phone: "+3630" + Math.floor(1000000 + Math.random() * 8999999),
                    email: "info@" + szakma.replace(/[^a-z0-9]/gi,
