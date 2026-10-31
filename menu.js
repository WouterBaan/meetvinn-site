// Het menu op de telefoon: logo, Download en een menuknop (31-10-2026, Wouter akkoord).
//
// De links staan maar één keer in elke pagina, in de bestaande <nav>. Dit script maakt
// er een uitklapmenu van door ze te kopiëren, zodat er geen tweede lijst bij te houden
// is. De knop zelf staat al in de HTML, en de telefoonopmaak hangt aan de class `js` die de
// <head> zet: zo staat de balk vanaf het eerste beeld goed, in plaats van te verspringen
// zodra dit script klaar is (31-10-2026, gemeld door Wouter). Zonder script blijft de balk
// met de gewone links.
(function () {
  var kop = document.querySelector('.kop');
  var nav = kop && kop.querySelector('nav');
  if (!nav) return;

  var knop = nav.querySelector('.menuknop');
  if (!knop) return;

  var menu = document.createElement('div');
  menu.className = 'uitklapmenu';
  menu.id = 'uitklapmenu';
  menu.hidden = true;
  Array.prototype.forEach.call(nav.querySelectorAll('a:not(.knop)'), function (link) {
    menu.appendChild(link.cloneNode(true));
  });

  kop.appendChild(menu);

  function zet(open) {
    menu.hidden = !open;
    knop.setAttribute('aria-expanded', open ? 'true' : 'false');
    kop.classList.toggle('menu-open', open);
  }

  knop.addEventListener('click', function () {
    zet(menu.hidden);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) zet(false);
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !kop.contains(e.target)) zet(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      zet(false);
      knop.focus();
    }
  });
  // Wie het venster breder maakt, krijgt de gewone balk terug zonder een open menu.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 600 && !menu.hidden) zet(false);
  });
})();
