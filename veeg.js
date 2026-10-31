// Veegkaarten met bolletjes eronder op de telefoon (31-10-2026): Zo werkt Vinn en Huishouden
// op de homepagina, en de vier blokken op de Privacy-pagina. De bolletjes zeggen waar je bent
// en springen bij een tik naar die kaart. Op de laptop staan de kaarten naast of onder elkaar
// en zijn de bolletjes verborgen (zie .stippen in style.css).
(function () {
  function veegkaarten(rij, kaartje, naam) {
    if (!rij) return;
    var kaarten = Array.prototype.slice.call(rij.querySelectorAll(kaartje));
    var stippen = document.createElement('div');
    stippen.className = 'stippen';
    var knoppen = kaarten.map(function (kaart, i) {
      var knop = document.createElement('button');
      knop.type = 'button';
      knop.setAttribute('aria-label', naam + ' ' + (i + 1));
      knop.addEventListener('click', function () {
        rij.scrollTo({ left: kaart.offsetLeft - kaarten[0].offsetLeft, behavior: 'smooth' });
      });
      stippen.appendChild(knop);
      return knop;
    });
    rij.after(stippen);
    function zet() {
      var breed = kaarten[0].getBoundingClientRect().width + 12;
      var hier = Math.min(kaarten.length - 1, Math.max(0, Math.round(rij.scrollLeft / breed)));
      knoppen.forEach(function (knop, i) {
        knop.setAttribute('aria-current', i === hier ? 'true' : 'false');
      });
    }
    rij.addEventListener('scroll', function () { requestAnimationFrame(zet); }, { passive: true });
    zet();
  }

  veegkaarten(document.querySelector('#hoe .stappen'), '.stap', 'Stap');
  veegkaarten(document.querySelector('#samen .samen-raster'), '.zij', 'Kaart');
  veegkaarten(document.querySelector('.privacy-punten .blokken'), '.blok', 'Kaart');
})();
