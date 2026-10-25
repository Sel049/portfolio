import React from 'react'
import { useCarousel } from '../../hooks/useCarousel'

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  /** Auto-advance interval in ms; 0 = disabled */
  autoPlayInterval?: number
  className?: string
}

export default function Carousel<T>({
  items,
  renderItem,
  autoPlayInterval = 0,
  className,
}: CarouselProps<T>) {
  const { activeIndex, next, prev, goTo, pauseAutoPlay, resumeAutoPlay } =
    useCarousel(items.length, autoPlayInterval)

  return (
    <div
      className={`relative overflow-hidden${className ? ` ${className}` : ''}`}
      onMouseEnter={() => autoPlayInterval > 0 && pauseAutoPlay()}
      onMouseLeave={() => autoPlayInterval > 0 && resumeAutoPlay()}
    >
      {/* Slide track */}
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="min-w-full"
            aria-hidden={i !== activeIndex}
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {/* Previous button */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-bg-elevated/80 text-text-primary hover:bg-bg-elevated transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-bg-elevated/80 text-text-primary hover:bg-bg-elevated transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7.5 5L12.5 10L7.5 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dot indicators */}
      <div
        role="tablist"
        aria-label="Slide navigation"
        className="flex justify-center gap-2 mt-4"
      >
        {items.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`focus-ring w-2 h-2 rounded-full transition-colors${
              i === activeIndex
                ? ' bg-green-primary'
                : ' bg-text-muted hover:bg-text-secondary'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
