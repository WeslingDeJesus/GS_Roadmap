import React, { useState, useRef } from 'react'
import ProjectCard from './ProjectCard.jsx'
import { PLATFORM_ORDER } from '../utils/themeMapper.js'

export default function AllProjects({ slides, onSelectSlide, onBack }) {
  const [filter, setFilter] = useState('Todos')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: true, right: false })
  const buttonRef = useRef(null)

  const toggleFilter = () => {
    if (!isFilterOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceRight = window.innerWidth - rect.left

      setDropdownPosition({
        top: spaceBelow < 250, // if less than 250px below, open upwards
        right: spaceRight < 200, // if less than 200px right, align to right edge
      })
    }
    setIsFilterOpen(!isFilterOpen)
  }

  // Opciones dinámicas derivadas de los datos reales, ordenadas canónicamente
  const filterOptions = [
    { key: 'Todos', label: 'Todos' },
    ...Array.from(
      slides.reduce((map, slide) => {
        if (!map.has(slide.logoName)) map.set(slide.logoName, slide.logoName)
        return map
      }, new Map())
    )
      .map(([key]) => ({ key, label: key }))
      .sort((a, b) => {
        const ai = PLATFORM_ORDER.indexOf(a.key)
        const bi = PLATFORM_ORDER.indexOf(b.key)
        const ar = ai === -1 ? 999 : ai
        const br = bi === -1 ? 999 : bi
        return ar - br
      })
  ]

  // La etiqueta visible del filtro activo
  const activeLabel = filterOptions.find(o => o.key === filter)?.label || 'Todos'

  const filteredSlides = filter === 'Todos'
    ? slides
    : slides.filter(slide => slide.logoName === filter)

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-black">
      {/* Background with heavy blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/bg-team.png')` }}
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      {/* Logo */}
      <div className="absolute top-4 left-6 lg:top-8 lg:left-10 z-20">
        <img src="logos/gs_roadmap.png" alt="General Roadmap" className="h-12 lg:h-16 object-contain" />
      </div>

      {/* Header/Title - Optional if we just want the cards */}
      <div className="relative z-10 pt-20 lg:pt-24 pb-4 px-10 text-center">
        <h2 className="text-3xl text-white font-bold">Todos los Proyectos</h2>
        {filter !== 'Todos' && <p className="text-gray-300 mt-2">Filtrando por: {activeLabel}</p>}
      </div>

      {/* Scrollable Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto px-10 pb-32 custom-scrollbar">
        {filteredSlides.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
            {filteredSlides.map((slide) => (
              <ProjectCard
                key={slide.id}
                slide={slide}
                onClick={() => onSelectSlide(slide.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xl">
            No hay proyectos para esta plataforma.
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex justify-center gap-6">
        <button
          onClick={onBack}
          className="bg-[#E66B27] hover:bg-[#c95b1f] text-white font-bold py-3 px-12 rounded-full transition-colors text-lg shadow-lg"
        >
          Volver
        </button>

        <div className="relative" ref={buttonRef}>
          <button
            onClick={toggleFilter}
            className="bg-[#E66B27] hover:bg-[#c95b1f] text-white font-bold py-3 px-12 rounded-full transition-colors text-lg shadow-lg min-w-[160px] w-full sm:w-auto"
          >
            Filtrar
          </button>

          {isFilterOpen && (
            <div 
              className={`absolute ${dropdownPosition.top ? 'bottom-full mb-2' : 'top-full mt-2'} ${dropdownPosition.right ? 'right-0' : 'left-0'} w-max min-w-full bg-white text-black rounded-lg shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto`}
            >
              {filterOptions.map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => {
                    setFilter(key)
                    setIsFilterOpen(false)
                  }}
                  className={`px-4 py-3 cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap
                    ${filter === key ? 'bg-[#a5a5a5] text-white' : 'hover:bg-[#AF161C] hover:text-white'}
                  `}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
