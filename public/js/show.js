import { getIp } from "./modules/getIp.js";
import { logOut } from "./modules/logOut.js";
import { formatDuration } from "./modules/formatDuration.js";
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

  const menu = document.querySelector(".menu");

  window.addEventListener("scroll", function () {
      if (window.scrollY > 1) {
          menu.classList.add("scrolled");
      } else {
          menu.classList.remove("scrolled");
      }
  });

    try {
        const response = await fetch(api + "content/" + movieSlug, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Device-ID": device_id,
                "User-Ip": ip,
                "User-Agent": userAgent,
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            console.log(data);
            const image = document.getElementById("content-image");
            const title = document.getElementById("content-title");
            const trailer = document.getElementById("trailer");
            trailer.src = backendURL + data.movie.trailer;
            image.src = backendURL + data.movie.cover;
            title.innerHTML = data.movie.title;
            document.title = data.movie.title + " - IndieSpot";
            const users = data.movie.users;

            let directorName;
            let photoDirectorName;
            let artDirectorName;
            let editorName;
            let scriptWriterName;
            let productorName;
            let soundEngineerName;
            let actorsNames = [];
            let operatorsNames = [];

            users.forEach((user) => {
                const userObj = {
                    id: user.id,
                    name: user.name + " " + user.surnames,
                };

                switch (user.rol.name) {
                    case "Director/a":
                        directorName = userObj;
                        break;
                    case "Director/a de Fotografía":
                        photoDirectorName = userObj;
                        break;
                    case "Actor/Actriz":
                        actorsNames.push(userObj);
                        break;
                    case "Guionista":
                        scriptWriterName = userObj;
                        break;
                    case "Productor/a":
                        productorName = userObj;
                        break;
                    case "Operador/a":
                        operatorsNames.push(userObj);
                        break;
                    case "Ingeniero/a de Sonido":
                        soundEngineerName = userObj;
                        break;
                    case "Editor/a":
                        editorName = userObj;
                        break;
                    case "Director/a de arte":
                        artDirectorName = userObj;
                        break;
                }
            });

            director.innerHTML = directorName.name;
            gender.innerHTML = data.movie.gender.name;
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

            if (directorName) {
                directorCastDetails.innerHTML += `<a href="#" class="cast-name" data-id="${directorName.id}">${directorName.name}</a>`;
            }
            if (scriptWriterName) {
                writeScripter.innerHTML += `<a href="#" class="cast-name" data-id="${scriptWriterName.id}">${scriptWriterName.name}</a>`;
            }
            if (soundEngineerName) {
                sound.innerHTML += `<a href="#" class="cast-name" data-id="${soundEngineerName.id}">${soundEngineerName.name}</a>`;
            }
            if (photoDirectorName) {
                photoDirector.innerHTML += `<a href="#" class="cast-name" data-id="${photoDirectorName.id}">${photoDirectorName.name}</a>`;
            }
            if (editorName) {
                editor.innerHTML += `<a href="#" class="cast-name" data-id="${editorName.id}">${editorName.name}</a>`;
            }
            if (productorName) {
                productor.innerHTML += `<a href="#" class="cast-name" data-id="${productorName.id}">${productorName.name}</a>`;
            }
            if (artDirectorName) {
                artDirector.innerHTML += `<a href="#" class="cast-name" data-id="${artDirectorName.id}">${artDirectorName.name}</a>`;
            }

            play.addEventListener("click", function () {
                window.location.href = `/player/${movieSlug}`;
            });

            function buildLinks(array) {
                return array
                    .map(
                        (user) =>
                            `<a href="#" class="cast-name" data-id="${user.id}">${user.name}</a>`
                    )
                    .join(", ");
            }
        } else {
            console.error("Error al consultar la API: ", data.message);
        }
    } catch (error) {
        alert("Error en la solicitud: ", error);
        console.log(error);
    }
}

fetchMovieData();

