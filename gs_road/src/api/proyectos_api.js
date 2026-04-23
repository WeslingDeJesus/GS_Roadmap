const api_url = `${import.meta.env.VITE_API_URL}/vw_rmp_proyecto`

export function getProyectos() {
    return fetch(api_url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error:", error);
            throw error;
        });
}