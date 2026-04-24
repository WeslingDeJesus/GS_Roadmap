import { proyectosMock } from "./mockData";

export function getProyectos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(proyectosMock);
        }, 500); // simula carga real
    });
}