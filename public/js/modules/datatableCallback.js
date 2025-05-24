export function datatableCallback({ onClick, onMenuSetup, onDelete, token, messageId, formClass, deleteApi }) {
    const links = document.querySelectorAll(".action-item");
    links.forEach((link) => {
        link.addEventListener("click", onClick);
    });

    onMenuSetup();

    const message = document.getElementById(messageId);
    onDelete(token, formClass, deleteApi, message);
}
