import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
    const [hiding, setHiding] = useState(false)

    useEffect(() => {
        // Start fade-out after the logo has been visible for a moment
        const hideTimer = setTimeout(() => setHiding(true), 1900)
        // Remove splash from DOM after fade-out completes
        const finishTimer = setTimeout(() => onFinish?.(), 2700)
        return () => {
            clearTimeout(hideTimer)
            clearTimeout(finishTimer)
        }
    }, [onFinish])

    return (
        <div
            className={`splash-root ${hiding ? 'splash-hide' : ''}`}
            data-testid="splash-screen"
            aria-hidden={hiding}
        >
            <img
                src="/logos/gs_roadmap.png"
                alt="GS General Roadmap"
                className="splash-logo"
                draggable="false"
            />
        </div>
    )
}
