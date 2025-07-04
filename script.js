document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    hero.classList.add('fade-in');

    // Añade el listener para el clic en el botón de hamburguesa
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }

    // Añade listeners a todos los enlaces de navegación para el scroll suave y cerrar el menú
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('href').substring(1));
        });
    });

    // Actualiza dinámicamente el año del copyright
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});

function scrollToSection(sectionId) {
  let section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    // Close the mobile menu
    let menu = document.querySelector('.mobile-menu');
    menu.classList.remove('active');
    // Also reset the hamburger button if necessary
    let hamburger = document.getElementById("hamburger-btn");
    hamburger.classList.remove('active');
  }
}


function toggleMobileMenu() {
  let menu = document.querySelector('.mobile-menu');
  menu.classList.toggle('active');
  // También alterna
}
