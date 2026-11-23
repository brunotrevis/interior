{
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // mobile drawer
  const drawer = $('.drawer');
  $$('[data-menu]').forEach(b => b.addEventListener('click', () => {
    const open = !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    $$('[data-menu]').forEach(x => x.setAttribute('aria-expanded', open));
  }));

  // language switch: section names in EN / PT / ES
  const L = {
    en: ['Cities', 'Design', 'Craft', 'Food', 'Field notes', 'Guides', 'Subscribe'],
    pt: ['Cidades', 'Design', 'Ofício', 'Comida', 'Notas de campo', 'Guias', 'Assine'],
    es: ['Ciudades', 'Diseño', 'Oficio', 'Comida', 'Notas de campo', 'Guías', 'Suscríbete']
  };
  const setLang = k => {
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === k));
    $$('[data-i]').forEach(el => { el.textContent = L[k][+el.dataset.i]; });
    document.documentElement.lang = k;
  };
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));

  // horizontal strip controls
  $$('[data-strip]').forEach(ctrl => {
    const strip = $('#' + ctrl.dataset.strip);
    const step = d => strip.scrollBy({ left: d * strip.clientWidth * 0.8, behavior: 'smooth' });
    $('[data-prev]', ctrl).addEventListener('click', () => step(-1));
    $('[data-next]', ctrl).addEventListener('click', () => step(1));
    strip.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  });

  // reading progress
  const bar = $('.progress');
  if (bar) {
    const upd = () => {
      const h = document.documentElement;
      bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  // section filter chips
  const chips = $$('.chips button');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    const f = c.dataset.f;
    $$('.feed .card').forEach(card => { card.hidden = f !== 'all' && card.dataset.f !== f; });
  }));

  // newsletter (concept: nothing is sent)
  $$('form[data-news]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    $('.note', f).textContent = 'Thank you. This is a concept site, so no email was stored or sent.';
  }));

  // gallery
  const stage = $('.g-stage');
  if (stage) {
    const slides = $$('.slide', stage);
    const thumbs = $$('.thumbs button');
    let cur = 0;
    const go = i => {
      cur = Math.max(0, Math.min(slides.length - 1, i));
      slides[cur].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        cur = slides.indexOf(e.target);
        thumbs.forEach((t, j) => t.setAttribute('aria-current', j === cur));
        thumbs[cur].scrollIntoView({ block: 'nearest', inline: 'nearest' });
        if (location.hash !== '#' + e.target.id) history.replaceState(null, '', '#' + e.target.id);
      }
    }), { root: stage, threshold: 0.6 });
    slides.forEach(s => io.observe(s));
    thumbs.forEach((t, j) => t.addEventListener('click', () => go(j)));
    $('[data-gprev]').addEventListener('click', () => go(cur - 1));
    $('[data-gnext]').addEventListener('click', () => go(cur + 1));
    addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') go(cur + 1);
      if (e.key === 'ArrowLeft') go(cur - 1);
    });
    const start = slides.findIndex(s => '#' + s.id === location.hash);
    if (start > 0) requestAnimationFrame(() => { stage.scrollLeft = start * stage.clientWidth; });
  }
}
