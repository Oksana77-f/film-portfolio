const dialog = document.querySelector('.lightbox');
const enlarged = dialog.querySelector('img');

for (const link of document.querySelectorAll('[data-zoom]')) {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || !dialog.showModal) return;
    event.preventDefault();
    enlarged.src = link.href;
    enlarged.alt = link.querySelector('img')?.alt || link.getAttribute('aria-label');
    dialog.showModal();
  });
}

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener('close', () => enlarged.removeAttribute('src'));
