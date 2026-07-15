document.addEventListener('DOMContentLoaded', function() {
    // --- Cache DOM elements for performance and clarity ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const yearSpan = document.getElementById('copyright-year');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

    // --- GSAP Scroll-Triggered Animations ---
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

    // Cross Field Animation
    const crossGrid = document.getElementById('cross-grid');
    const crossWidth = 30;
    const gap = 10;
    const numRows = 5;
    let numCols = 0;

    function createGrid() {
        if(!crossGrid) return;
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

    if(crossGrid) {
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

    // --- Card image click handling ---
    document.querySelectorAll('.card').forEach(card => {
        const link = card.querySelector('.card-link');
        if (!link) return;
        const wrapper = card.querySelector('.image-wrapper');
        if (wrapper) {
            wrapper.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(link.href, link.target || '_self');
            });
        }
    });

    // --- Menu Handling ---
    const toggleMenu = (forceClose = false) => {
        if(!mobileMenu) return;
        const isActive = mobileMenu.classList.contains('active');
        const shouldBeActive = forceClose ? false : !isActive;
        mobileMenu.classList.toggle('active', shouldBeActive);
        hamburgerBtn.classList.toggle('active', shouldBeActive);
        hamburgerBtn.setAttribute('aria-expanded', shouldBeActive);
        mobileMenu.setAttribute('aria-hidden', !shouldBeActive);

        if (shouldBeActive) {
            hamburgerBtn.classList.add('spinning');
            setTimeout(() => hamburgerBtn.classList.remove('spinning'), 1000);
        }
    };

    if(hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleMenu());

    // Close menu when clicking on links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(true);
        });
    });

    // Close menu when clicking outside (on the menu background)
    if(mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu(true);
            }
        });
    }
    
    // --- AJAX Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: new FormData(contactForm)
                });
                if (response.ok) {
                    contactForm.innerHTML = '<div class="form-success-message" style="display:block"><i class="bi bi-check-circle-fill"></i><h3>Message Sent!</h3><p>Mikel will get back to you soon.</p></div>';
                }
            } catch (error) {
                submitBtn.textContent = 'Try Again';
                submitBtn.disabled = false;
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