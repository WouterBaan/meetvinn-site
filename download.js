// Download Vinn: op een iPhone straks rechtstreeks naar de App Store, verder een venster met de
// QR-code. Op elke pagina, zodat een knop je niet naar de homepagina stuurt (Wouter, 27-10-2026).
(() => {
  // Zodra Vinn in de App Store staat: de link hier, en de QR-code in het venster vervangen.
  const APPSTORE = '';

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
        <p>Scan de code met de camera van je iPhone. Je gaat dan naar Vinn in de App Store.</p>
        <div class="qrcode" aria-label="QR-code naar de App Store"><span>QR-code</span></div>
      </dialog>`,
    );
    venster = document.getElementById('qrvenster');
  }

  const open = (e) => {
    if (e) e.preventDefault();
    if (APPSTORE && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      location.href = APPSTORE;
      return;
    }
    if (venster.showModal) venster.showModal();
    else venster.setAttribute('open', '');
  };

  // De knoppen in de kop, de opening, de kaarten en de afsluiting; en een oude link naar #download.
  document
    .querySelectorAll('#download, [data-download], a[href$="#download"]')
    .forEach((knop) => knop.addEventListener('click', open));
  if (location.hash === '#download') open();

  venster.querySelector('.sluit').addEventListener('click', () => venster.close());
  venster.addEventListener('click', (e) => {
    if (e.target === venster) venster.close();
  });
})();
