document.addEventListener('DOMContentLoaded', function() {
    var hero = document.querySelector('.hero');
    hero.classList.add('fade-in');
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }


  function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    var navbar = document.getElementById("navbar");
    navbar.classList.toggle("active");
}