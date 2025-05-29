export async function renderTypeGrid(route, types, type) {
  try {
    const response = await fetch(route);
    const data = await response.json();
    const items = data[types];
    const main = document.querySelector('.main-grid');

    items.forEach((item) => {
      const typeBox = document.createElement('div');
      typeBox.setAttribute('data-id', item.id);
      typeBox.classList.add(`${type}-box`, 'box');
      typeBox.innerHTML = `
            <h2 class="${type}-name">${item.name}</h2>
          `;
      typeBox.addEventListener('click', () => {
        window.location.href = `/${type}-show.html?id=${item.id}`;
      });

      main.appendChild(typeBox);
    });
  } catch (error) {
    console.error(error);
  }
}
