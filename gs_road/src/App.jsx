import { useState, useCallback, useEffect, useMemo } from 'react'
import { getProyectos } from './api/proyectos_api.js'
import { getThemeForPlatform, getPlatformName } from './utils/themeMapper.js'
import Slide from './components/Slide.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import Home from './components/Home.jsx'
import AllProjects from './components/AllProjects.jsx'
import DocMode from './components/DocMode.jsx'

export default function App() {
  const [slides, setSlides] = useState([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showSplash, setShowSplash] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('home') // 'home', 'all', 'slider'

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await getProyectos()
        // La API devuelve los datos dentro de la propiedad "data"
        const projectArray = response.data || []

        // Map the API data to the format expected by the Slide component
        // 1. Mapear cada hito con sus campos normalizados
        const mappedItems = projectArray.map((item, idx) => {
          const plataforma = item.rmp_plataforma || 'UNKNOWN'

          // Lógica de logos:
          // Si tieneLogo es true/1 usa logoBase desde rmp_plataforma
          // Si no usa logo desde rmp_proyecto (comportamiento original)
          const tieneLogo = Number(item.tieneLogo) === 1 || item.tieneLogo === true || item.tieneLogo === "1";

          const logoUrl = tieneLogo
            ? `${import.meta.env.VITE_API_URL}/files/rmp_plataforma/logoBase/${item.rmp_plataforma}/${item.logoBase || 'logoBase.png'}`
            : `${import.meta.env.VITE_API_URL}/files/rmp_proyecto/logo/${item.id_proyecto || item.id}/${item.logo || 'logo.png'}`;

          const logoSource = tieneLogo ? (item.logoBase || 'logoBase.png') : (item.logo || 'logo.png');

          return {
            ...item,
            id: item.id || `slide-${idx}`,
            title: item.nombre || 'Proyecto sin título',
            description: item.descripcion_lg || item.descripcion_ct || 'Sin descripción',
            coverImage: `${import.meta.env.VITE_API_URL}/files/rmp_hitos/portada/${item.id}/portada.png`,
            exploreUrl: item.link || '#',
            logoName: getPlatformName(plataforma, item.plataforma) || logoSource || plataforma,
            logoUrl: logoUrl,
            theme: getThemeForPlatform(plataforma, item.color, item.colorAcent),
            _projectKey: item.id_proyecto
              ? `${item.id_proyecto}`
              : getPlatformName(plataforma, item.plataforma) || plataforma, // clave normalizada por proyecto
            _hitoId: Number(item.id) || idx, // numérico para ordenar (más alto = más reciente)
          }
        })

        mappedItems.sort((a, b) => {
          const scoreA = Number(a.residual || a.residuo || 0);
          const scoreB = Number(b.residual || b.residuo || 0);
          return scoreB - scoreA;
        });

        // Asignamos los hitos respetando estrictamente el orden proporcionado por el API/VIEW
        setSlides(mappedItems)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProyectos()
  }, [])

  const total = slides.length

  // Un representante por proyecto (el hito más reciente, que ya es el primero de su grupo)
  const projects = useMemo(() => {
    const seen = new Set()
    return slides.filter(slide => {
      const key = slide._projectKey
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [slides])

  // Dado el id de un slide, encuentra su índice en el array completo
  const slideIndexById = useCallback(
    (slideId) => slides.findIndex(s => s.id === slideId),
    [slides]
  )

  const goTo = useCallback(
    (newIndex, dir) => {
      if (total === 0) return
      setDirection(dir)
      setIndex(((newIndex % total) + total) % total)
    },
    [total],
  )

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  useEffect(() => {
    if (showSplash || total === 0) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, showSplash, total])

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-red-50 text-red-600">
        <p className="text-xl font-semibold">Error al cargar proyectos: {error}</p>
      </div>
    )
  }

  if (view === 'doc') {
    return (
      <div key={view} className="screen-fade-in h-full w-full">
        <DocMode
          slides={slides}
          onGoToBlog={() => setView('slider')}
          onBack={() => setView('home')}
        />
      </div>
    )
  }

  if (view === 'home') {
    return (
      <div key={view} className="screen-fade-in h-full w-full">
        <Home
          slides={projects}
          onSelectSlide={(slideId) => { const i = slideIndexById(slideId); if (i !== -1) { setIndex(i); setView('slider') } }}
          onViewAll={() => setView('all')}
          onViewDoc={() => setView('doc')}
        />
        {(showSplash || loading) && <SplashScreen onFinish={() => !loading && setShowSplash(false)} />}
      </div>
    )
  }

  if (view === 'all') {
    return (
      <div key={view} className="screen-fade-in h-full w-full">
        <AllProjects
          slides={projects}
          onSelectSlide={(slideId) => { const i = slideIndexById(slideId); if (i !== -1) { setIndex(i); setView('slider') } }}
          onBack={() => setView('home')}
        />
      </div>
    )
  }

  return (
    <div
      key={view}
      className="relative h-screen w-screen overflow-hidden screen-fade-in"
      data-testid="carousel-root"
    >
      {/* Botón de volver al Home en la esquina superior derecha */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={() => setView('doc')}
          className="bg-black/50 hover:bg-black/80 text-white py-2 px-3 sm:px-4 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold hidden sm:inline">Volver</span>
        </button>
      </div>

      {slides.map((slide, i) => (
        <Slide
          key={slide.id}
          slide={slide}
          isActive={i === index}
          direction={direction}
          onPrev={prev}
          onNext={next}
          currentIndex={index}
          total={total}
        />
      ))}
    </div>
  )
}
