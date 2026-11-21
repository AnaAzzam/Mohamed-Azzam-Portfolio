/* ================================================================
   MOHAMMED JAMAL AZZAM — PORTFOLIO SCRIPT
   Defensive by design. Each feature initializes independently.
   ================================================================ */

(function () {
  'use strict';

  /* -------- 1 · MOBILE NAV -------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    var close = function () {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        close();
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation menu');
        nav.classList.add('is-open');
        document.body.classList.add('nav-open');
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    /* Reset when crossing breakpoint */
    var mq = window.matchMedia('(min-width: 881px)');
    var onChange = function (e) { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* -------- 2 · REVEAL ON SCROLL -------- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) {
      window.__revealOK = true;
      return;
    }

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      window.__revealOK = true;
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (el) { io.observe(el); });
    window.__revealOK = true;
  }

  /* -------- 3 · ACTIVE NAV LINK -------- */
  function initActiveNav() {
    var sections = document.querySelectorAll('main section[id]');
    var links = document.querySelectorAll('.nav__list a[href^="#"]');
    if (!sections.length || !links.length) return;
    if (!('IntersectionObserver' in window)) return;

    var setActive = function (id) {
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* -------- 4 · CERTIFICATE LIGHTBOX -------- */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var triggers = document.querySelectorAll('[data-lightbox]');
    if (!triggers.length) return;

    var img = lightbox.querySelector('.lightbox__img');
    var titleEl = lightbox.querySelector('.lightbox__title');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    if (!img || !closeBtn) return;

    var lastFocused = null;
    var supportsDialog = typeof lightbox.showModal === 'function';

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var src = trigger.getAttribute('data-lightbox');
        var title = trigger.getAttribute('data-title') || 'Certificate';
        if (!src) return;

        lastFocused = trigger;
        img.src = src;
        img.alt = title;
        if (titleEl) titleEl.textContent = title;

        if (supportsDialog) {
          lightbox.showModal();
          document.body.classList.add('nav-open'); /* prevent scroll */
          closeBtn.focus();
        } else {
          /* Fallback: open image in new tab */
          window.open(src, '_blank', 'noopener');
        }
      });
    });

    closeBtn.addEventListener('click', function () {
      if (supportsDialog) lightbox.close();
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox && supportsDialog) lightbox.close();
    });

    lightbox.addEventListener('close', function () {
      document.body.classList.remove('nav-open');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    });
  }

  /* -------- 5 · COPY TO CLIPBOARD -------- */
  function initCopy() {
    var buttons = document.querySelectorAll('[data-copy]');
    if (!buttons.length) return;

    var flash = function (btn, message) {
      var original = btn.textContent;
      btn.textContent = message;
      setTimeout(function () { btn.textContent = original; }, 1600);
    };

    var fallbackCopy = function (text, btn) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        flash(btn, 'Copied ✓');
      } catch (err) {
        flash(btn, 'Press Ctrl+C');
      }
      document.body.removeChild(ta);
    };

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var text = btn.getAttribute('data-copy');
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () { flash(btn, 'Copied ✓'); },
            function () { fallbackCopy(text, btn); }
          );
        } else {
          fallbackCopy(text, btn);
        }
      });
    });
  }

  /* -------- 6 · FOOTER YEAR -------- */
  function initYear() {
    var el = document.getElementById('year');
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  /* -------- BOOTSTRAP -------- */
  function boot() {
    try { initNav(); }       catch (e) { console.warn('[nav]', e); }
    try { initReveal(); }    catch (e) { console.warn('[reveal]', e); }
    try { initActiveNav(); } catch (e) { console.warn('[activeNav]', e); }
    try { initLightbox(); }  catch (e) { console.warn('[lightbox]', e); }
    try { initCopy(); }      catch (e) { console.warn('[copy]', e); }
    try { initYear(); }      catch (e) { console.warn('[year]', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();