/**
 * ============================================================================
 * AL-HASSAN MOHAMMED — PORTFOLIO JAVASCRIPT
 * Junior Data Engineer | SQL & Data Pipelines
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DOM Elements Selection
  // --------------------------------------------------------------------------
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const siteHeader = document.getElementById('siteHeader');
  const menuToggleBtn = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');

  // Contact Modal Elements
  const contactModalOverlay = document.getElementById('contactModalOverlay');
  const contactModal = document.getElementById('contactModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const contactTriggers = document.querySelectorAll('.contact-trigger');

  // --------------------------------------------------------------------------
  // 2. Dark / Light Theme Management
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'ahm_portfolio_theme';

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
    } else {
      // Default to dark mode
      applyTheme('dark');
    }
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update meta theme-color tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0d1310' : '#f4f6f3');
    }
  };

  const toggleTheme = () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  initializeTheme();

  // --------------------------------------------------------------------------
  // 3. Contact Me Popover / Modal Controller
  // --------------------------------------------------------------------------
  let lastActiveElement = null;

  const openContactModal = () => {
    if (!contactModalOverlay) return;
    lastActiveElement = document.activeElement;
    contactModalOverlay.classList.add('active');
    contactModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => {
      if (modalCloseBtn) modalCloseBtn.focus();
    }, 50);
  };

  const closeContactModal = () => {
    if (!contactModalOverlay) return;
    contactModalOverlay.classList.remove('active');
    contactModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore focus
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  // Attach open listeners to all contact trigger buttons
  contactTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile menu if open
      closeMobileMenu();
      openContactModal();
    });
  });

  // Close modal button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeContactModal);
  }

  // Close when clicking backdrop (outside modal container)
  if (contactModalOverlay) {
    contactModalOverlay.addEventListener('click', (e) => {
      if (e.target === contactModalOverlay) {
        closeContactModal();
      }
    });
  }

  // Keyboard accessibility: ESC key to close modal or mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModalOverlay && contactModalOverlay.classList.contains('active')) {
        closeContactModal();
      }
      if (navMenu && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 4. Mobile Hamburger Navigation
  // --------------------------------------------------------------------------
  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !menuToggleBtn.contains(event.target) &&
        !event.target.closest('.contact-trigger')
      ) {
        closeMobileMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Sticky Header Elevation on Scroll
  // --------------------------------------------------------------------------
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --------------------------------------------------------------------------
  // 6. Scroll Spy & Active Navigation Highlighting
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --------------------------------------------------------------------------
  // 8. Smooth Scroll for Anchor Links with Header Offset
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
