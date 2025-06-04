import { showFormErrors } from "../modules/showFormErrors.js";

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

    // Validaciones específicas
    function validateForm() {
        let isValid = true;

        // Validar título (máximo 100 caracteres)
        const title = document.getElementById("title").value.trim();
        if (title.length > 100) {
            showFormErrors(
                "title",
                "El título no puede exceder los 100 caracteres"
            );
            isValid = false;
        }

        // Validar descripción corta (máximo 500 caracteres)
        let tagline = "";
        if (typeof CKEDITOR !== "undefined" && CKEDITOR.instances.tagline) {
            tagline = CKEDITOR.instances.tagline
                .getData()
                .replace(/<[^>]*>/g, "")
                .trim();
        } else {
            tagline = document.getElementById("tagline").value.trim();
        }
        if (tagline.length > 500) {
            showFormErrors(
                "tagline",
                "El resumen corto no puede exceder los 500 caracteres"
            );
            isValid = false;
        }

        // Validar descripción larga (máximo 1000 caracteres)
        let overview = "";
        if (typeof CKEDITOR !== "undefined" && CKEDITOR.instances.overview) {
            overview = CKEDITOR.instances.overview
                .getData()
                .replace(/<[^>]*>/g, "")
                .trim();
        } else {
            overview = document.getElementById("overview").value.trim();
        }
        if (overview.length > 1000) {
            showFormErrors(
                "overview",
                "La descripción no puede exceder los 1000 caracteres"
            );
            isValid = false;
        }

        // Validar imagen (JPG y dimensiones)
        const coverInput = document.getElementById("cover");
        if (coverInput.files.length > 0) {
            const coverFile = coverInput.files[0];
            const validImageTypes = ["image/jpeg", "image/jpg"];

            if (!validImageTypes.includes(coverFile.type)) {
                showFormErrors("cover", "La imagen debe ser un archivo JPG");
                isValid = false;
            } else {
                // Verificar dimensiones
                const img = new Image();
                img.onload = function () {
                    if (this.width !== 1024 || this.height !== 768) {
                        showFormErrors(
                            "cover",
                            "La imagen debe tener dimensiones de 1024x768px"
                        );
                        isValid = false;
                    }
                };
                img.src = URL.createObjectURL(coverFile);
            }
        }

        // Validar trailer (MP4)
        const trailerInput = document.getElementById("trailer");
        if (trailerInput.files.length > 0) {
            const trailerFile = trailerInput.files[0];
            if (trailerFile.type !== "video/mp4") {
                showFormErrors("trailer", "El trailer debe ser un archivo MP4");
                isValid = false;
            }
        }

        // Validar archivos de contenido
        const type = document.getElementById("type").value;

        if (type === "video/mp4") {
            const contentInput = document.getElementById("content");
            if (
                contentInput.files.length > 0 &&
                contentInput.files[0].type !== "video/mp4"
            ) {
                showFormErrors(
                    "content",
                    "El contenido debe ser un archivo MP4"
                );
                isValid = false;
            }
        } else if (type === "application/vnd.apple.mpegurl") {
            // Validar archivo m3u8
            const m3u8Input = document.getElementById("m3u8");
            if (m3u8Input.files.length === 0) {
                showFormErrors("m3u8", "Debes seleccionar un archivo .m3u8");
                isValid = false;
            } else if (!m3u8Input.files[0].name.endsWith(".m3u8")) {
                showFormErrors("m3u8", "El archivo debe ser .m3u8");
                isValid = false;
            }

            // Validar archivos ts (deben ser ZIP)
            const tsInputs = ["ts1", "ts2", "ts3"];
            tsInputs.forEach((inputId) => {
                const input = document.getElementById(inputId);

                if (input.files.length === 0) {
                    showFormErrors(inputId, "Archivo obligatorio.");
                    isValid = false;
                } else if (!input.files[0].name.endsWith(".zip")) {
                    showFormErrors(inputId, "El archivo debe ser .zip");
                    isValid = false;
                }
            });
        }

        // Validar fecha de estreno
        const releaseDate = document.getElementById("release-date").value;
        if (releaseDate) {
            const date = new Date(releaseDate);
            const today = new Date();
            if (date > today) {
                showFormErrors("release-date", "La fecha no puede ser futura");
                isValid = false;
            }
        } else {
            showFormErrors(
                "release-date",
                "La fecha de estreno es obligatoria"
            );
            isValid = false;
        }

        // Validar duración
        const duration = document.getElementById("duration").value;
        if (!duration) {
            showFormErrors("duration", "La duración es obligatoria");
            isValid = false;
        } else {
            const [hours, minutes, seconds] = duration.split(":").map(Number);
            if (hours > 12 || minutes > 59 || seconds > 59) {
                showFormErrors("duration", "Duración no válida");
                isValid = false;
            }
        }

        return isValid;
    }

    // Manejar envío del formulario
    document
        .getElementById("content-form")
        .addEventListener("submit", async function (e) {
            e.preventDefault();

            // Validar antes de enviar
            if (!validateForm()) {
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
            let atLeastOneCategoryChecked = false;

            categoryCheckboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    formData.append("categories[]", checkbox.value);
                    atLeastOneCategoryChecked = true;
                }
            });

            if (!atLeastOneCategoryChecked) {
                document.getElementById("loading").style.display = "none";
                alert("Selecciona al menos una categoría");
                return;
            }

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
