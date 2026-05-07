import React, { useState } from 'react'

export default function LogoPlaceholder({ name, theme, size = 56, imageUrl, bgColor, textColor, borderColor, borderWidth = 2 }) {
    const [error, setError] = useState(false)

    // Circular logo placeholder - shows first letter of each word (up to 2)
    const initials = name
        ? name
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '?'

    return (
        <div
            className="flex items-center justify-center rounded-full font-bold select-none shrink-0 shadow-md ring-1 ring-white/20 overflow-hidden"
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor || theme?.background || '#E66B27',
                color: textColor || '#FFFFFF',
                fontSize: size * 0.35,
                letterSpacing: '0.02em',
                border: borderColor ? `${borderWidth}px solid ${borderColor}` : 'none'
            }}
            data-testid={`logo-${name?.toLowerCase().replace(/\s+/g, '-')}`}
            aria-label={`Logo ${name}`}
        >
            {imageUrl && !error ? (
                <img
                    src={imageUrl}
                    alt={`Logo ${name}`}
                    className="w-full h-full object-contain p-1.5"
                    onError={() => setError(true)}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    )
}
