export default function InfoPanel({ project }) {
    return (
        <div className="w-1/2 flex flex-col justify-center px-16">

            <img src={project.logo} className="w-20 mb-6" />

            <h1 className="text-5xl font-bold">
                {project.nombre}
            </h1>

            <p className="mt-6 text-lg opacity-90">
                {project.descripcion_ct}
            </p>

            <button className="mt-8 bg-white text-black px-6 py-3 rounded-lg">
                Ver más
            </button>

            <div className="mt-10">
                <h2 className="text-xl mb-4">Avances:</h2>

                <ul className="space-y-2">
                    {project.hitos?.map((hito) => (
                        <li key={hito.id} className="text-sm opacity-80">
                            • {hito.descripcion_ct}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}