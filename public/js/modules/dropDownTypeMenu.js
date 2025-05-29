export async function dropDownTypeMenu(dropDownMenuElement, types, type) {
  try {
    const response = await fetch(`/api/${types}`);
    const data = await response.json();
    const items = data[types];
    let counter = 0;

    dropDownMenuElement.innerHTML = '';
    items.forEach((item) => {
      counter++;
      if (counter <= 7) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/${type}-show.html?id=${item.id}`;
        a.textContent = item.name;
        li.appendChild(a);
        dropDownMenuElement.appendChild(li);
      }
    });
    const seeMore = document.createElement('li');
    const seeMoreLink = document.createElement('a');
    seeMoreLink.href = `/${types}.html`;
    seeMoreLink.textContent = 'Ver Más';
    seeMore.appendChild(seeMoreLink);
    dropDownMenuElement.appendChild(seeMore);

    // Manejar el dropdown en móviles
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');

    dropdownToggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  } catch (error) {
    console.log(error);
  }
}
