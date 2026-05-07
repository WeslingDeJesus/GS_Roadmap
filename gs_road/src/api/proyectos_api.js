const API_URL = import.meta.env.VITE_API_URL;

export const getProyectos = async () => {
    try {
        const response = await fetch(`${API_URL}/api/vw_rmp_proyecto/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ limit: 1000 }) // Aumentamos el límite para traer todos los proyectos
        });
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching proyectos:", error);
        throw error;
    }
};