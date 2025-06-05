import { validateAddEditForm } from "../modules/validateAddEditForm.js";

async function initContent() {
    const backendAPI = "https://indiespot.test/api/";
    const authToken = localStorage.getItem("auth_token");

    setupGendersCategories(authToken);

    // Mostrar nombre de archivos seleccionados
    const setupFileInput = (inputId, nameId, labelId) => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener("change", function (e) {
                const fileName =
                    e.target.files[0]?.name || "Ningún archivo seleccionado";
                if (nameId)
                    document.getElementById(nameId).textContent = fileName;
                if (labelId)
                    document.getElementById(labelId).textContent = fileName;
            });
        }
    };

    setupFileInput("cover", "cover-name", "cover-label-text");
    setupFileInput("content", "content-name", "content-label-text");
    setupFileInput("m3u8", "m3u8-name", "m3u8-label-text");
    setupFileInput("ts1", "ts1-name", "ts1-label-text");
    setupFileInput("ts2", "ts2-name", "ts2-label-text");
    setupFileInput("ts3", "ts3-name", "ts3-label-text");
    setupFileInput("trailer", "trailer-name", "trailer-label-text");

    // Mostrar/ocultar campos según tipo de contenido
    document.getElementById("type").addEventListener("change", function () {
        const type = this.value;
        const singleContent = document.getElementById("single-content");
        const hlsContent = document.getElementById("hls-content");

        singleContent.classList.add("hidden");
        hlsContent.classList.add("hidden");

        document.getElementById("content").required = false;
        document.getElementById("m3u8").required = false;

        if (type === "application/vnd.apple.mpegurl") {
            hlsContent.classList.remove("hidden");
            document.getElementById("m3u8").required = true;
        } else {
            singleContent.classList.remove("hidden");
            document.getElementById("content").required = true;
        }
    });

    // Manejar envío del formulario
    document
        .getElementById("content-form")
        .addEventListener("submit", async function (e) {
            e.preventDefault();

            // Validar antes de enviar
            if (!validateAddEditForm()) {
                // Mostrar mensaje de error general
                document.querySelector(".general-error-message").style.display =
                    "block";
                setTimeout(() => {
                    document.querySelector(
                        ".general-error-message"
                    ).style.display = "none";
                }, 5000);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            // Resetear mensajes de error
            document
                .querySelectorAll("#content-form .error-message")
                .forEach((el) => (el.textContent = ""));
            document.getElementById("success-message").style.display = "none";

            // Mostrar loader
            document.getElementById("loading").style.display = "block";

            if (!authToken) {
                window.location.href = "/login";
                return;
            }

            const formData = new FormData();
            formData.append("title", document.getElementById("title").value);
            formData.append("type", document.getElementById("type").value);
            formData.append(
                "gender_id",
                document.getElementById("gender_id").value
            );
            formData.append("tagline", CKEDITOR.instances.tagline.getData());
            formData.append("overview", CKEDITOR.instances.overview.getData());
            formData.append(
                "duration_type_name",
                document.getElementById("duration-type-name").value
            );
            formData.append(
                "release_date",
                document.getElementById("release-date").value
            );
            if (document.getElementById("duration").value) {
                formData.append(
                    "duration",
                    document.getElementById("duration").value
                );
            }

            if (document.getElementById("cover")) {
                formData.append(
                    "cover",
                    document.getElementById("cover").files[0]
                );
            }

            if (
                document.getElementById("trailer") &&
                document.getElementById("trailer").files[0]
            ) {
                formData.append(
                    "trailer",
                    document.getElementById("trailer").files[0]
                );
            }

            const type = document.getElementById("type").value;
            if (type === "application/vnd.apple.mpegurl") {
                formData.append(
                    "m3u8",
                    document.getElementById("m3u8").files[0]
                );
                formData.append("ts1", document.getElementById("ts1").files[0]);
                formData.append("ts2", document.getElementById("ts2").files[0]);
                formData.append("ts3", document.getElementById("ts3").files[0]);
            } else {
                formData.append(
                    "content",
                    document.getElementById("content").files[0]
                );
            }

            const categoryCheckboxes = document.querySelectorAll(
                "#content-form .category-checkbox"
            );

            categoryCheckboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    formData.append("categories[]", checkbox.value);
                }
            });

            try {
                const response = await fetch("/api/add-content", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    // Mostrar errores específicos si existen
                    if (data.errors) {
                        Object.entries(data.errors).forEach(
                            ([field, messages]) => {
                                const errorElement = document.getElementById(
                                    `${field}-error`
                                );
                                if (errorElement) {
                                    errorElement.textContent =
                                        messages.join(", ");
                                }
                            }
                        );
                    } else {
                        throw new Error(
                            data.error || "Error al subir el contenido"
                        );
                    }
                    return;
                }

                // Mostrar mensaje de éxito
                document.getElementById("success-message").style.display =
                    "block";
                document.getElementById("success-message").textContent = `${
                    data.message
                } - ${data.movie?.title || "Contenido subido"}`;

                setTimeout(() => {
                    document.getElementById("success-message").style.display =
                        "none";
                }, 5000);

                // Resetear formulario
                document.getElementById("content-form").reset();
                document
                    .querySelectorAll("#content-form .file-name")
                    .forEach((el) => (el.textContent = ""));
                document
                    .querySelectorAll("#content-form .file-input-label span")
                    .forEach((el) => {
                        el.textContent = "Seleccionar archivo...";
                    });
                CKEDITOR.instances.tagline.setData("");
                CKEDITOR.instances.overview.setData("");
            } catch (error) {
                console.error("Error:", error);
                alert("Error al subir el contenido: " + error.message);
            } finally {
                document.getElementById("loading").style.display = "none";
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
}

initContent();

async function setupGendersCategories(authToken) {
    try {
        const selectGender = document.getElementById("gender_id");
        const categoriesContainer = document.getElementById(
            "categories-container"
        );
        let categoriesContainerTextContent = "";
        const genderResponse = await fetch("/api/genders", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        const categoryResponse = await fetch("/api/categories", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        const genderData = await genderResponse.json();
        const categoryData = await categoryResponse.json();
        const genders = genderData.genders;
        const categories = categoryData.categories;

        categories.forEach((category) => {
            categoriesContainerTextContent += `
                                  <label class="checkbox-container">
                                    <input type="checkbox" name="categories[${category.id}][id]" value="${category.id}" id="category-${category.id}" class="category-checkbox">
                                    <span class="checkmark"></span>
                                      <p>${category.name}</p>
                                  </label>
                                  `;
        });
        categoriesContainer.innerHTML = categoriesContainerTextContent;

        genders.forEach((gender) => {
            let option = document.createElement("option");
            option.value = gender.id;
            option.innerHTML = gender.name;
            selectGender.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}
