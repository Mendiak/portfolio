document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    hero.classList.add('fade-in');

    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const hamSvg = hamburgerBtn.querySelector('.ham');
    const mobileMenu = document.querySelector('.mobile-menu');

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        hamSvg.classList.toggle('active');
    }

    // Click on hamburger button toggles menu
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking a mobile menu link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            hamSvg.classList.remove('active');
        });
    });

    // Smooth scroll for all nav links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.getElementById(this.getAttribute('href').substring(1));
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    // Cierra el menú si haces scroll o tocas fuera del menú
    window.addEventListener('scroll', () => {
        mobileMenu.classList.remove('active');
        hamSvg.classList.remove('active');
    });
    document.addEventListener('click', (e) => {
        if (
            mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !hamburgerBtn.contains(e.target)
        ) {
            mobileMenu.classList.remove('active');
            hamSvg.classList.remove('active');
        }
    });
});
