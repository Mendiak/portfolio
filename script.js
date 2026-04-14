document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const sunIcon = themeToggle.querySelector('i');
    const sunIconMobile = themeToggleMobile.querySelector('i');

    const updateThemeIcons = (theme) => {
        const iconClass = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        sunIcon.className = iconClass;
        sunIconMobile.className = iconClass;
    };

    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const currentTheme = getPreferredTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    const toggleTheme = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    };

    themeToggle.addEventListener('click', toggleTheme);
    themeToggleMobile.addEventListener('click', toggleTheme);

    const welcomeOverlay = document.getElementById('welcome-overlay');
    const heroTitle = document.querySelector('.hero h1');

    // --- Prepare Hero Text (Word & Char Splitting) ---
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerHTML = text.split(' ').map(word => {
            return `<span class="word" style="display: inline-block; white-space: nowrap;">${
                word.split('').map(char => `<span class="char" style="display: inline-block;">${char}</span>`).join('')
            }</span>`;
        }).join(' ');

        // Spotlight interaction (Mouse move)
        window.addEventListener('mousemove', (e) => {
            const rect = heroTitle.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const dsX = (0.5 - (e.clientX - rect.left) / rect.width) * 24;
            const dsY = (0.5 - (e.clientY - rect.top) / rect.height) * 24;
            
            gsap.to(heroTitle, {
                '--mouse-x': `${x}%`,
                '--mouse-y': `${y}%`,
                '--ds-x': `${dsX}px`,
                '--ds-y': `${dsY}px`,
                duration: 0.8,
                overwrite: 'auto',
                ease: 'power2.out'
            });
        });

        // Ambient pulse
        gsap.to(heroTitle, {
            '--mouse-x': '60%',
            '--mouse-y': '60%',
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    setTimeout(() => {
        welcomeOverlay.style.opacity = '0';
        
        if (heroTitle) {
            gsap.from('.hero h1 .char', {
                opacity: 0,
                x: () => (Math.random() - 0.5) * 800,
                y: () => (Math.random() - 0.5) * 600,
                z: () => (Math.random() - 0.5) * 1000,
                rotationX: () => (Math.random() - 0.5) * 360,
                rotationY: () => (Math.random() - 0.5) * 360,
                rotationZ: () => (Math.random() - 0.5) * 360,
                duration: 2.5,
                stagger: {
                    each: 0.03,
                    from: "random"
                },
                ease: "expo.out",
                onComplete: () => {
                    gsap.set('.hero h1 .char', { clearProps: "transform,opacity" });
                }
            });
        }

        welcomeOverlay.addEventListener('transitionend', () => {
            welcomeOverlay.remove();
        });
    }, 3000); 

    // --- Cache DOM elements for performance and clarity ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const yearSpan = document.getElementById('copyright-year');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

    // --- GSAP Scroll-Triggered Animations ---
    gsap.registerPlugin(ScrollTrigger);
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        gsap.utils.toArray(".parallax-divider").forEach(divider => {
            gsap.to(divider, {
                backgroundPositionY: "-20%",
                ease: "none",
                scrollTrigger: {
                    trigger: divider,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            });
        });
    });

    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
        });
    });

    // --- Cross Field Animation ---
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

    // --- Menu Handling ---
    const toggleMenu = (forceClose = false) => {
        if(!mobileMenu) return;
        const isActive = mobileMenu.classList.contains('active');
        const shouldBeActive = forceClose ? false : !isActive;
        mobileMenu.classList.toggle('active', shouldBeActive);
        hamburgerBtn.classList.toggle('active', shouldBeActive);
    };

    if(hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleMenu());
    
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
                document.querySelectorAll('nav a, .mobile-menu a').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-55px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));

    // --- Spotlight/Lightbox ---
    const imageWrappers = document.querySelectorAll('.image-wrapper');
    const spotlightImages = [];
    imageWrappers.forEach((wrapper, index) => {
        const img = wrapper.querySelector('img[data-spotlight]');
        if (img) {
            spotlightImages.push({
                src: img.src,
                title: wrapper.closest('.card').querySelector('h4').textContent,
                description: wrapper.closest('.card').querySelector('p').textContent
            });
            wrapper.addEventListener('click', () => Spotlight.show(spotlightImages, { index: index + 1 }));
        }
    });
});