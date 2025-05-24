export function getVideoContent(data, node, backendURL) {
  const videos = new Set();
  data.data.movies.forEach((element) => {
      videos.add(element);
  });

  videos.forEach((video) => {
    const article = document.createElement('article');
    article.classList.add('content');

    const link = document.createElement('a');
    link.href = `/${video.slug}`;

    const img = document.createElement('img');
    img.src = backendURL + video.cover;

    link.append(img);
    article.append(link);
    node.append(article);
  });

  return videos;
}
