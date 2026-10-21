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
    setInterval(() => {
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
