/* Purrage "Guides" dropdown: one place to edit the menu for every page. */
(function () {
  var GROUPS = [
    { title: 'The basics', links: [
      ['How Do Cats Age?', '/how-do-cats-age/'],
      ['Cat Years to Human Years', '/how-old-is-my-cat-in-human-years/'],
      ['How Long Do Cats Live?', '/how-long-do-cats-live/'],
      ['Longest-Living Cat Breeds', '/longest-living-cat-breeds/']
    ]},
    { title: 'Life stages', links: [
      ['Cat Life Stages', '/cat-life-stages/'],
      ['Kitten Age Chart', '/kitten-age-chart/'],
      ['How to Tell a Cat’s Age', '/how-to-tell-how-old-a-cat-is/'],
      ['When Is a Cat Senior?', '/when-is-a-cat-senior/'],
      ['Oldest Cat Ever', '/oldest-cat-ever/']
    ]},
    { title: 'Cat health', links: [
      ['Senior Cat Health', '/senior-cat-health/'],
      ['Kidney Disease', '/cat-kidney-disease-signs/'],
      ['Hyperthyroidism', '/hyperthyroidism-in-cats/'],
      ['Arthritis', '/cat-arthritis-signs/'],
      ['Dental Disease', '/cat-dental-disease/'],
      ['Healthy Weight', '/healthy-cat-weight/'],
      ['Cat Vet Near Me', '/cat-vet-near-me/']
    ]},
    { title: 'Feeding', links: [
      ['Cat Feeding Guide', '/cat-feeding-guide/'],
      ['Kitten Feeding Schedule', '/kitten-feeding-schedule/'],
      ['How Much to Feed', '/how-much-to-feed-a-cat/'],
      ['Wet vs Dry Food', '/wet-vs-dry-cat-food/'],
      ['Senior Cat Diet', '/senior-cat-diet/'],
      ['Switching Food', '/how-to-switch-cat-food/']
    ]},
    { title: 'Breed guides', links: [
      ['All Cat Breeds', '/cat-breeds/'],
      ['Maine Coon', '/maine-coon-lifespan/'],
      ['Siamese', '/siamese-lifespan/'],
      ['Ragdoll', '/ragdoll-lifespan/'],
      ['Persian', '/persian-lifespan/'],
      ['British Shorthair', '/british-shorthair-lifespan/'],
      ['Bengal', '/bengal-lifespan/']
    ]}
  ];

  var uid = 0;
  function build(placement) {
    var id = 'nav-dd-' + (++uid);
    var wrap = document.createElement('div');
    wrap.className = 'nav-dd nav-dd-' + placement;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-dd-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', id);
    btn.innerHTML = 'Guides <span class="nav-dd-caret" aria-hidden="true"></span>';
    var panel = document.createElement('div');
    panel.className = 'nav-dd-panel';
    panel.id = id;
    panel.hidden = true;
    var path = location.pathname.replace(/index\.html$/, '');
    GROUPS.forEach(function (g) {
      var sec = document.createElement('div');
      sec.className = 'nav-dd-group';
      var h = document.createElement('p');
      h.className = 'nav-dd-title';
      h.textContent = g.title;
      sec.appendChild(h);
      g.links.forEach(function (l) {
        var a = document.createElement('a');
        a.href = l[1];
        a.textContent = l[0];
        if (path === l[1]) a.setAttribute('aria-current', 'page');
        sec.appendChild(a);
      });
      panel.appendChild(sec);
    });
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    return wrap;
  }

  function closeAll(except) {
    document.querySelectorAll('.nav-dd').forEach(function (w) {
      if (w === except) return;
      w.querySelector('.nav-dd-btn').setAttribute('aria-expanded', 'false');
      w.querySelector('.nav-dd-panel').hidden = true;
    });
  }

  function init() {
    var header = document.querySelector('.site-nav');
    var footer = document.querySelector('.footer-links');
    if (header) {
      var first = header.querySelector('a');
      var dd = build('down');
      if (first && first.nextSibling) header.insertBefore(dd, first.nextSibling);
      else header.appendChild(dd);
    }
    if (footer) footer.insertBefore(build('up'), footer.firstChild);

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.nav-dd-btn') : null;
      if (btn) {
        var wrap = btn.parentNode;
        var panel = wrap.querySelector('.nav-dd-panel');
        var open = btn.getAttribute('aria-expanded') === 'true';
        closeAll(wrap);
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
        if (!open && wrap.classList.contains('nav-dd-down') && window.matchMedia('(max-width:640px)').matches) {
          var hdr = document.querySelector('.site-header');
          if (hdr) panel.style.top = (hdr.getBoundingClientRect().bottom + 8) + 'px';
        }
        return;
      }
      if (!(e.target.closest && e.target.closest('.nav-dd-panel'))) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
