document.addEventListener('DOMContentLoaded', function () {
    // --- Helpers ---
    const t = (key, fallback) => {
        const value = window.i18n && window.i18n.t ? window.i18n.t(key) : null;
        return value || fallback;
    };

    // --- Cache DOM elements for performance and clarity ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const yearSpan = document.getElementById('copyright-year');
    const sections = document.querySelectorAll('section[id]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const themeToggleIconMobile = document.getElementById('theme-toggle-icon-mobile');

    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setThemeIcon(element, theme) {
        if (!element) return;
        const use = element.querySelector('use');
        if (use) use.setAttribute('href', theme === 'light' ? '#icon-moon' : '#icon-sun');
    }

    function setTheme(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#f8f8f8');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#0a0a0a');
        }
        setThemeIcon(themeToggleIcon, theme);
        setThemeIcon(themeToggleIconMobile, theme);
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        setTheme(current === 'light' ? 'dark' : 'light');
    }

    // Init theme (the inline head script already applied it before paint)
    setTheme(getPreferredTheme());

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // --- GSAP Scroll-Triggered Animations ---
    // Skip everything when GSAP fails to load or the user prefers reduced motion.
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero: fade in on load
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
        heroTl
            .from('.hero-name', { opacity: 0, y: 30 })
            .from('.hero-tagline', { opacity: 0, y: 20 }, '-=0.6');

        // Sections: per-section granular animations
        const animConfigs = [
            {
                id: 'about',
                children: [
                    { selector: 'h2', from: { opacity: 0, x: -30 } },
                    { selector: 'p', from: { opacity: 0, y: 15 }, stagger: 0.08 },
                    { selector: '.about-links a', from: { opacity: 0, y: 10 }, stagger: 0.08 },
                ]
            },
            {
                id: 'projects',
                children: [
                    { selector: 'h2', from: { opacity: 0, x: -30 } },
                    { selector: ':scope > p', from: { opacity: 0, y: 15 } },
                    { selector: '.card', from: { opacity: 0, y: 30 }, stagger: 0.15 },
                ]
            },
            {
                id: 'the-lab',
                children: [
                    { selector: 'h2', from: { opacity: 0, x: -30 } },
                    { selector: '.card', from: { opacity: 0, y: 30 }, stagger: 0.1 },
                ]
            },
            {
                id: 'ux-studies',
                children: [
                    { selector: 'h2', from: { opacity: 0, x: -30 } },
                    { selector: '.card', from: { opacity: 0, y: 30 }, stagger: 0.1 },
                ]
            },
            {
                id: 'contact',
                children: [
                    { selector: '.contact-text h2', from: { opacity: 0, x: -30 } },
                    { selector: '.contact-text p', from: { opacity: 0, y: 15 } },
                    { selector: '#contact-form input, #contact-form textarea, #contact-form button', from: { opacity: 0, y: 15 }, stagger: 0.08 },
                ]
            },
        ];

        animConfigs.forEach(({ id, children }) => {
            const section = document.getElementById(id);
            if (!section) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                defaults: { ease: 'power3.out', duration: 1.0 },
            });

            children.forEach(({ selector, from, stagger }) => {
                const targets = section.querySelectorAll(selector);
                if (targets.length) {
                    tl.from(targets, { ...from, stagger: stagger || 0 }, 0);
                }
            });
        });
    }

    // Cross Field Animation
    const crossGrid = document.getElementById('cross-grid');
    const crossWidth = 30;
    const gap = 10;
    const numRows = 5;
    let numCols = 0;

    function createGrid() {
        if (!crossGrid) return;
        crossGrid.innerHTML = '';
        const gridWidth = crossGrid.offsetWidth;
        numCols = Math.floor(gridWidth / (crossWidth + gap));
        crossGrid.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

        for (let i = 0; i < numRows * numCols; i++) {
            const cross = document.createElement('div');
            cross.classList.add('cross');
            const bar1 = document.createElement('span');
            bar1.classList.add('cross-bar');
            const bar2 = document.createElement('span');
            bar2.classList.add('cross-bar');
            cross.appendChild(bar1);
            cross.appendChild(bar2);
            crossGrid.appendChild(cross);
        }
    }

    createGrid();
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(createGrid, 250);
    });

    if (crossGrid) {
        crossGrid.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('cross')) {
                const target = e.target;
                target.classList.add('active');
                setTimeout(() => {
                    target.classList.remove('active');
                }, 1000);
            }
        });
    }

    // --- Menu Handling ---
    function setMenuLabel(isOpen) {
        if (!hamburgerBtn) return;
        hamburgerBtn.setAttribute(
            'aria-label',
            isOpen ? t('aria.close_menu', 'Close menu') : t('aria.open_menu', 'Open menu')
        );
    }

    const toggleMenu = (forceClose = false) => {
        if (!mobileMenu || !hamburgerBtn) return;
        const isActive = mobileMenu.classList.contains('active');
        const shouldBeActive = forceClose ? false : !isActive;

        mobileMenu.classList.toggle('active', shouldBeActive);
        hamburgerBtn.classList.toggle('active', shouldBeActive);
        hamburgerBtn.setAttribute('aria-expanded', String(shouldBeActive));
        mobileMenu.setAttribute('aria-hidden', String(!shouldBeActive));
        // `inert` keeps the off-canvas links out of the tab order.
        mobileMenu.inert = !shouldBeActive;
        document.body.classList.toggle('menu-open', shouldBeActive);
        setMenuLabel(shouldBeActive);

        if (shouldBeActive) {
            hamburgerBtn.classList.add('spinning');
            setTimeout(() => hamburgerBtn.classList.remove('spinning'), 1000);
            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        } else if (mobileMenu.contains(document.activeElement)) {
            hamburgerBtn.focus();
        }
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleMenu());

    // Close menu when clicking on links
    document.querySelectorAll('.mobile-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(true);
        });
    });

    // Close menu when clicking outside (on the menu background)
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu(true);
            }
        });
    }

    // Close with Escape and restore focus to the toggle button
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu(true);
        }
    });

    // Close the mobile menu if the viewport grows past the breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu(true);
        }
    });

    // Keep the toggle label in sync when the language changes
    window.addEventListener('languageChanged', () => {
        if (mobileMenu) setMenuLabel(mobileMenu.classList.contains('active'));
    });

    // --- AJAX Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const status = document.getElementById('form-status');
            const idleLabel = submitBtn.textContent;

            submitBtn.textContent = t('contact.sending', 'Sending...');
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            if (status) status.textContent = '';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: new FormData(contactForm)
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const success = document.createElement('div');
                success.className = 'form-success-message';
                success.setAttribute('role', 'status');
                success.setAttribute('tabindex', '-1');
                success.innerHTML =
                    '<svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-check"></use></svg>' +
                    `<h3>${t('contact.success_title', 'Message sent!')}</h3>` +
                    `<p>${t('contact.success_body', 'Mikel will get back to you soon.')}</p>`;
                success.style.display = 'block';
                contactForm.innerHTML = '';
                contactForm.appendChild(success);
                success.focus();
            } catch (error) {
                submitBtn.textContent = idleLabel;
                submitBtn.disabled = false;
                submitBtn.removeAttribute('aria-busy');
                if (status) status.textContent = t('contact.error', 'The message could not be sent. Please try again.');
            }
        });
    }

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- Active Nav ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const navLinks = document.querySelectorAll('nav a, .mobile-menu a');
                const matchingLink = Array.from(navLinks).find(link => link.getAttribute('href') === `#${id}`);
                if (matchingLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    matchingLink.classList.add('active');
                }
            }
        });
    }, { rootMargin: '-55px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
});
