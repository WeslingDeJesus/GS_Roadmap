import React from 'react'

export default function ProjectCard({ slide, onClick }) {
  const { title, coverImage, theme, descripcion_ct } = slide

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-full aspect-[3/4] max-h-[350px] sm:max-h-[280px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 bg-white"
    >
      {/* Cover Image */}
      <img
        src={coverImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.target.src = '/covers/default.png'
        }}
      />

      {/* Top Left Theme Shape */}
      <div
        className="absolute top-0 left-0 w-[45%] aspect-square z-10 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          backgroundColor: theme?.background || '#333',
          borderBottomRightRadius: '100%',
        }}
      />

      {/* Hover Overlay */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, ${theme?.background || '#1a1a1a'}ee 0%, ${theme?.background || '#1a1a1a'}99 50%, transparent 100%)`,
        }}
      >
        {/* Content slides up on hover */}
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
          {/* Project name */}
          <p className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow">
            {title}
          </p>

          {/* Descripcion del hito */}
          {descripcion_ct && (
            <p
              className="mt-1 text-xs leading-snug line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75"
              style={{ color: theme?.onBackground || '#ffffffcc' }}
            >
              {descripcion_ct}
            </p>
          )}

          {/* Ver más CTA */}
          <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: theme?.buttonText || '#fff' }}
            >
              Ver más
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: theme?.buttonText || '#fff' }}
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
