export function showFormErrors(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);

    if (!errorElement || !inputElement) return;

    errorElement.textContent = message;
    errorElement.style.display = "block";

    // Eliminar errores previos por si ya había uno
    inputElement.removeEventListener("focus", hideError);

    // Función para ocultar el error al hacer foco
    function hideError() {
        errorElement.style.display = "none";
        inputElement.removeEventListener("focus", hideError); // limpiar después de ejecutarse
    }

    // Añadir evento
    inputElement.addEventListener("focus", hideError);
}