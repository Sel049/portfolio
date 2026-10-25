import React, { useEffect, useState } from 'react'

interface ProgressBarProps {
  /** 0–100 */
  value: number
  /** Accessible label for screen readers */
  label: string
  /** Animate fill on mount */
  animate?: boolean
}

export default function ProgressBar({ value, label, animate = false }: ProgressBarProps) {
  // Clamp value to [0, 100] per Req 7.4
  const clampedValue = Math.min(100, Math.max(0, value))

  const [displayWidth, setDisplayWidth] = useState(animate ? 0 : clampedValue)

  useEffect(() => {
    if (!animate) {
      setDisplayWidth(clampedValue)
      return
    }
    // Trigger animation on mount by updating after initial render
    const frameId = requestAnimationFrame(() => {
      setDisplayWidth(clampedValue)
    })
    return () => cancelAnimationFrame(frameId)
  }, [clampedValue, animate])

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden"
    >
      <div
        className="h-full rounded-full bg-green-primary transition-all duration-700 ease-out"
        style={{ width: `${displayWidth}%` }}
      />
    </div>
  )
}
