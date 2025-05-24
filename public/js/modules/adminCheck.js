export function adminCheck(token) {
    const backendAPI = 'https://indiespot.test/api/';
    
    fetch(backendAPI + 'current-user', {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const user = data.user;

                if (user.type != 'admin') {
                    window.location.href = '/';
                }
            }
        })
    .catch((error) => {
        console.log(error);
    });
}