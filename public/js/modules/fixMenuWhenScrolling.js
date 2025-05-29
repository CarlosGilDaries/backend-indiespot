export function fixMenuWhenScrollling() {
    document.addEventListener("DOMContentLoaded", function () {
        const menu = document.querySelector(".menu");

        window.addEventListener("scroll", function () {
            if (window.scrollY > 1) {
                // Si se ha hecho scroll hacia abajo
                menu.classList.add("scrolled");
            } else {
                menu.classList.remove("scrolled");
            }
        });
    });
}
