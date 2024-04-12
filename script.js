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