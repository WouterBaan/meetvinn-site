// Cookiemelding (28-10-2026). Advertentiecookies, voor retargeting, laden pas na toestemming.
// Weigeren is even makkelijk als accepteren, en de keuze is te wijzigen via "Cookie-instellingen"
// onderaan elke pagina. Alleen de keuze zelf wordt in de browser onthouden.
(() => {
  // De pixels die na toestemming laden. Leeg = niets. Invullen zodra de advertentieaccounts er zijn.
  const META_PIXEL_ID = '';
  const GOOGLE_TAG_ID = '';

  const SLEUTEL = 'vinn-cookies';
  const lees = () => {
    try {
      return localStorage.getItem(SLEUTEL);
    } catch {
      return null;
    }
  };
  const bewaar = (keuze) => {
    try {
      localStorage.setItem(SLEUTEL, keuze);
    } catch {}
  };

  const laadPixels = () => {
    if (META_PIXEL_ID) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
    if (GOOGLE_TAG_ID) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_TAG_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GOOGLE_TAG_ID);
    }
  };

  const melding = () => {
    if (document.getElementById('cookiemelding')) return;
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="cookiemelding" id="cookiemelding" role="dialog" aria-label="Cookies">
        <p>We gebruiken op deze website cookies om je later advertenties van Vinn te kunnen tonen, alleen als je daarmee instemt. Meer in de <a href="privacy.html#cookies">privacyverklaring</a>.</p>
        <div class="cookieknoppen">
          <button type="button" class="knop licht" data-keuze="nee">Weigeren</button>
          <button type="button" class="knop licht" data-keuze="ja">Accepteren</button>
        </div>
      </div>`,
    );
    document.querySelectorAll('#cookiemelding [data-keuze]').forEach((knop) =>
      knop.addEventListener('click', () => {
        const keuze = knop.dataset.keuze;
        bewaar(keuze);
        document.getElementById('cookiemelding').remove();
        if (keuze === 'ja') laadPixels();
        else if (lees() !== 'ja' && window.fbq) location.reload();
      }),
    );
  };

  // Eerder ingetrokken toestemming: herladen, zodat geladen pixels weg zijn.
  document.querySelectorAll('[data-cookie-instellingen]').forEach((link) =>
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const was = lees();
      try {
        localStorage.removeItem(SLEUTEL);
      } catch {}
      if (was === 'ja') {
        location.reload();
        return;
      }
      melding();
    }),
  );

  const keuze = lees();
  if (keuze === 'ja') laadPixels();
  else if (keuze !== 'nee') melding();
})();
