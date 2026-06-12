// AniWave — интерактив аниме-лендинга (ванильный JS, без зависимостей)
// Задача 10: навигация/бургер, scroll-reveal, фолбэк изображений, год в копирайте.
// Все функции защищены проверками на наличие элементов, чтобы не падать
// при изменении разметки.

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1) Навигация: бургер-меню, закрытие по ссылке, .scrolled (R2.5, R2.4)
     ---------------------------------------------------------- */
  function initNav() {
    var navbar = document.querySelector('.navbar');
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    // Бургер: переключение .open у меню + aria-expanded/aria-label у кнопки
    function closeMenu() {
      if (!links || !toggle) return;
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
    }

    function openMenu() {
      if (!links || !toggle) return;
      links.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
    }

    if (toggle && links) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = links.classList.contains('open');
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Закрытие меню по клику на любую ссылку внутри .nav-links
      links.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          closeMenu();
        });
      });

      // Опционально: закрытие по Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links.classList.contains('open')) {
          closeMenu();
          toggle.focus();
        }
      });

      // Опционально: закрытие по клику вне меню
      document.addEventListener('click', function (e) {
        if (!links.classList.contains('open')) return;
        if (links.contains(e.target) || toggle.contains(e.target)) return;
        closeMenu();
      });
    }

    // Класс .scrolled навбару при прокрутке > 40px (R2.4)
    if (navbar) {
      var updateScrolled = function () {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      updateScrolled(); // учесть исходную позицию (перезагрузка с прокруткой)
      window.addEventListener('scroll', updateScrolled, { passive: true });
    }
  }

  /* ----------------------------------------------------------
     2) Scroll-reveal: появление секций/карточек при входе в Viewport (R9.6)
     ---------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    // Фолбэк: нет IntersectionObserver → сразу показать всё
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target); // одноразово
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     3) Фолбэк изображений: при ошибке загрузки постера → .img-failed (R11.3)
     ---------------------------------------------------------- */
  function initImageFallback() {
    var images = document.querySelectorAll('img.card-img');
    if (!images.length) return;

    images.forEach(function (img) {
      var markFailed = function () {
        var media = img.closest('.card-media');
        if (media) media.classList.add('img-failed');
      };

      // Обработчик на будущие ошибки загрузки
      img.addEventListener('error', markFailed);

      // Если изображение уже завершило загрузку с ошибкой к моменту
      // выполнения скрипта — error мог не сработать. Проверяем явно.
      if (img.complete && img.naturalWidth === 0) {
        markFailed();
      }
    });
  }

  /* ----------------------------------------------------------
     4) Год в копирайте (R8.3)
     ---------------------------------------------------------- */
  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     Инициализация после готовности DOM.
     Скрипт подключён с defer, но подстраховываемся проверкой readyState.
     ---------------------------------------------------------- */
  function init() {
    initNav();
    initScrollReveal();
    initImageFallback();
    setYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
