document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("register-form");
    const steps = document.querySelectorAll(".form-step");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const submitBtn = document.querySelector(".submit-btn");
    let currentStep = 0;

    // Mostrar paso actual
    function showStep(step) {
        steps.forEach((s, index) => {
            s.classList.remove("active", "next", "prev");
            if (index === step) {
                s.classList.add("active");
            } else if (index > step) {
                s.classList.add("next");
            } else {
                s.classList.add("prev");
            }
        });

        prevBtn.disabled = step === 0;
        nextBtn.style.display = step === steps.length - 1 ? "none" : "block";
        submitBtn.style.display = step === steps.length - 1 ? "block" : "none";
    }

    // Validaciones específicas para cada campo
    function validateField(field) {
        const value = field.value.trim();
        const errorElement = field
            .closest(".input-box")
            .querySelector(".error-message");

        // Limpiar errores previos
        if (errorElement) {
            errorElement.textContent = "";
            field.style.border = "";
        }

        // Validaciones por tipo de campo
        switch (field.id) {
            case "name":
                if (!value) {
                    showError(field, "El nombre es obligatorio");
                    return false;
                }
                if (value.length > 50) {
                    showError(
                        field,
                        "El nombre no puede exceder los 50 caracteres"
                    );
                    return false;
                }
                break;

            case "surnames":
                if (!value) {
                    showError(field, "Los apellidos son obligatorios");
                    return false;
                }
                if (value.length > 100) {
                    showError(
                        field,
                        "Los apellidos no pueden exceder los 100 caracteres"
                    );
                    return false;
                }
                break;

            case "email":
                if (!value) {
                    showError(field, "El email es obligatorio");
                    return false;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    showError(field, "Por favor ingresa un email válido");
                    return false;
                }
                break;

            case "rol_id":
                if (!value) {
                    showError(field, "Debes seleccionar un rol");
                    return false;
                }
                break;

            case "portfolio":
                if (value && value !== "No") {
                    try {
                        new URL(value);
                    } catch (_) {
                        showError(field, "Por favor ingresa una URL válida");
                        return false;
                    }
                }
                break;

            case "curriculum":
                // La validación se hace en validateCurrentStep()
                break;
        }

        return true;
    }

    // Mostrar mensaje de error
    function showError(field, message) {
        const errorElement = field
            .closest(".input-box")
            .querySelector(".error-message");
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.style.border = "2px solid red";
        return false;
    }

    // Validar todos los campos del paso actual
    function validateCurrentStep() {
        const currentFields = steps[currentStep].querySelectorAll(
            'input[required], select[required], input:not([type="file"]), select, input[type="file"]'
        );

        let isValid = true;

        currentFields.forEach((field) => {
            // Campo portfolio es opcional pero si tiene valor debe ser URL válida
            if (field.id === "portfolio" && field.value.trim() === "") {
                field.value = "No";
                return;
            }

            // Validación especial para curriculum
            if (field.id === "curriculum" && field.files.length > 0) {
                const file = field.files[0];
                if (file.type !== "application/pdf") {
                    showError(field, "El archivo debe ser un PDF");
                    isValid = false;
                    return;
                }
            }

            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Siguiente paso con validación
    nextBtn.addEventListener("click", function () {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    // Paso anterior
    prevBtn.addEventListener("click", function () {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Validación en tiempo real para campos
    steps.forEach((step) => {
        step.querySelectorAll("input, select").forEach((input) => {
            input.addEventListener("blur", function () {
                validateField(this);
            });

            input.addEventListener("focus", function () {
                const errorElement =
                    this.closest(".input-box").querySelector(".error-message");
                if (errorElement) {
                    errorElement.textContent = "";
                }
                this.style.border = "";
            });
        });
    });

    // Manejar el campo de archivo CV
    const curriculumInput = document.getElementById("curriculum");
    if (curriculumInput) {
        curriculumInput.addEventListener("change", function () {
            const fileName = this.files[0]
                ? this.files[0].name
                : "Ningún archivo seleccionado";
            document.getElementById("curriculum-name").textContent = fileName;
            validateField(this);
        });
    }

    // Inicializar
    showStep(0);
});
