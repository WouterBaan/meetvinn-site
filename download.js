// Download Vinn, op de pagina Abonnement. Elke Download-knop op de site gaat hierheen, zodat je
// eerst een abonnement kiest (Wouter, 27-10-2026). De knop in een prijskaart opent dan een
// venster met de QR-code, of op een iPhone straks rechtstreeks de App Store.
(() => {
  // Zodra Vinn in de App Store staat: de link hier, en de QR-code in het venster vervangen.
  const APPSTORE = '';

  // Het inschrijfformulier van Brevo voor de wachtlijst (met dubbele bevestiging per mail).
  // Invullen: het adres uit Brevo, Contacten → Formulieren → het formulier → Delen → "HTML-code",
  // de waarde van action="…" (begint met https://…sibforms.com/serve/…).
  const WACHTLIJST = '';

  let venster = document.getElementById('qrvenster');
  if (!venster) {
    document.body.insertAdjacentHTML(
      'beforeend',
      `<dialog class="qrvenster" id="qrvenster" aria-labelledby="qrtitel">
        <button class="sluit" type="button" aria-label="Sluiten">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <img class="qrlogo" src="favicon-192.png" alt="" />
        <h2 id="qrtitel">Download Vinn</h2>
        <p class="qrkeuze" hidden><strong></strong><span></span></p>
        <p class="met-winkel">Scan de code met de camera van je iPhone. Je gaat dan naar Vinn in de App Store.</p>
        <div class="qrcode met-winkel" aria-label="QR-code naar de App Store"><span>QR-code</span></div>
        <div class="zonder-winkel">
          <p>Vinn komt binnenkort in de App Store. Laat je e-mailadres achter, dan laten we het je weten.</p>
          <form class="wachtlijst" novalidate>
            <label class="onzichtbaar" for="wachtlijst-mail">E-mailadres</label>
            <input id="wachtlijst-mail" type="email" name="EMAIL" autocomplete="email" placeholder="je@email.nl" required />
            <button type="submit" class="knop groen">Houd me op de hoogte</button>
          </form>
          <p class="wachtlijst-uitleg">Je krijgt eerst een mail om je inschrijving te bevestigen. Afmelden kan altijd. Zie de <a href="privacy.html">privacyverklaring</a>.</p>
          <p class="wachtlijst-klaar" hidden>Bijna klaar. Bevestig je inschrijving via de mail die je nu krijgt.</p>
        </div>
      </dialog>`,
    );
    venster = document.getElementById('qrvenster');
  }

  // Zonder App Store-link geen QR-code, maar een eerlijke zin en de wachtlijst.
  venster.querySelectorAll(APPSTORE ? '.zonder-winkel' : '.met-winkel').forEach((el) => el.remove());

  const formulier = venster.querySelector('.wachtlijst');
  if (formulier) {
    formulier.addEventListener('submit', async (e) => {
      e.preventDefault();
      const veld = formulier.querySelector('input');
      if (!veld.checkValidity()) {
        veld.reportValidity();
        return;
      }
      const knop = formulier.querySelector('button');
      knop.disabled = true;
      try {
        // Brevo stuurt geen leesbaar antwoord terug naar een andere website (no-cors); het
        // bevestigen gebeurt in de mail.
        if (WACHTLIJST) {
          const data = new FormData();
          data.append('EMAIL', veld.value);
          data.append('email_address_check', '');
          data.append('locale', 'nl');
          await fetch(WACHTLIJST, { method: 'POST', body: data, mode: 'no-cors' });
        }
        formulier.hidden = true;
        venster.querySelector('.wachtlijst-uitleg').hidden = true;
        venster.querySelector('.wachtlijst-klaar').hidden = false;
      } catch {
        knop.disabled = false;
      }
    });
  }

  // Kwam je via een prijskaart, dan staat in het venster wat je koos: welk abonnement, per maand
  // of per jaar, en wat het kost. De prijs staat op de kaart zelf (data-vinn, data-huishouden).
  const toonKeuze = (knop) => {
    const vak = venster.querySelector('.qrkeuze');
    const kaart = knop && knop.closest ? knop.closest('.prijskaart') : null;
    if (!vak) return;
    if (!kaart) {
      vak.hidden = true;
      return;
    }
    const product = kaart.closest('.prijs-kaarten').dataset.product;
    const periode = kaart.querySelector('h2').textContent.trim().toLowerCase();
    vak.querySelector('strong').textContent =
      (product === 'huishouden' ? 'Vinn Huishouden' : 'Vinn') + ', ' + periode;
    vak.querySelector('span').textContent = kaart.dataset[product] + ', de eerste maand gratis';
    vak.hidden = false;
  };

  const open = (e) => {
    if (e) e.preventDefault();
    toonKeuze(e && e.currentTarget);
    // Achter het venster terug naar boven, zodat je na het sluiten bij de keuze staat.
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (APPSTORE && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      location.href = APPSTORE;
      return;
    }
    if (venster.showModal) venster.showModal();
    else venster.setAttribute('open', '');
  };

  document.querySelectorAll('[data-download]').forEach((knop) => knop.addEventListener('click', open));

  // Een Download-knop op deze pagina zelf (in de kop of de afsluiting): terug naar boven
  // schuiven, naar de titel en de keuze, in plaats van de pagina opnieuw te laden.
  document.querySelectorAll('a[href="prijs.html"].knop').forEach((knop) =>
    knop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }),
  );

  venster.querySelector('.sluit').addEventListener('click', () => venster.close());
  venster.addEventListener('click', (e) => {
    if (e.target === venster) venster.close();
  });
})();
