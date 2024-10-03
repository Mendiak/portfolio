document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    hero.classList.add('fade-in');
});

function scrollToSection(sectionId) {
  let section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    // Cerrar el menú móvil
    let menu = document.querySelector('.mobile-menu');
    menu.classList.remove('active');
    // También resetear el botón de hamburguesa si es necesario
    let hamburger = document.getElementById("hamburger-btn");
    hamburger.classList.remove('active');
  }
}


function toggleMobileMenu() {
  let menu = document.querySelector('.mobile-menu');
  menu.classList.toggle('active');
 
}

