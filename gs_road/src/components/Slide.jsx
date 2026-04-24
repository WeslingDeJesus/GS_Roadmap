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

export default function Slide({
    slide,
    isActive,
    direction,
    onPrev,
    onNext,
    currentIndex,
    total,
}) {
    const { theme, title, description, coverImage, exploreUrl, logoName } = slide

    const translate = isActive ? '0%' : direction > 0 ? '-8%' : '8%'
    const dynamicGlassBg = getGlassBg(theme.background)

    return (
        <section
            className="absolute inset-0 transition-all duration-700 ease-out font-sans"
            style={{
                transform: `translateX(${translate})`,
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                backgroundColor: dynamicGlassBg,
            }}
            aria-hidden={!isActive}
            data-testid={`slide-${slide.id}`}
        >
            {/* Right half: cover image */}
            <div
                className="absolute top-0 right-0 h-full w-1/2 overflow-hidden"
                data-testid={`cover-${slide.id}`}
            >
                <img
                    src={coverImage}
                    alt={`Portada ${logoName}`}
                    className="h-full w-full object-cover object-left select-none"
                    draggable="false"
                />
            </div>

            {/* Left half: theme-color background with content */}
            <div className="absolute top-0 left-0 h-full w-1/2 flex flex-col px-10 lg:px-16 py-8">
                {/* Logo container (glass card) */}
                <div
                    className="self-start rounded-2xl px-4 py-3 backdrop-blur-md flex items-center gap-3"
                    style={{
                        backgroundColor: dynamicGlassBg,
                        border: GLASS_BORDER,
                        boxShadow: GLASS_SHADOW,
                    }}
                    data-testid="logo-container"
                >
                    <LogoPlaceholder name={logoName} theme={theme} size={48} />
                    <span
                        className="font-semibold tracking-wide text-sm uppercase"
                        style={{ color: '#FFFFFF' }}
                    >
                        {logoName}
                    </span>
                </div>

                {/* Title (on colored background) */}
                <h1
                    className="mt-8 text-4xl lg:text-5xl font-extrabold leading-[1.05]"
                    style={{ color: theme.onBackground }}
                    data-testid="slide-title"
                >
                    {title}
                </h1>

                {/* Subheading */}
                <h2
                    className="mt-4 text-xl lg:text-2xl font-semibold italic"
                    style={{ color: theme.onBackground, opacity: 0.95 }}
                >
                    ¿De qué trata?
                </h2>

                {/* Scrollable description (glass card) */}
                <div
                    className="desc-scroll mt-4 flex-1 min-h-0 overflow-y-auto rounded-2xl p-5 backdrop-blur-md text-[15px] leading-relaxed"
                    style={{
                        backgroundColor: dynamicGlassBg,
                        boxShadow: GLASS_SHADOW,
                        color: '#FFFFFF',
                        ['--scroll-thumb']: theme.accent,
                    }}
                    data-testid="slide-description"
                >
                    <p className="whitespace-pre-line text-justify">{description}</p>
                </div>

                {/* Navigation row */}
                <div className="mt-6 flex items-center justify-between gap-4 shrink-0">
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
                        className="flex-1 text-center rounded-full px-8 py-3 font-semibold text-base uppercase tracking-wider transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            backgroundColor: theme.buttonBg,
                            color: theme.buttonText,
                            boxShadow:
                                '0 12px 28px -8px rgba(0,0,0,0.45), 0 4px 10px -4px rgba(0,0,0,0.25)',
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
                    className="mt-3 text-xs font-medium text-center tracking-widest"
                    style={{ color: theme.onBackground, opacity: 0.85 }}
                    data-testid="pagination-indicator"
                >
                    {String(currentIndex + 1).padStart(2, '0')} /{' '}
                    {String(total).padStart(2, '0')}
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
