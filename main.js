document.addEventListener('DOMContentLoaded', () => {

  /* Page Loader */
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';
    }, 1800);
    document.body.style.overflow = 'hidden';
  }

  /* Custom Cursor */
  (function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring || window.innerWidth < 992) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('mousemove', event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, [data-hover]').forEach(element => {
      element.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      element.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    window.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    window.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  })();

  /* Navbar */
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

    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === path) link.classList.add('active');
    });

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }
  })();

  /* Back to Top */
  const backToTop = document.getElementById('back-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Scroll Reveal */
  (function initReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(element => observer.observe(element));
  })();

  /* Counter Animation */
  (function initCounters() {
    const elements = document.querySelectorAll('[data-count]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.round(ease * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        observer.unobserve(element);
      });
    }, { threshold: 0.5 });

    elements.forEach(element => observer.observe(element));
  })();

  /* Parallax Hero */
  (function initParallax() {
    const background = document.querySelector('.hero-bg');
    if (!background) return;

    background.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        background.style.transform = `scale(1) translateY(${scroll * 0.35}px)`;
      }
    }, { passive: true });
  })();

  /* Testimonials Swiper */
  (function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.swiper-testimonials', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  })();

  /* Portfolio Filter */
  (function initFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    if (!buttons.length) return;

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        const category = button.dataset.filter;

        items.forEach(item => {
          const show = category === 'all' || item.dataset.cat === category;
          item.style.opacity = show ? '1' : '0';
          item.style.transform = show ? 'scale(1)' : 'scale(.9)';
          item.style.transition = 'opacity .4s, transform .4s';
          item.style.pointerEvents = show ? 'auto' : 'none';
          item.style.position = show ? '' : 'absolute';
          item.style.display = show ? '' : 'none';
          setTimeout(() => {
            if (show) {
              item.style.position = '';
              item.style.display = '';
            }
          }, 10);
        });

        items.forEach(item => {
          const show = category === 'all' || item.dataset.cat === category;
          item.style.display = show ? '' : 'none';
          item.style.opacity = show ? '1' : '0';
          item.style.transform = show ? 'scale(1)' : 'scale(.9)';
        });
      });
    });
  })();

  /* Lightbox */
  (function initLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    const image = document.querySelector('.lightbox-img');
    const caption = document.querySelector('.lightbox-caption');
    const close = document.querySelector('.lightbox-close');
    if (!overlay || !image) return;

    document.querySelectorAll('.portfolio-item[data-src]').forEach(item => {
      item.addEventListener('click', () => {
        image.src = item.dataset.src;
        if (caption) caption.textContent = item.dataset.title || '';
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (close) close.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeLightbox();
    });
  })();

  /* Contact Form */
  (function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const whatsappCta = document.getElementById('contact-whatsapp-cta');
    const success = document.querySelector('.form-success');
    const error = document.querySelector('.form-error');
    const submitUrl = 'https://script.google.com/macros/s/AKfycby1HbCPY6sRchzwMKyW4R9vqhpSd90AUaIvNMb7F3od11DnbePNZYPhkMFwLYIUaJKB/exec';

    if (whatsappCta) {
      whatsappCta.href = 'https://wa.me/918107997777?text=Hi%2C%20I%20need%20interior%20design%20consultation.';
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();

      const button = form.querySelector('[type=submit]');
      const original = button.innerHTML;

      if (success) success.classList.remove('show');
      if (error) error.classList.remove('show');

      button.innerHTML = '<span>Sending...</span>';
      button.disabled = true;

      const payload = {
        name: form.querySelector('#contact-name')?.value.trim() || '',
        email: form.querySelector('#contact-email')?.value.trim() || '',
        phone: form.querySelector('#contact-phone')?.value.trim() || '',
        service: form.querySelector('#contact-service')?.value || '',
        city: form.querySelector('#contact-city')?.value.trim() || '',
        budget: form.querySelector('#contact-budget')?.value || '',
        message: form.querySelector('#contact-message')?.value.trim() || ''
      };

      try {
        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Submission failed');
        }

        button.innerHTML = '<span>✓ Message Sent!</span>';
        form.reset();
        if (success) success.classList.add('show');

        setTimeout(() => {
          button.innerHTML = original;
          button.disabled = false;
          if (success) success.classList.remove('show');
        }, 5000);
      } catch (submitError) {
        button.innerHTML = original;
        button.disabled = false;
        if (error) error.classList.add('show');
      }
    });
  })();

  /* FAQ Accordion */
  (function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const isOpen = button.classList.contains('open');

        document.querySelectorAll('.faq-question').forEach(item => {
          item.classList.remove('open');
          item.nextElementSibling.classList.remove('open');
        });

        if (!isOpen) {
          button.classList.add('open');
          answer.classList.add('open');
        }
      });
    });
  })();

  /* Card Tilt */
  (function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();

});
