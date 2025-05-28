export async function dropDownMenu(dropDownMenuElement, api) {
  try {
    const response = await fetch(api + 'categories');
    const data = await response.json();
    const categories = data.categories;
    let counter = 0;

    dropDownMenuElement.innerHTML = '';
    categories.forEach((category) => {
      counter++;
      if (counter < 7) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#`;
        a.textContent = category.name;
        li.appendChild(a);
        dropDownMenuElement.appendChild(li);
      }
    });
    const seeMore = document.createElement('li');
    const seeMoreLink = document.createElement('a');
    seeMoreLink.href = `#`;
    seeMoreLink.textContent = 'Ver Todas';
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
