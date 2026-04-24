import { useState, useCallback, useEffect } from 'react'
import slides from './data/slides.json'
import Slide from './components/Slide.jsx'
import SplashScreen from './components/SplashScreen.jsx'

export default function App() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showSplash, setShowSplash] = useState(true)
  const total = slides.length

  const goTo = useCallback(
    (newIndex, dir) => {
      setDirection(dir)
      setIndex(((newIndex % total) + total) % total)
    },
    [total],
  )

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  useEffect(() => {
    if (showSplash) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, showSplash])

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      data-testid="carousel-root"
    >
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
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </div>
  )
}
