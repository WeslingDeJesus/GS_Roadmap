import React, { useState, useMemo } from 'react'
import { PLATFORM_ORDER } from '../utils/themeMapper.js'
import LogoPlaceholder from './LogoPlaceholder.jsx'

const TIME_FILTERS = [
  { key: 'all', label: 'TODOS' },
  { key: 'month', label: 'ESTE MES' },
  { key: '3months', label: 'ULTIMOS 3 MESES' },
  { key: 'year', label: 'ESTE AÑO' },
]

function filterByTime(projects, timeFilter) {
  if (timeFilter === 'all') return projects
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return projects.filter(p => {
    const raw = p.rmp_fecha || p.fecha_creacion || p.fecha
    if (!raw) return true
    const date = new Date(raw)

    if (timeFilter === 'month') {
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }
    if (timeFilter === '3months') {
      const cutoff = new Date()
      cutoff.setDate(now.getDate() - 90)
      return date >= cutoff
    }
    if (timeFilter === 'year') {
      return date.getFullYear() === currentYear
    }
    return true
  })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  // Reemplazamos '-' por '/' para evitar el desfase de zona horaria (UTC vs Local)
  const date = new Date(dateStr.replace(/-/g, '\/'))
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export default function DocMode({ slides, onBack, onGoToBlog }) {
  const [timeFilter, setTimeFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State for mobile sidebar

  /* Proyectos en el orden proporcionado por la API */
  const allProjects = useMemo(() => {
    const projectMap = new Map()

    // Agrupar proyectos manteniendo el orden de la API (primera aparición)
    slides.forEach(s => {
      if (!projectMap.has(s._projectKey)) {
        projectMap.set(s._projectKey, s)
      }
    })

    return Array.from(projectMap.values())
  }, [slides])

  const activeKey = selectedKey || allProjects[0]?._projectKey
  const activeProject = allProjects.find(p => p._projectKey === activeKey) || allProjects[0]

  /* Hitos del proyecto activo filtrados por el tiempo seleccionado */
  const hitos = useMemo(() => {
    const projectHitos = slides.filter(s => s._projectKey === activeKey)
    return filterByTime(projectHitos, timeFilter)
  }, [slides, activeKey, timeFilter])

  const accentColor = activeProject?.theme?.background || '#E66B27'

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* --- SIDEBAR OVERLAY (Mobile) --- */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header (Mobile) */}
        <div className="lg:hidden p-6 flex items-center justify-between border-b border-gray-100">
          <img src="logos/gs_roadmap.png" alt="Logo" className="h-8 object-contain brightness-0" />
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>


        {/* Mobile Filters */}
        <div className="lg:hidden p-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            {TIME_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setTimeFilter(f.key)}
                className={`px-2 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border
                  ${timeFilter === f.key
                    ? 'bg-[#E66B27] text-white border-[#E66B27] shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {allProjects.map(project => {
            const isActive = project._projectKey === activeKey
            return (
              <button
                key={project._projectKey}
                onClick={() => {
                  setSelectedKey(project._projectKey);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full text-left flex items-center gap-4 px-6 py-5 border-b border-gray-50 transition-all group
                  ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50/50'}
                `}
              >
                <LogoPlaceholder
                  name={project.logoName}
                  theme={project.theme}
                  size={32}
                  imageUrl={project.logoUrl}
                  bgColor="#FFFFFF"
                  textColor={project.theme?.background || '#E66B27'}
                  borderColor={project.theme?.background || '#E66B27'}
                  borderWidth={1.5}
                />
                <span className={`text-sm leading-snug line-clamp-2 transition-colors ${isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-500 group-hover:text-gray-700'}`}>
                  {project.title}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Footer logo */}
        <div className="p-6 border-t border-gray-100 flex flex-col items-center gap-4">
          <img src="logos/gs_roadmap.png" alt="GS Roadmap" className="h-10 object-contain brightness-0" />
          <button
            onClick={onBack}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cerrar Documentación
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 lg:px-12 py-4 bg-white border-b border-gray-200 shadow-sm z-30">

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 lg:hidden text-gray-500 hover:text-gray-900"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Filter Buttons in Header */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-full border border-gray-200">
            {TIME_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setTimeFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all
                  ${timeFilter === f.key
                    ? 'bg-white text-[#E66B27] shadow-sm scale-105'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={onGoToBlog}
            className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="hidden sm:inline">Modo Presentación</span>
          </button>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeProject ? (
            <div className="max-w-4xl mx-auto px-6 py-10 lg:py-16">

              {/* Project header */}
              <div className="mb-12 border-b border-gray-100 pb-12">
                <div className="flex items-center gap-4 mb-6">
                  <LogoPlaceholder
                    name={activeProject.logoName}
                    theme={activeProject.theme}
                    size={48}
                    imageUrl={activeProject.logoUrl}
                    bgColor="#FFFFFF"
                    textColor={accentColor}
                    borderColor={accentColor}
                    borderWidth={2}
                  />
                  <span
                    className="px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ backgroundColor: accentColor }}
                  >
                    {activeProject.logoName}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight" style={{ color: accentColor }}>
                  {activeProject.title}
                </h1>
                <p className="mt-6 text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">
                  Descubre todos los hitos y avances tecnológicos realizados en este proyecto.
                </p>
              </div>

              {/* Hitos */}
              <div className="space-y-20 w-full">
                {hitos.length === 0 && (
                  <p className="py-20 text-center text-gray-400 italic">No se encontraron hitos en este periodo para este proyecto</p>
                )}
                {hitos.map((hito, idx) => (
                  <article
                    key={hito.id}
                    className="relative pl-0 lg:pl-10"
                  >
                    {/* Hito counter badge */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ backgroundColor: accentColor }}>
                        {idx + 1}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Platform Label */}
                        <span
                          className="px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]"
                          style={{ backgroundColor: accentColor }}
                        >
                          {activeProject.logoName}
                        </span>
                      </div>
                    </div>

                    {hito.descripcion_ct && (
                      <div className="mb-6">
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                          {hito.descripcion_ct}
                        </h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                          {formatDate(hito.rmp_fecha || hito.fecha_creacion || hito.fecha)}
                        </p>
                      </div>
                    )}

                    {hito.coverImage && (
                      <div
                        className="mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-black/5 border border-gray-100 group"
                      >
                        <img
                          src={hito.coverImage}
                          alt={hito.descripcion_ct || hito.title}
                          className="w-full object-cover h-[250px] lg:h-[250px] transition-transform duration-700 group-hover:scale-105"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      </div>
                    )}

                    {hito.description && (
                      <div className="prose prose-gray max-w-none">
                        <div
                          className="text-gray-600 leading-relaxed text-base lg:text-lg text-justify font-medium"
                          dangerouslySetInnerHTML={{ __html: hito.description }}
                        />
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <div className="h-32" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-20">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-xl font-bold uppercase tracking-widest opacity-20">Selecciona un proyecto</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
