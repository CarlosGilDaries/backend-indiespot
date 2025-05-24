export function renderContents(contents, id, icon, href) {
  const container = document.getElementById(id);
  let containerTextContent = '';

  if (!href) {
    contents.forEach((content) => {
      containerTextContent += `   
                                <div class="admin-card">
                                    <h3>${content.title}</h3>
                                    <form class="admin-form" data-id="${content.id}">
                                        <input type="hidden" name="content_id" value="${content.id}">
                                        <button type="submit" class="icon-button">
                                            <i class="${icon}"></i>
                                        </button>
                                    </form>
                                </div>
                                `;
    });
  } else {
    contents.forEach((content) => {
      containerTextContent += `   
                                <div class="admin-card">
                                    <h3>${content.title}</h3>
                                    <div class="admin-form" data-id="${content.id}">
                                        <input type="hidden" name="content_id" value="${content.id}">
                                        <a href="${href}?slug=${content.slug}" class="icon-button">
                                            <i class="${icon}"></i>
                                        </a>
                                    </div>
                                </div>
                                `;
    });
  }

  container.innerHTML = containerTextContent;
}
