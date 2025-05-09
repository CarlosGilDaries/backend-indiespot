document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('auth_token');
  const api = 'https://indiespot.test/api/';
  const backendURL = 'https://indiespot.test';

  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    // Obtener lista de dispositivos
    const response = await fetch(api + 'manage-devices', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

      if (!response.ok) {
      throw new Error('Error al obtener dispositivos');
    }

    const data = await response.json();

    if (data.success) {
      renderDevices(api, data.devices);
    } else {
      throw new Error(data.message || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar dispositivos: ' + error.message);
    window.location.href = '/login';
  }
});

function renderDevices(api, devices) {
  const devicesList = document.getElementById('devices-list');

  if (!devicesList) {
    console.error('Elemento devices-list no encontrado en el DOM');
    return;
  }

  // Limpiar lista existente
  devicesList.innerHTML = '';

  if (!devices || devices.length === 0) {
    devicesList.innerHTML = '<p>No hay dispositivos registrados.</p>';
    return;
  }

  // Crear elementos para cada dispositivo
  devices.forEach((device) => {
    const deviceElement = document.createElement('div');
    deviceElement.className = 'device-item';

    const deviceName = document.createElement('p');
    deviceName.className = 'device-name';
    deviceName.textContent = device.device_name || 'Dispositivo sin nombre';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-device';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => handleDeleteDevice(api, device.id));

    deviceElement.appendChild(deviceName);
    deviceElement.appendChild(deleteButton);

    devicesList.appendChild(deviceElement);
  });
}

async function handleDeleteDevice(api, deviceId) {
  const token = localStorage.getItem('auth_token');

  if (!confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
    return;
  }

  try {
    const response = await fetch(api + 'destroy-device', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: deviceId }),
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = '/new-device.html';
    } else {
      throw new Error(data.message || 'Error al eliminar dispositivo');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}