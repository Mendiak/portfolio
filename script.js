document.addEventListener('DOMContentLoaded', function() {
    const welcomeOverlay = document.getElementById('welcome-overlay');

    setTimeout(() => {
        welcomeOverlay.style.opacity = '0';
        // Remove the overlay from the DOM after the transition is complete
        welcomeOverlay.addEventListener('transitionend', () => {
            welcomeOverlay.remove();
        });
    }, 3000); 

    // --- Cache DOM elements for performance and clarity ---
    const hero = document.querySelector('.hero');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const yearSpan = document.getElementById('copyright-year');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

        // --- GSAP Hero Animation ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero h1', { opacity: 0, y: 20, duration: 1 })
      .from('.hero h2', { opacity: 0, y: 20, duration: 1 }, '-=0.7');

    // --- GSAP Scroll-Triggered Animations ---
    gsap.registerPlugin(ScrollTrigger);


    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%', // Animation starts when the top of the section is 80% down the viewport
                toggleActions: 'play none none none', // Plays the animation once
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
        });
    });

    // --- Cross Field Animation ---
    const crossGrid = document.getElementById('cross-grid');
    const crossWidth = 30; // width of a cross in pixels
    const gap = 10; // gap between crosses in pixels

    const numRows = 5;
    let numCols = 0;

    function createGrid() {
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
    window.addEventListener('resize', createGrid);

    crossGrid.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('cross')) {
            const target = e.target;
            target.classList.add('active');
            setTimeout(() => {
                target.classList.remove('active');
                target.querySelectorAll('.cross-bar').forEach(bar => {
                    bar.style.backgroundColor = 'var(--on-background)';
                });
            }, 1000);
        }
    });

    crossGrid.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling while dragging on the grid
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('cross')) {
            const target = element;
            if (!target.classList.contains('active')) {
                target.classList.add('active');
                setTimeout(() => {
                    target.classList.remove('active');
                    target.querySelectorAll('.cross-bar').forEach(bar => {
                        bar.style.backgroundColor = 'var(--on-background)';
                    });
                }, 1000);
            }
        }
    }, { passive: false });

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