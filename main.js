

document.addEventListener('DOMContentLoaded', () => {

  /* ── Page Loader ── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';
    }, 1800);
    document.body.style.overflow = 'hidden';
  }

  /* ── Custom Cursor ── */
  (function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring || window.innerWidth < 992) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left  = mouseX + 'px';
      dot.style.top   = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * .12;
      ringY += (mouseY - ringY) * .12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    window.addEventListener('mouseleave', () => {
      dot.style.opacity = ring.style.opacity = '0';
    });
    window.addEventListener('mouseenter', () => {
      dot.style.opacity = ring.style.opacity = '1';
    });
  })();

  /* ── Navbar ── */
  (function initNavbar() {
    const nav = document.querySelector('.navbar-luxe');
    if (!nav) return;

    const isLightPage = nav.dataset.light === 'true';

    function updateNav() {
      if (isLightPage) {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        if (window.scrollY <= 60) nav.classList.add('light-bg');
        else nav.classList.remove('light-bg');
      } else {
        nav.classList.toggle('scrolled', window.scrollY > 80);
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // Active link
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }
  })();

  /* ── Back to Top ── */
  const btt = document.getElementById('back-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 500), { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll Reveal ── */
  (function initReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  })();

  /* ── Counter Animation ── */
  (function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: .5 });
    els.forEach(el => obs.observe(el));
  })();

  /* ── Parallax Hero ── */
  (function initParallax() {
    const bg = document.querySelector('.hero-bg');
    if (!bg) return;
    bg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        bg.style.transform = `scale(1) translateY(${scroll * .35}px)`;
      }
    }, { passive: true });
  })();

  /* ── Testimonials Swiper ── */
  (function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.swiper-testimonials', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768:  { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  })();

  /* ── Portfolio Filter ── */
  (function initFilter() {
    const btns  = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        items.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.style.opacity    = show ? '1' : '0';
          item.style.transform  = show ? 'scale(1)' : 'scale(.9)';
          item.style.transition = 'opacity .4s, transform .4s';
          item.style.pointerEvents = show ? 'auto' : 'none';
          item.style.position   = show ? '' : 'absolute';
          item.style.display    = show ? '' : 'none';
          setTimeout(() => { if (show) { item.style.position = ''; item.style.display = ''; } }, 10);
        });
        // re-trigger to show
        items.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.style.display = show ? '' : 'none';
          item.style.opacity = show ? '1' : '0';
          item.style.transform = show ? 'scale(1)' : 'scale(.9)';
        });
      });
    });
  })();

  /* ── Lightbox ── */
  (function initLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    const img     = document.querySelector('.lightbox-img');
    const cap     = document.querySelector('.lightbox-caption');
    const close   = document.querySelector('.lightbox-close');
    if (!overlay || !img) return;

    document.querySelectorAll('.portfolio-item[data-src]').forEach(item => {
      item.addEventListener('click', () => {
        img.src = item.dataset.src;
        if (cap) cap.textContent = item.dataset.title || '';
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLB() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
    if (close) close.addEventListener('click', closeLB);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLB(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
  })();

  (function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Sending…</span>';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1600));
      btn.innerHTML = '<span>✓ Message Sent!</span>';
      form.reset();
      const success = document.querySelector('.form-success');
      if (success) success.classList.add('show');
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; if (success) success.classList.remove('show'); }, 5000);
    });
  })();

  /* ── FAQ Accordion ── */
  (function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = btn.classList.contains('open');
        document.querySelectorAll('.faq-question').forEach(b => {
          b.classList.remove('open');
          b.nextElementSibling.classList.remove('open');
        });
        if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
      });
    });
  })();

  /* ── Card Tilt ── */
  (function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  })();

});
