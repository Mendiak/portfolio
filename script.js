document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    hero.classList.add('fade-in');
});

function scrollToSection(sectionId) {
  let section = document.getElementById(sectionId);
  if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleMobileMenu() {
  let menu = document.getElementById("mobile-menu");
  menu.classList.toggle("active");
}
