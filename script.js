document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    hero.classList.add('fade-in');

    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu'); 

    // Toggle menu
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = mobileMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active', isActive);
        hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        mobileMenu.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (
            mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !hamburgerBtn.contains(e.target)
        ) {
            mobileMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    });

    // Optional: Close menu on scroll
    window.addEventListener('scroll', function() {
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    });

    // Smooth scroll for all internal links (desktop & mobile)
    document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"], .hero a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const section = document.getElementById(this.getAttribute('href').substring(1));
            if (section) {
                e.preventDefault();
                const navHeight = 55; 
                const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: sectionTop, behavior: 'smooth' });
            }
        });
    });

    // Copyright year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

    const observerOptions = {
        root: null, // Observes intersections relative to the viewport
        rootMargin: '-55px 0px -50% 0px', // Adjusts the intersection box. -55px top for the nav bar, -50% bottom to switch earlier.
        threshold: 0 // Trigger as soon as a pixel is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingLinks = document.querySelectorAll(`a[href="#${id}"]`);

            if (entry.isIntersecting) {
                // Remove 'active' from all navigation links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add 'active' to the links corresponding to the visible section
                correspondingLinks.forEach(link => link.classList.add('active'));
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
});