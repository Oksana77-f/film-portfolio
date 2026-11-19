const gallery = document.querySelector('#gallery');
const works = [...gallery.querySelectorAll('[data-kind]')];
const filterControls = [...document.querySelectorAll('[data-filter]')];
const galleryStatus = document.querySelector('#gallery-status');
const categories = new Set(works.map((work) => work.dataset.kind));

function selectFilter(filter) {
  let count = 0;
  for (const work of works) {
    work.hidden = filter !== 'all' && work.dataset.kind !== filter;
    if (!work.hidden) count += 1;
  }

  for (const control of filterControls) {
    const selected = String(filter === control.dataset.filter);
    if (control.matches('button')) control.setAttribute('aria-pressed', selected);
    if (control.closest('.rail-nav')) control.setAttribute('aria-current', selected);
  }

  galleryStatus.textContent = `Показано работ: ${count}`;
}

function syncFilter() {
  const hash = location.hash.slice(1);
  if (categories.has(hash)) {
    selectFilter(hash);
    requestAnimationFrame(() => gallery.scrollIntoView({ block: 'start' }));
  } else if (['gallery', 'top', 'work', ''].includes(hash)) {
    selectFilter('all');
  }
}

for (const control of filterControls) {
  control.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

    const filter = control.dataset.filter;
    const hash = filter === 'all' ? '#gallery' : `#${filter}`;
    event.preventDefault();
    selectFilter(filter);

    if (control.matches('a')) {
      if (location.hash !== hash) history.pushState(null, '', hash);
      gallery.scrollIntoView({ block: 'start' });
    } else if (location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  });
}

selectFilter('all');
syncFilter();
window.addEventListener('hashchange', syncFilter);

const dialog = document.querySelector('.case-dialog');
const caseTitle = document.querySelector('#case-title');
const caseCategory = document.querySelector('#case-category');
const caseDetails = document.querySelector('#case-details');

gallery.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-case]');
  if (!trigger) return;

  caseTitle.textContent = trigger.querySelector('strong').textContent;
  caseCategory.textContent = trigger.querySelector('small').textContent;
  caseDetails.replaceChildren(trigger.closest('article').querySelector('template').content.cloneNode(true));
  dialog.showModal();
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener('close', () => caseDetails.replaceChildren());
