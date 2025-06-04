import { getIp } from "./modules/getIp.js";
import { logOut } from "./modules/logOut.js";
import { formatDuration } from "./modules/formatDuration.js";
import { dropDownTypeMenu } from "./modules/dropDownTypeMenu.js";
import { renderSimilars } from "./modules/renderSimilars.js";
import { fixMenuWhenScrollling } from "./modules/fixMenuWhenScrolling.js";
//import { checkDeviceID } from './modules/checkDeviceId.js';

const pathParts = window.location.pathname.split("/");
const movieSlug = pathParts[pathParts.length - 1]; // Extraer el último segmento de la URL
const api = "https://indiespot.test/api/";
const backendURL = "https://indiespot.test";
const play = document.querySelector(".play-button");
const token = localStorage.getItem("auth_token");
const director = document.getElementById("director");
const directorCastDetails = document.querySelector(".director");
const actors = document.querySelector(".actors");
const writeScripter = document.querySelector(".script-writter");
const operators = document.querySelector(".operators");
const sound = document.querySelector(".sound");
const photoDirector = document.querySelector(".photo-director");
const editor = document.querySelector(".editor");
const productor = document.querySelector(".productor");
const artDirector = document.querySelector(".art-director");
const gender = document.getElementById("gender");
const tagline = document.getElementById("tagline");
const date = document.getElementById("date");
const duration = document.getElementById("duration");
const overview = document.getElementById("overview-text");
const categoriesDropDown = document.getElementById("categories");
const gendersDropDown = document.getElementById("genders");

dropDownTypeMenu(categoriesDropDown, "categories", "category");
dropDownTypeMenu(gendersDropDown, "genders", "gender");

fixMenuWhenScrollling();

if (token == null) {
    window.location.href = "/login";
}
const email = localStorage.getItem("current_user_email");
const device_id = localStorage.getItem("device_id_" + email);
const ip = await getIp();
const userAgent = navigator.userAgent;

if (device_id == null) {
    logOut(token);
}

//checkDeviceID(api, token);

async function fetchMovieData() {

    try {
        const response = await fetch("/api/content/" + movieSlug, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            console.log(data);
            const image = document.getElementById("content-image");
            const title = document.getElementById("content-title");
            const trailer = document.getElementById("trailer");
            if (data.movie.trailer != null) {
                trailer.classList.add("fade-out");
                setTimeout(() => {
                    trailer.src = backendURL + data.movie.trailer;
                    trailer.classList.remove("fade-out");
                }, 1500);
            }
            trailer.poster = data.movie.cover;
            image.src = backendURL + data.movie.cover;
            title.innerHTML = data.movie.title;
            document.title = data.movie.title + " - IndieSpot";
            const users = data.movie.users;

            let directorName = [];
            let photoDirectorName = [];
            let artDirectorName = [];
            let editorName = [];
            let scriptWriterName = [];
            let productorName = [];
            let soundEngineerName = [];
            let actorsNames = [];
            let operatorsNames = [];

            users.forEach((user) => {
                const userObj = {
                    id: user.id,
                    name: user.name + " " + user.surnames,
                };

                switch (user.rol.name) {
                    case "Director/a":
                        directorName.push(userObj);
                        break;
                    case "Director/a de Fotografía":
                        photoDirectorName.push(userObj);
                        break;
                    case "Actor/Actriz":
                        actorsNames.push(userObj);
                        break;
                    case "Guionista":
                        scriptWriterName.push(userObj);
                        break;
                    case "Productor/a":
                        productorName.push(userObj);
                        break;
                    case "Operador/a":
                        operatorsNames.push(userObj);
                        break;
                    case "Ingeniero/a de Sonido":
                        soundEngineerName.push(userObj);
                        break;
                    case "Editor/a":
                        editorName.push(userObj);
                        break;
                    case "Director/a de Arte":
                        artDirectorName.push(userObj);
                        break;
                }
            });

            if (directorName.length > 0) {
                director.innerHTML = buildBannerLinks(directorName);
            }
            gender.innerHTML = data.movie.gender.name;
            gender.href = `/gender-show.html?id=${data.movie.gender_id}`;
            tagline.innerHTML = data.movie.tagline;
            date.innerHTML = data.release_date;
          duration.innerHTML = formatDuration(data.movie.duration);
          overview.innerHTML = data.movie.overview;

            if (actorsNames.length > 0) {
                actors.innerHTML += buildLinks(actorsNames);
            }

            if (operatorsNames.length > 0) {
                operators.innerHTML += buildLinks(operatorsNames);
            }

            if (directorName.length > 0) {
                directorCastDetails.innerHTML += buildLinks(directorName);
            }
            if (scriptWriterName.length > 0) {
                writeScripter.innerHTML += buildLinks(scriptWriterName);
            }
            if (soundEngineerName.length > 0) {
                sound.innerHTML += buildLinks(soundEngineerName);
            }
            if (photoDirectorName.length > 0) {
                photoDirector.innerHTML += buildLinks(photoDirectorName);
            }
            if (editorName.length > 0) {
                editor.innerHTML += buildLinks(editorName);
            }
            if (productorName.length > 0) {
                productor.innerHTML += buildLinks(productorName);
            }
            if (artDirectorName.length > 0) {
                artDirector.innerHTML += buildLinks(artDirectorName);
            }

            play.addEventListener("click", function () {
                window.location.href = `/player/${movieSlug}`;
            });

            function buildLinks(array) {
                return array
                    .map(
                        (user) =>
                            `<a href="/account-show.html?id=${user.id}" class="cast-name" data-id="${user.id}">${user.name}</a>`
                    )
                    .join(", ");
            }

            function buildBannerLinks(array) {
                return array
                    .map(
                        (user) =>
                            `<a href="/account-show.html?id=${user.id}" class="cast-name" data-id="${user.id}">${user.name}</a>`
                    )
                    .join(" · ");
            }

            renderSimilars(data.movie, token);
        } else {
            console.error("Error al consultar la API: ", data.message);
        }
    } catch (error) {
        alert("Error en la solicitud: ", error);
        console.log(error);
    }
}

fetchMovieData();

const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach((t) => {
            t.classList.remove("active");
        });
        document.querySelectorAll(".tab-content").forEach((c) => {
            c.classList.remove("active");
        });

        const tabId = this.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
        this.classList.add("active");
    });
});


