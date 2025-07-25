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
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});
