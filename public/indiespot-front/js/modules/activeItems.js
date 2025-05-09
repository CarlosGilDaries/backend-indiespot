export function activeItems(menuItems, contentContainers) {
  // Guardar datos PRIMERO, antes de mostrar el contenido
  const dataSlug = this.getAttribute('data-slug');
  const dataId = this.getAttribute('data-id');
  const dataTitle = this.getAttribute('data-title');

  if (dataSlug) localStorage.setItem('slug', dataSlug);
  if (dataId) localStorage.setItem('id', dataId);
  if (dataTitle) localStorage.setItem('title', dataTitle);

  menuItems.forEach((item) => item.classList.remove('active'));
  let scripts = document.querySelectorAll('.panel-scripts');

  this.classList.add('active');
  contentContainers.forEach((container) => container.classList.add('hidden'));

  const contentId = this.getAttribute('data-content');
  const contentToShow = document.getElementById(contentId);

  // Ahora mostrar el contenido
  if (contentToShow) {
    contentToShow.classList.remove('hidden');
    contentToShow.dispatchEvent(new Event('show'));
  }

  // Limpiar y cargar scripts
  scripts.forEach((script) => script.remove());

  const scriptUrl = this.getAttribute('data-script');
  if (scriptUrl) {
    let currentScript = document.createElement('script');
    currentScript.src = scriptUrl;
    currentScript.type = 'module';
    currentScript.classList.add('panel-scripts');
    document.body.appendChild(currentScript);
  }
}
