import React from 'react'
import './Home.css'

export default function Home({ slides = [], onViewDoc }) {
  // Filter unique logos by platform name (logoName)
  const uniqueLogosMap = new Map()
  slides.forEach(slide => {
    if (!uniqueLogosMap.has(slide.logoName)) {
      uniqueLogosMap.set(slide.logoName, slide.logoUrl)
    }
  })
  const logos = Array.from(uniqueLogosMap.values())

  // Repeat the logos multiple times for a seamless infinite scroll effect
  const carouselLogos = [...logos, ...logos, ...logos, ...logos]

  return (
    <div className="home-container relative overflow-hidden h-screen flex flex-col">
      {/* Header */}
      <header className="home-header">
        <img
          src="/logos/gs_roadmap.png"
          alt="General Roadmap"
          className="h-10 lg:h-12 object-contain brightness-0"
        />
      </header>

      {/* Main Content */}
      <main className="home-main">
        {/* Left Section */}
        <div className="content-left flex flex-col gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-[#666] leading-tight">
            Descubre lo mas reciente en avances tecnologicos de nuestra empresa
          </h1>
          <p className="text-xl lg:text-2xl text-[#E66B27] font-semibold">
            Aqui podras encontrar los proyectos mas relevantes de todas nuestras plataformas.
          </p>
          <div className="mt-4">
            <button
              onClick={onViewDoc}
              className="conoce-mas-btn"
            >
              Conoce Más
            </button>
          </div>
        </div>

        {/* Right Section: Infinite Vertical Carousel */}
        <div className="content-right">
          <div className="carousel-container w-full max-w-md">
            <div className="carousel-track">
              {carouselLogos.map((logo, index) => (
                <div key={index} className="logo-item">
                  <img src={logo} alt={`Logo ${index}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer" />
    </div>
  )
}
