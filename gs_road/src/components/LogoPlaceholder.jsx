export default function LogoPlaceholder({ name, theme, size = 56 }) {
    // Circular logo placeholder - shows first letter of each word (up to 2)
    const initials = name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <div
            className="flex items-center justify-center rounded-full font-bold select-none shrink-0 shadow-md ring-2"
            style={{
                width: size,
                height: size,
                backgroundColor: theme.logoBg,
                color: theme.logoText,
                fontSize: size * 0.34,
                letterSpacing: '0.02em',
                borderColor: theme.logoText,
                outline: `2px solid ${theme.accent}`,
            }}
            data-testid={`logo-${name.toLowerCase().replace(/\s+/g, '-')}`}
            aria-label={`Logo ${name}`}
        >
            {initials}
        </div>
    )
}
