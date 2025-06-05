import { showFormErrors } from "./showFormErrors.js";

export function validateUserForm() {
    // Validaciones específicas
    let isValid = true;

    const name = document.getElementById("name").value.trim();
    if (name.length == 0) {
        showFormErrors("name", "El nombre es obligatorio.");
        isValid = false;
    }
    else if (name.length > 50) {
        showFormErrors("name", "El nombre no puede exceder los 50 caracteres");
        isValid = false;
    }

    const surnames = document.getElementById("surnames").value.trim();
    if (surnames.length == 0) {
        showFormErrors("surnames", "Los apellidos son obligatorio.");
        isValid = false;
    }
    if (surnames.length > 100) {
        showFormErrors("surnames", "Los apellidos no pueden exceder los 100 caracteres");
        isValid = false;
    }

    const email = document.getElementById('email').value.trim();
    if (email.length == 0) {
        showFormErrors(
            "email",
            "El email es obligatorio"
        );
        isValid = false;;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormErrors("email", "Introduzca un email válido.");
    }

    const curriculum = document.getElementById("curriculum");
    if (curriculum.files.length > 0) {
        const cvFile = curriculum.files[0];
        if (cvFile.type != "application/pdf") {
            showFormErrors("curriculum", "El archivo debe ser un pdf");
            isValid = false;
        }
    }

    const password = document.getElementById("password").value.trim();
    const password_confirm = document.getElementById("password-confirmation").value.trim();

    if (password.length == 0) {
        showFormErrors("password", "La contraseña es obligatoria.");
        isValid = false;
    }
    else if (password != password_confirm) {
        showFormErrors("password", "Las contraseñas no coinciden");
        isValid = false;
    }
    else if (password == password_confirm && password.length < 6) {
        showFormErrors("password", "Mínimo 6 caracteres");
        isValid = false;
    }
        return isValid;
}
