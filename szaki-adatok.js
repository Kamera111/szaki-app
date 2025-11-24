<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <title>Messenger – Válassz szakembert</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background: #f5f5f5;
    }
    .wrapper {
      max-width: 480px;
      margin: 0 auto;
      padding: 30px 20px 40px;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 24px;
    }
    .szaki-btn {
      display: block;
      width: 100%;
      padding: 16px 14px;
      margin-bottom: 16px;
      border: none;
      border-radius: 10px;
      background: #ff8c00;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
    }
    .szaki-btn:active {
      transform: translateY(1px);
      filter: brightness(0.95);
    }
    .info {
      margin-top: 16px;
      font-size: 13px;
      color: #666;
    }
  </style>
</head>
<body>

<div class="wrapper">
  <h1>Válassz szakembert</h1>
  <div id="szaki-lista"></div>
  <div class="info" id="info"></div>
</div>

<!-- FONTOS: egyszerű script, NEM modul -->
<script src="szaki-adatok.js"></script>
<script>
  // URL-ből kivesszük a kívánt szakmát
  const params = new URLSearchParams(window.location.search);
  const keresettSzakma = params.get("szakma") || "";

  const listaDiv = document.getElementById("szaki-lista");
  const infoDiv = document.getElementById("info");

  // ha nincs szakma paraméter, kiírjuk
  if (!keresettSzakma) {
    infoDiv.textContent = "Hiányzik a ?szakma= paraméter az URL-ből.";
  }

  // SZAKIK tömb a szaki-adatok.js-ből (globális)
  const szakik = (window.SZAKIK || []).filter(s => !keresettSzakma ||
    s.szakma === keresettSzakma
  );

  if (szakik.length === 0) {
    listaDiv.innerHTML = "<p>Ehhez a szakmához még nincs szakember.</p>";
  } else {
    szakik.forEach(szaki => {
      const btn = document.createElement("button");
      btn.className = "szaki-btn";
      btn.textContent = `${szaki.name} – ${szaki.szakma}`;
      btn.onclick = () => {
        // partner neve a chatnek
        const partnerName = encodeURIComponent(szaki.name);
        const senderName = encodeURIComponent("TesztKliens1");
        window.location.href =
          `chat.html?sender=${senderName}&partner=${partnerName}`;
      };
      listaDiv.appendChild(btn);
    });

    infoDiv.textContent = `Szakma: ${keresettSzakma} – talált szakik: ${szakik.length}`;
  }
</script>

</body>
</html>
