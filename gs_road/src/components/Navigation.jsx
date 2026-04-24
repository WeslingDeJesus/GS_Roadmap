export default function Navigation({ next, prev }) {
    return (
        <div className="absolute bottom-10 right-10 flex gap-4">
            <button onClick={prev} className="bg-white px-4 py-2 rounded">
                ←
            </button>

            <button onClick={next} className="bg-white px-4 py-2 rounded">
                →
            </button>
        </div>
    );
}