document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    hero.classList.add('fade-in');
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
 
}
