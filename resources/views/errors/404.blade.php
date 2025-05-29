<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<link rel="stylesheet" href="/css/normalize.css">
		<link rel="stylesheet" href="/css/404.css">
		<link id="favicon" rel="icon" type="image/png" href="/images/indie-logo.png">
		<title>Página no encontrada</title>
	</head>
	<body>
		<header>
			<div class="menu">
				<nav>
					<ul class="nav left-nav">
						<li class="logo"><a href="/"><img src="/images/indie-logo.png" alt="Indiespot logo"></a></li>
						<li class="left-nav-links"><a href="/">Inicio</a></li>
						<li class="dropdown left-nav-links">
							<a href="/categories.html" class="dropdown-toggle">Categorías</a>
							<ul class="dropdown-menu" id="categories">
							</ul>
						</li>
						<li class="dropdown left-nav-links">
							<a href="/genders.html" class="dropdown-toggle">Géneros</a>
							<ul class="dropdown-menu" id="genders">
							</ul>
						</li>
						<li class="left-nav-links"><a href="#">Favoritos</a></li>
					</ul>
				</nav>
				<nav>
					<ul class="nav right-nav">
						<li><a href="#"><img src="/images/search-icon.png" alt="Search"></a></li>
						<li class="user"><a href="/account"><img src="/images/user-icon.png" alt="User"></a></li>
					</ul>
				</nav>
			</div>
		</header>

		<div class="error-container">
			<div class="error-content">
				<h1>404</h1>
				<h2>Página no encontrada</h2>
				<p>No hemos encontrado lo que buscabas.</p>
				<div class="error-actions">
					<a href="/" class="btn">Volver al inicio</a>
				</div>
			</div>
			<div class="error-image">
				<img src="/images/404.webp" alt="Error 404" class="pixelated">
			</div>
		</div>

		<footer class="footer">
			<div class="footer-container">
				<div class="info">
					<a href="#">Centro de ayuda</a>
					<a href="#">¿Quiénes somos?</a>
					<a href="#">Cambiar preferencias de cookies</a>
				</div>
				<ul class="icons">
					<a href="#"><li><img src="/images/instagram-53.png" alt="Instagram"></li></a>
					<a href="#"><li><img src="/images/facebook.png" alt="Facebook"></li></a>
					<a href="#"><li><img src="/images/twitterx--v2.png" alt="Twitter"></li></a>
					<a href="#"><li><img src="/images/github.png" alt="Github"></li></a> 
				</ul>
			</div>
		</footer>

		<script type="module">
			import { dropDownTypeMenu } from '/js/modules/dropDownTypeMenu.js';

			const categoriesDropDown = document.getElementById('categories');
			const gendersDropDown = document.getElementById('genders');

			dropDownTypeMenu(categoriesDropDown, 'categories', 'category');
			dropDownTypeMenu(gendersDropDown, 'genders', 'gender');
		</script>

	</body>
</html>