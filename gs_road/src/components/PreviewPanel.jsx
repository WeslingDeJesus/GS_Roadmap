export default function PreviewPanel({ project }) {
    return (
        <div className="w-1/2 flex items-center justify-center">

            <img
                src={project.hitos?.[0]?.portada}
                className="max-h-[80%] rounded-xl shadow-xl"
            />

        </div>
    );
}