export async function checkDeviceID(api, token) {
    // Comparar los device_ids de localstorage con los de la BD
    const allKeys = Object.keys(localStorage);
    const deviceIds = allKeys
        .filter((key) => key.startsWith('device_id_'))
        .map((key) => localStorage.getItem(key));

    if (deviceIds.length != 0 && token != null) {
        try {
            const response = await fetch(api + 'check-device-id', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'User-Device-Id': deviceIds.join(','),
                },
            });

            const idsData = await response.json();

            if (idsData.has_missing) {
                const deviceIdKeys = allKeys.filter((key) =>
                    key.startsWith('device_id_')
                );
                deviceIdKeys.forEach((key) => {
                    const value = localStorage.getItem(key);
                    if (idsData.missing_device_ids.includes(value)) {
                        localStorage.removeItem(key);
                        alert('Sesión caducada');
                        window.location.href = '/';
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}