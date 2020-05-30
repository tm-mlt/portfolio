import './styles/index.scss';



document.addEventListener('DOMContentLoaded', function() {
  const activeClass = 'active';
  const contacts = document.querySelector('[href="/about#contacts"]');
  const active = document.querySelector('.header__link.active');

  function activateLink() {
    active.classList.remove(activeClass);
    contacts.classList.add(activeClass);
  }

  if(location.hash === "#contacts") {
    activateLink();
  } else {
    contacts.addEventListener('click', activateLink);
  }
});
