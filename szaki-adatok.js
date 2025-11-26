// Szaki-App – egységes szaki adatbázis + segédfüggvények
// Másold be ezt a fájlt változtatás nélkül a projekt gyökerébe.

(function () {

    // -------------------------------
    // TELEFONSZÁM MASZKOLÁS (UNIVERZÁLIS)
    // -------------------------------
    function maskPhone(phone) {
        if (!phone) return "";

        // csak számok + plusz jel marad
        let clean = phone.replace(/[^0-9+]/g, "");

        // ha túl rövid, nem maszkáljuk
        if (clean.length < 6) return clean;

        // példák:
        // +36301234567 → +3630*****67
        // +36209998877 → +3620*****77
        // +3612345678  → +361*****78

        const prefix = clean.slice(0, 4);           // +3630
        const suffix = clean.slice(-2);             // 67
        const stars = "*****";                      // fix

        return prefix + stars + suffix;
    }

    // -------------------------------
    // EMAIL MASZKOLÁS (UNIVERZÁLIS)
    // -------------------------------
    function maskEmail(email) {
        if (!email || !email.includes("@")) return "";

        const [local, domain] = email.split("@");

        // legalább az első karakter maradjon
        const first = local.slice(0, 1);
        return first + "*****@" + domain;
    }

    // -------------------------------
    // ALAP SZAKI LISTA
    // -------------------------------
    const SZAKIK = [
        {
            name: "Csabi",
            profession: ["Festő", "Burkoló", "Teljes felújítás"],
            note: "",
            phone: "+36201234567",
            email: "csabi@example.com",
            isReal: true,
            isOnline: true,
            priority: 100,
            maxJobs: Infinity,
            calendarAvailability: "always"
        },
        {
            name: "Zsolti",
            profession: ["Villanyszerelő", "Gépész"],
            note: "Gyors javítások, kisebb munkák azonnal",
            phone: "+36307654321",
            email: "zsolti@example.com",
            isReal: true,
            isOnline: true,
            priority: 90,
            maxJobs: Infinity,
            calendarAvailability: "always"
        },
        {
            name: "Demo Péter",
            profession: "Villanyszerelő",
            note: "Szabadság miatt nem elérhető",
            phone: "+36701112222",
            email: "demo@example.com",
            isReal: false,
            isOnline: false,
            priority: 10,
            maxJobs: 3,
            holidays: { 
                from: "2025-08-01", 
                to: "2025-08-20" 
            },
            calendarAvailability: "busy"
        },
        {
            name: "Anna",
            profession: ["Festő"],
            note: "Több lakást is felújítottam",
            phone: "+36209998888",
            email: "anna@example.com",
            isReal: true,
            isOnline: false,
            priority: 30,
            maxJobs: 3,
            calendarAvailability: "normal"
        }
    ];

    // -------------------------------
    // EXPORT
    // -------------------------------
    window.SzakiAdatok = {

        getAllSzakik: function () {
            return SZAKIK.map(s => JSON.parse(JSON.stringify(s)));
        },

        // szakma alapján
        findByProfession: function (szakma) {
            return SZAKIK.filter(sz => {
                if (Array.isArray(sz.profession)) {
                    return sz.profession.includes(szakma);
                }
                return sz.profession === szakma;
            }).map(s => JSON.parse(JSON.stringify(s)));
        },

        // Online szakik
        getOnlineSzakik: function (szakma) {
            return SZAKIK
                .filter(sz => sz.isOnline)
                .filter(sz => {
                    if (Array.isArray(sz.profession)) return sz.profession.includes(szakma);
                    return sz.profession === szakma;
                })
                .map(s => JSON.parse(JSON.stringify(s)));
        },

        // Offline fallback
        getCalendarBasedBackup: function (szakma) {
            return SZAKIK
                .filter(sz => !sz.isOnline)
                .filter(sz => {
                    if (Array.isArray(sz.profession)) return sz.profession.includes(szakma);
                    return sz.profession === szakma;
                })
                .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                .map(s => JSON.parse(JSON.stringify(s)));
        },

        // maszkos telefonszám
        getMaskedPhone: function (szaki) {
            return maskPhone(szaki?.phone || "");
        },

        // maszkos email
        getMaskedEmail: function (szaki) {
            return maskEmail(szaki?.email || "");
        },

        // szabadság
        getHolidayLabel: function (szaki) {
            if (!szaki || !szaki.holidays) return "";
            const h = szaki.holidays;
            if (h.from && h.to) return `Nyaralás: ${h.from} – ${h.to}`;
            if (h.from) return `Nyaralás kezdete: ${h.from}`;
            if (h.to) return `Nyaralás vége: ${h.to}`;
            return "";
        }
    };

})();
