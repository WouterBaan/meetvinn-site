// Het menu op de telefoon: logo, Download en een menuknop (31-10-2026, Wouter akkoord).
//
// De links staan maar één keer in elke pagina, in de bestaande <nav>. Dit script maakt
// er een uitklapmenu van door ze te kopiëren, zodat er geen tweede lijst bij te houden
// is. Zonder script blijft de balk zoals hij was: de class `menu-klaar` zet de
// telefoonopmaak pas aan als dit gelopen heeft.
(function () {
  var kop = document.querySelector('.kop');
  var nav = kop && kop.querySelector('nav');
  if (!nav) return;

  var knop = document.createElement('button');
  knop.type = 'button';
  knop.className = 'menuknop';
  knop.setAttribute('aria-label', 'Menu');
  knop.setAttribute('aria-expanded', 'false');
  knop.setAttribute('aria-controls', 'uitklapmenu');
  knop.innerHTML = '<span></span><span></span><span></span>';

  var menu = document.createElement('div');
  menu.className = 'uitklapmenu';
  menu.id = 'uitklapmenu';
  menu.hidden = true;
  Array.prototype.forEach.call(nav.querySelectorAll('a:not(.knop)'), function (link) {
    menu.appendChild(link.cloneNode(true));
  });

  nav.appendChild(knop);
  kop.appendChild(menu);
  kop.classList.add('menu-klaar');

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
