// Función para formatear la duración
export function formatDuration(duration) {
  if (!duration) return 'N/A';
  const [hours, minutes, seconds] = duration.split(':');
  return `${hours}h ${minutes}m ${seconds}s`;
}
