import LogoPlaceholder from './LogoPlaceholder.jsx'

const GLASS_BORDER = '1px solid rgba(255, 255, 255, 0.55)'
const GLASS_SHADOW =
    '0 20px 45px -15px rgba(0, 0, 0, 0.35), 0 8px 18px -6px rgba(0, 0, 0, 0.22)'

const getGlassBg = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.75)`
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    // Reemplazamos '-' por '/' para que JS lo trate como hora local y no UTC
    const date = new Date(dateStr.replace(/-/g, '\/'))
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export default function Slide({
    slide,
    isActive,
    direction,
    onPrev,
    onNext,
    currentIndex,
    total,
}) {
    const { theme, title, description, coverImage, exploreUrl, logoName, logoUrl, fecha } = slide

    const translate = isActive ? '0%' : direction > 0 ? '-8%' : '8%'
    const dynamicGlassBg = getGlassBg(theme.background)

    return (
        <section
            className="absolute inset-0 transition-all duration-700 ease-out font-sans overflow-y-auto lg:overflow-hidden"
            style={{
                transform: `translateX(${translate})`,
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                backgroundColor: dynamicGlassBg,
            }}
            aria-hidden={!isActive}
            data-testid={`slide-${slide.id}`}
        >
            {/* Right/Top: cover image */}
            <div
                className="relative lg:absolute top-0 right-0 h-[35vh] lg:h-full w-full lg:w-1/2 overflow-hidden"
                data-testid={`cover-${slide.id}`}
            >
                <img
                    src={coverImage}
                    alt={`Portada ${logoName}`}
                    className="h-full w-full object-cover object-center lg:object-left select-none"
                    draggable="false"
                    onError={(e) => {
                        e.target.src = '/fondoDefault.png';
                        e.target.onerror = null;
                    }}
                />
                {/* Gradient overlay for mobile image transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
            </div>

            {/* Left/Bottom: content panel */}
            <div
                className="relative lg:absolute top-0 left-0 h-auto min-h-[65vh] lg:h-full w-full lg:w-1/2 flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-10 z-10 overflow-y-auto lg:overflow-visible"
                style={{
                    boxShadow: window.innerWidth > 1024 ? `25px 0 60px 10px ${theme.background}73` : 'none'
                }}
            >
                {/* Header Row: Platform Name (left) and Logo (right) */}
                <div className="flex items-center justify-between w-full shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Platform Name (glass pill) */}
                        <div
                            className="rounded-full px-4 sm:px-5 py-2 backdrop-blur-md border"
                            style={{
                                backgroundColor: dynamicGlassBg,
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                boxShadow: GLASS_SHADOW,
                            }}
                        >
                            <span className="font-bold tracking-widest text-[10px] sm:text-xs uppercase text-white">
                                {logoName}
                            </span>
                        </div>

                    </div>

                    {/* Logo (circular) */}
                    <LogoPlaceholder 
                        name={logoName} 
                        theme={theme} 
                        size={window.innerWidth > 640 ? 52 : 44} 
                        imageUrl={logoUrl} 
                        bgColor="#FFFFFF"
                        textColor={theme.background}
                    />
                </div>

                {/* Date Label */}
                {fecha && (
                    <p 
                        className="mt-6 sm:mt-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-80"
                        style={{ color: theme.onBackground }}
                    >
                        {formatDate(fecha)}
                    </p>
                )}

                {/* Title (on colored background) */}
                <h1
                    className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight"
                    style={{ color: theme.onBackground }}
                    data-testid="slide-title"
                >
                    {title}
                </h1>

                {/* Subheading */}
                <h2
                    className="mt-4 text-lg sm:text-xl lg:text-2xl font-bold italic opacity-90"
                    style={{ color: theme.onBackground }}
                >
                    ¿De qué trata?
                </h2>

                {/* Description (glass card) */}
                <div
                    className="desc-scroll mt-4 flex-1 min-h-0 overflow-y-auto lg:overflow-y-auto rounded-2xl p-5 sm:p-6 backdrop-blur-md text-sm sm:text-base leading-relaxed mb-6 lg:mb-0"
                    style={{
                        backgroundColor: dynamicGlassBg,
                        boxShadow: GLASS_SHADOW,
                        color: '#FFFFFF',
                        ['--scroll-thumb']: theme.accent,
                    }}
                    data-testid="slide-description"
                >
                    <div 
                        className="text-justify font-medium opacity-95"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>

                {/* Navigation row (Desktop hidden if we want, but keeping it for consistency) */}
                <div className="mt-auto lg:mt-6 flex items-center justify-between gap-4 shrink-0 pb-10 lg:pb-0">
                    <NavArrow
                        direction="left"
                        onClick={onPrev}
                        theme={theme}
                        testid="nav-prev"
                    />

                    <a
                        href={exploreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center rounded-full px-6 sm:px-10 py-3.5 font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                        style={{
                            backgroundColor: theme.buttonBg,
                            color: theme.buttonText,
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                        }}
                        data-testid="explore-button"
                    >
                        Explorar
                    </a>

                    <NavArrow
                        direction="right"
                        onClick={onNext}
                        theme={theme}
                        testid="nav-next"
                    />
                </div>

                {/* Pagination indicator */}
                <div
                    className="mt-4 lg:mt-3 text-[10px] font-black text-center tracking-[0.3em] uppercase opacity-60"
                    style={{ color: theme.onBackground }}
                    data-testid="pagination-indicator"
                >
                    {String(currentIndex + 1).padStart(2, '0')} <span className="mx-1">/</span> {String(total).padStart(2, '0')}
                </div>
            </div>
        </section>
    )
}

function NavArrow({ direction, onClick, theme, testid }) {
    const isLeft = direction === 'left'
    const dynamicGlassBg = getGlassBg(theme.background)
    return (
        <button
            type="button"
            onClick={onClick}
            className="shrink-0 rounded-full h-12 w-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-md"
            style={{
                backgroundColor: dynamicGlassBg,
                border: GLASS_BORDER,
                color: theme.onSurface,
                boxShadow: GLASS_SHADOW,
            }}
            aria-label={isLeft ? 'Anterior' : 'Siguiente'}
            data-testid={testid}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {isLeft ? (
                    <polyline points="15 18 9 12 15 6" />
                ) : (
                    <polyline points="9 18 15 12 9 6" />
                )}
            </svg>
        </button>
    )
}
