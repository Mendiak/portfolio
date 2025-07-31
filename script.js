document.addEventListener('DOMContentLoaded', function() {
    // --- Cache DOM elements for performance and clarity ---
    const hero = document.querySelector('.hero');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const yearSpan = document.getElementById('copyright-year');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

    // --- Hero Fade-in Effect ---
    hero.classList.add('fade-in');

    // --- Sophisticated Menu Handling ---
    // Centralized function to toggle the menu state.
    // It can be called to toggle, or with `true` to force it closed.
    const toggleMenu = (forceClose = false) => {
        const isActive = mobileMenu.classList.contains('active');
        const shouldBeActive = forceClose ? false : !isActive;

        mobileMenu.classList.toggle('active', shouldBeActive);
        hamburgerBtn.classList.toggle('active', shouldBeActive);
        hamburgerBtn.setAttribute('aria-expanded', shouldBeActive);
        mobileMenu.setAttribute('aria-hidden', !shouldBeActive);
    };

    // 1. Toggle menu on button click
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the document click listener from firing immediately
        toggleMenu();
    });

    // 2. Close menu when a link inside it is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // 3. Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            toggleMenu(true);
        }
    });

    // 4. Close menu on scroll for a better user experience
    window.addEventListener('scroll', () => {
        if (mobileMenu.classList.contains('active')) {
            toggleMenu(true);
        }
    });

    // --- Smooth Scroll with Offset ---
    // A more generic selector catches all anchor links on the page.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) { // Ensure it's not just "#"
                const section = document.getElementById(href.substring(1));
                if (section) {
                    e.preventDefault();
                    const navHeight = 55; 
                    const sectionTop = section.getBoundingClientRect().top + window.scrollY - navHeight;
                    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Dynamic Copyright Year ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Active nav link on scroll ---
    // Your IntersectionObserver implementation is already excellent!
    const observerOptions = {
        root: null, // Observes intersections relative to the viewport
        rootMargin: '-55px 0px -50% 0px', // Adjusts the intersection box. -55px top for the nav bar, -50% bottom to switch earlier.
        threshold: 0 // Trigger as soon as a pixel is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove 'active' from all navigation links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add 'active' to the links corresponding to the visible section
                document.querySelectorAll(`a[href="#${id}"]`).forEach(link => link.classList.add('active'));
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
});