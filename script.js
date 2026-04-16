/**
 * script.js — Основной скрипт сайта
 * Версия: 2.1 | Готов к production
 */
(function() {
    'use strict';

    const CONFIG = {
        scrollOffset: 80,
        scrollTopThreshold: 300,
        animationThreshold: 100
    };

    const DOM = {
        burgerBtn: null,
        nav: null,
        shareBtn: null,
        shareDropdown: null,
        copyLinkBtn: null,
        scrollTopBtn: null,
        header: null,
        faqItems: null,
        fadeElements: null
    };

    function init() {
        cacheDOM();
        bindEvents();
        initScrollAnimations();
    }

    function cacheDOM() {
        DOM.burgerBtn = document.getElementById('burger-btn');
        DOM.nav = document.getElementById('nav');
        DOM.shareBtn = document.getElementById('share-btn');
        DOM.shareDropdown = document.getElementById('share-dropdown');
        DOM.copyLinkBtn = document.getElementById('copy-link');
        DOM.scrollTopBtn = document.getElementById('scrollTopBtn');
        DOM.header = document.querySelector('.header');
        DOM.faqItems = document.querySelectorAll('.faq-item');
        DOM.fadeElements = document.querySelectorAll('.service-card, .advantage-item, .gallery-item, .process-step, .testimonial-card, .faq-item');
    }

    function bindEvents() {
        if (DOM.burgerBtn && DOM.nav) {
            DOM.burgerBtn.addEventListener('click', toggleMobileMenu);
            DOM.nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
        }

        if (DOM.shareBtn && DOM.shareDropdown) {
            DOM.shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                DOM.shareDropdown.classList.toggle('active');
            });
        }

        if (DOM.copyLinkBtn) DOM.copyLinkBtn.addEventListener('click', handleCopyLink);

        if (DOM.scrollTopBtn) {
            DOM.scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        document.addEventListener('click', (e) => {
            if (DOM.shareDropdown && !DOM.shareDropdown.contains(e.target) && DOM.shareBtn && !DOM.shareBtn.contains(e.target)) {
                DOM.shareDropdown.classList.remove('active');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) closeMobileMenu();
        }, { passive: true });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop - CONFIG.scrollOffset, behavior: 'smooth' });
                    history.pushState(null, null, href);
                }
            });
        });

        DOM.faqItems.forEach(item => {
            item.querySelector('summary')?.addEventListener('click', () => {
                DOM.faqItems.forEach(other => { if (other !== item && other.open) other.open = false; });
            });
        });
    }

    function toggleMobileMenu() {
        const isActive = DOM.nav.classList.toggle('active');
        DOM.burgerBtn.classList.toggle('active', isActive);
        DOM.burgerBtn.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMobileMenu() {
        DOM.nav?.classList.remove('active');
        DOM.burgerBtn?.classList.remove('active');
        DOM.burgerBtn?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    async function handleCopyLink(e) {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText(window.location.href);
            showCopySuccess();
        } catch {
            const temp = document.createElement('input');
            temp.value = window.location.href;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showCopySuccess();
        }
    }

    function showCopySuccess() {
        const btn = DOM.copyLinkBtn;
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
        btn.style.color = '#25D366';
        setTimeout(() => { btn.innerHTML = original; btn.style.color = ''; }, 2000);
    }

    function handleScroll() {
        if (DOM.scrollTopBtn) DOM.scrollTopBtn.classList.toggle('visible', window.scrollY > CONFIG.scrollTopThreshold);
        if (DOM.header) DOM.header.classList.toggle('scrolled', window.scrollY > 50);
        checkFadeElements();
    }

    // Scroll animations - fade in elements on scroll
    function initScrollAnimations() {
        // Add fade-in class to elements
        DOM.fadeElements.forEach(el => {
            el.classList.add('fade-in');
        });
        // Check on initial load
        checkFadeElements();
    }

    function checkFadeElements() {
        const triggerBottom = window.innerHeight * 0.85;
        
        DOM.fadeElements.forEach(el => {
            const box = el.getBoundingClientRect();
            if (box.top < triggerBottom) {
                el.classList.add('visible');
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();