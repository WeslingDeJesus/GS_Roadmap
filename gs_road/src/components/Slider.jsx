import { useState } from "react";
import Slide from "./Slide";
import Navigation from "./Navigation";

export default function Slider({ data }) {
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent((prev) => (prev + 1) % data.length);
    };

    const prev = () => {
        setCurrent((prev) =>
            prev === 0 ? data.length - 1 : prev - 1
        );
    };

    const currentSlide = data[current];

    return (
        <div
            className="h-screen w-full transition-all duration-500"
            style={{ backgroundColor: currentSlide.color }}
        >
            <Slide project={currentSlide} />

            <Navigation next={next} prev={prev} />
        </div>
    );
}