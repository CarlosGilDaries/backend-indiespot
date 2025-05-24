export async function logOut(token) {
    const api = 'https://indiespot.test/api/';
    
    try {
        const response = await fetch(api + 'logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user_email');

            window.location.href = '/';
        } else {
            console.error('Error al cerrar sesión:', data.message);
        }
    } catch (error) {
        console.error('Error en la solicitud de logout:', error);
    }
}
