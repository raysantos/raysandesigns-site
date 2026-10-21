(() => {
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Top app bar: surface-container color once content scrolls under it (M3 on-scroll behavior)
  const bar = document.querySelector('.top-app-bar');
  const onScroll = () => bar && bar.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Header progress bar: grows left to right as the page scrolls
  const prog = document.querySelector('.scroll-progress');
  if (prog) {
    let ticking = false;
    const setProg = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const band = document.querySelector('.hero-band');
      const bar = document.querySelector('.top-app-bar');
      // Start filling only once the gradient hero has scrolled up under the header
      const start = band ? Math.max(0, band.offsetTop + band.offsetHeight - (bar ? bar.offsetHeight : 0)) : 0;
      const span = max - start;
      const p = span > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / span)) : 0;
      prog.style.setProperty('--progress', p.toFixed(4));
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(setProg); } }, { passive: true });
    window.addEventListener('resize', setProg);
    setProg();
  }

  // Snackbar
  const snack = document.querySelector('.snackbar');
  let snackT;
  function toast(msg) {
    if (!snack) return;
    snack.textContent = msg; snack.classList.add('show');
    clearTimeout(snackT); snackT = setTimeout(() => snack.classList.remove('show'), 3000);
  }

  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      const fallback = () => {
        const el = document.getElementById('email'); if (!el) return;
        const r = document.createRange(); r.selectNodeContents(el);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        toast('Email selected. Press Ctrl+C to copy.');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => toast('Email address copied')).catch(fallback);
      } else fallback();
    });
  });

  // Section tracking for nav bar, top nav and FAB
  const links = [...document.querySelectorAll('.nav-bar a, .top-nav a')];
  const fab = document.querySelector('.fab');
  const ids = ['work', 'experience', 'about', 'contact'];
  const secs = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (secs.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        links.forEach(a => {
          const on = a.getAttribute('href') === '#' + id;
          if (a.closest('.nav-bar')) a.classList.toggle('active', on);
          else on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
        });
        if (fab) fab.classList.toggle('hide', id === 'contact');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
  }

  // Lightbox dialog
  const dlg = document.querySelector('dialog.lb');
  if (dlg) {
    const img = dlg.querySelector('img');
    const title = dlg.querySelector('.dlg-title');
    document.querySelectorAll('.fig .zoom').forEach(b => {
      b.addEventListener('click', () => {
        const src = b.querySelector('img');
        img.src = src.currentSrc || src.src; img.alt = src.alt;
        const cap = b.closest('figure').querySelector('figcaption b');
        title.textContent = cap ? cap.textContent.replace(/\.$/, '') : 'Screen';
        dlg.showModal();
      });
    });
    dlg.querySelector('.close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }

  // Work section: case study cards (not the text-only older work) shuffle once a day, seeded by the local date
  const grid = document.getElementById('work-grid');
  if (grid) {
    const cards = [...grid.querySelectorAll(':scope > .feature:not(.text-only)')];
    const d = new Date();
    let seed = 2166136261; // FNV-1a hash of the date, so neighbouring days don't start alike
    for (const ch of `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619);
    const rand = () => { // mulberry32
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    const before = grid.querySelector(':scope > .text-only');
    cards.forEach(c => grid.insertBefore(c, before));
  }

  // Work section: show the first row of stories, the rest behind "Show more work"
  const moreBtn = document.querySelector('.more-work');
  const workGrid = moreBtn && document.getElementById(moreBtn.getAttribute('aria-controls'));
  if (workGrid) {
    const label = moreBtn.querySelector('.label');
    const set = (open) => {
      workGrid.classList.toggle('collapsed', !open);
      moreBtn.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Show less' : 'Show more work';
    };
    set(false);
    moreBtn.hidden = false;
    moreBtn.addEventListener('click', () => {
      const open = moreBtn.getAttribute('aria-expanded') !== 'true';
      set(open);
      if (!open) workGrid.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  // Hero word rotator: Icon → Brand → Product
  const rot = document.querySelector('.rot');
  if (rot) {
    const words = [...rot.querySelectorAll('.w')];
    let i = 0;
    const fit = () => { rot.style.width = words[i].offsetWidth + 'px'; };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener('resize', fit);
    const slow = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spin = setInterval(() => {
      const cur = words[i];
      cur.classList.remove('on'); cur.classList.add('out');
      i = (i + 1) % words.length;
      const nxt = words[i];
      nxt.classList.remove('out');
      void nxt.offsetWidth;
      nxt.classList.add('on');
      fit();
      setTimeout(() => cur.classList.remove('out'), 1250);
    }, slow ? 6000 : 4600);

    // After 10 seconds the headline glitches out and settles on "Reliable Human" for good
    const h1 = rot.closest('h1');
    const line2 = h1.querySelectorAll('.line')[1];
    // ...and the gradient behind it glitches into a random New York graffiti photo from Unsplash, credited bottom right
    const band = h1.closest('.hero-band');
    const shots = [
      ['2MLVM0P4_Qs', 'Rio Buziez'], ['IPV5X5ne1m8', 'Ankit Dembla'], ['NFvJwmGBo7Q', 'Diego Allen'],
      ['TikO1K5MmXE', 'Ruben Abreu'], ['Urt2tOrxSV8', 'Julie Ricard'], ['oO-3KuebmyI', 'Sebastian Enrique'],
      ['pShoRxLR_6Y', 'Julie Ricard'], ['zNC7mK3TD18', 'Paul Brake']
    ];
    const [shotId, shotBy] = shots[Math.floor(Math.random() * shots.length)];
    const shotSrc = 'assets/img/graffiti/' + shotId + '.webp';
    new Image().src = shotSrc;
    const graffiti = () => {
      if (!band) return;
      const bg = document.createElement('div');
      bg.className = 'graffiti' + (slow ? ' on' : ' glitch-in');
      bg.style.backgroundImage = 'url("' + shotSrc + '")';
      bg.setAttribute('aria-hidden', 'true');
      band.prepend(bg);
      band.classList.add('graffitied');
      setTimeout(() => { bg.classList.remove('glitch-in'); bg.classList.add('on'); }, 1400);
      const credit = document.createElement('p');
      credit.className = 'graffiti-credit';
      const utm = '?utm_source=raysandesigns&utm_medium=referral';
      credit.innerHTML = 'Photo by <a href="https://unsplash.com/photos/' + shotId + utm + '" target="_blank" rel="noopener">' + shotBy +
        '</a> on <a href="https://unsplash.com/' + utm + '" target="_blank" rel="noopener">Unsplash</a>';
      band.append(credit);
    };
    setTimeout(() => {
      clearInterval(spin);
      graffiti();
      h1.classList.add('glitching');
      words.forEach((w) => w.classList.remove('out'));
      const sr = h1.querySelector('.sr-only');
      if (sr) sr.textContent = 'Reliable human';
      const parts = [[words[i], words[i].textContent, 'Reliable'], [line2, line2.textContent, 'Human']];
      const done = () => {
        parts.forEach(([el, , to]) => { el.textContent = to; });
        fit();
        h1.classList.remove('glitching');
      };
      if (slow) { done(); return; }
      const junk = '!<>-_\\/[]{}=+*^?#%&01';
      const dur = 1400;
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min((performance.now() - t0) / dur, 1);
        if (p === 1) { done(); return; }
        parts.forEach(([el, from, to]) => {
          const len = Math.round(from.length + (to.length - from.length) * p);
          let s = '';
          for (let k = 0; k < len; k++) {
            // Each letter locks in once the sweep passes it; the rest flicker as junk or the old word
            const lock = 0.35 + 0.6 * (k / Math.max(to.length, 1));
            if (p > lock && k < to.length) s += to[k];
            else if (Math.random() < 0.25 && k < from.length && p < 0.5) s += from[k];
            else s += junk[Math.floor(Math.random() * junk.length)];
          }
          el.textContent = s;
        });
        fit();
        setTimeout(tick, 55);
      };
      tick();
    }, 10000);
  }
})();

// Light / dark switch in the footer. Light is the default; the choice is remembered on this device.
(() => {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = (t) => {
    if (t === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#121417' : '#ffffff');
    document.querySelectorAll('.theme-toggle').forEach((b) => {
      const dark = t === 'dark';
      b.setAttribute('aria-pressed', String(dark));
      b.querySelector('.ms').textContent = dark ? 'light_mode' : 'dark_mode';
      const t2 = dark ? 'Switch to light mode' : 'Switch to dark mode';
      b.setAttribute('aria-label', t2); b.title = t2;
      const lbl = b.querySelector('.tt-label'); if (lbl) lbl.remove();
    });
  };
  const current = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  apply(current());
  document.querySelectorAll('.theme-toggle').forEach((b) => b.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-fading');
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    setTimeout(() => root.classList.remove('theme-fading'), 350);
  }));
})();

// Case study sidebar: highlight the contents link for the section in view.
(() => {
  const links = [...document.querySelectorAll('.cs-toc a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const visible = new Set();
  const mark = () => {
    const first = [...byId.keys()].find((id) => visible.has(id));
    links.forEach((a) => a.removeAttribute('aria-current'));
    if (first) byId.get(first).setAttribute('aria-current', 'true');
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
    mark();
  }, { rootMargin: '-96px 0px -55% 0px' });
  byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
})();

// Page slide: leaving a case study for home slides everything right; opening a case study from home slides it left.
// The head script on each page plays the incoming half; every other navigation stays instant.
(() => {
  // Cloudflare serves pretty URLs, so home can be "/", "/index" or "/index.html"
  const isHome = (url) => /(^|\/)(index(\.html)?)?$/.test(new URL(url, location.href).pathname);
  const onHome = isHome(location.href);
  const fromCaseStudy = !!document.querySelector('.cs-side .back');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dirTo = (url) => {
    if (reduce || !url) return null;
    const u = new URL(url, location.href);
    if (u.origin !== location.origin) return null;
    if (fromCaseStudy && isHome(u.href)) return 'back';
    if (onHome && !isHome(u.href) && /(\.html|\/[\w-]+)$/.test(u.pathname)) return 'forward';
    return null;
  };
  const remember = (dir) => { try { sessionStorage.setItem('slide-dir', dir); } catch (err) {} };
  if ('onpageswap' in window) {
    window.addEventListener('pageswap', (e) => {
      if (!e.viewTransition) return;
      const dir = dirTo(e.activation && e.activation.entry && e.activation.entry.url);
      if (dir) { e.viewTransition.types.add(dir); remember(dir); } else e.viewTransition.skipTransition();
    });
    return;
  }
  // No cross-document view transitions: slide out, then navigate.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.target || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    const dir = dirTo(a.href);
    if (!dir) return;
    e.preventDefault();
    remember(dir);
    document.documentElement.classList.add('slide-' + dir, 'out');
    setTimeout(() => { location.href = a.href; }, 300);
  });
  // Coming back from the bfcache: clear the slid-out state.
  window.addEventListener('pageshow', (e) => { if (e.persisted) document.documentElement.classList.remove('slide-back', 'slide-forward', 'out'); });
})();
