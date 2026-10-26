const menus = [...document.querySelectorAll('details.dropdown')];
const button = document.getElementById('mobile-button');
const navigation = document.getElementById('site-nav');

function closeMenus(except) {
  menus.forEach(menu => {
    if (menu !== except) menu.open = false;
  });
}

menus.forEach(menu => {
  // Close synchronously so rapid clicks and native details toggle events agree.
  menu.querySelector('summary').addEventListener('click', () => closeMenus(menu));
});

document.addEventListener('click', event => {
  if (!event.target.closest('details.dropdown')) closeMenus();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const openMenu = menus.find(menu => menu.open);
  if (openMenu) {
    openMenu.open = false;
    openMenu.querySelector('summary').focus();
  } else if (navigation?.classList.contains('is-open')) {
    navigation.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  }
});

button?.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(open));
  closeMenus();
});

navigation?.addEventListener('click', event => {
  if (!event.target.closest('a')) return;
  closeMenus();
  navigation.classList.remove('is-open');
  button?.setAttribute('aria-expanded', 'false');
});
