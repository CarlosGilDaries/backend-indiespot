// Función para agregar funcionalidad de desplazamiento con flechas
export function addScrollFunctionality(container, px) {
  const wrapper = container.parentElement;
  const leftArrow = wrapper.querySelector('.scroll-left');
  const rightArrow = wrapper.querySelector('.scroll-right');

  function updateArrows() {
    leftArrow.classList.toggle('hidden', container.scrollLeft <= 0);
    rightArrow.classList.toggle(
      'hidden',
      container.scrollLeft + container.clientWidth >= container.scrollWidth
    );
  }

  leftArrow.addEventListener('click', () => {
    container.scrollBy({ left: -px, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    container.scrollBy({ left: px, behavior: 'smooth' });
  });

  container.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);

  updateArrows(); // Inicializa el estado de las flechas
}
