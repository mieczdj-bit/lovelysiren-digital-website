const screenshotDialog = document.querySelector('.rta-lightbox');
const enlargedScreenshot = screenshotDialog.querySelector('.rta-enlarged');
const screenshotCaption = document.getElementById('screenshot-caption');

document.querySelectorAll('.rta-screenshot').forEach(link => {
  link.addEventListener('click', event => {
    // Keep the original PNG link as a fallback when dialogs are unavailable.
    if (typeof screenshotDialog.showModal !== 'function') return;
    event.preventDefault();
    enlargedScreenshot.parentElement.style.cssText = link.dataset.screenStyle;
    enlargedScreenshot.src = link.href;
    enlargedScreenshot.alt = link.querySelector('img').alt;
    screenshotCaption.textContent = link.dataset.caption;
    screenshotDialog.showModal();
  });
});
screenshotDialog.querySelector('.rta-close').addEventListener('click', () => screenshotDialog.close());
screenshotDialog.addEventListener('click', event => {
  if (event.target !== screenshotDialog) return;
  const bounds = screenshotDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) screenshotDialog.close();
});
