// Función para formatear la duración
export function formatDuration(duration) {
    if (!duration) return "N/A";
    const [hours, minutes, seconds] = duration.split(":");
    return `${parseInt(hours)}h ${minutes}m ${seconds}s`;
}
