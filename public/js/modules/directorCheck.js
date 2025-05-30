export function directorCheck(token) {
    fetch("/api/current-user", {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const rol = data.rol.name;
                if (rol != "Director/a") {
                    window.location.href = "/";
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
