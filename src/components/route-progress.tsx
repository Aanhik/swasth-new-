"use client"

import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Minimal top progress bar for route changes using useNavigation state.
export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const intervalRef = React.useRef<number | null>(null)
  const prevRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    const current = pathname + (searchParams ? '?' + searchParams.toString() : '')
    if (prevRef.current && prevRef.current !== current) {
      // navigation happened
      setVisible(true)
      setProgress(30)
      intervalRef.current = window.setInterval(() => {
        setProgress(p => Math.min(95, p + Math.random() * 10))
      }, 300)

      // finalize shortly after
      const finish = window.setTimeout(() => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setProgress(100)
        const hide = window.setTimeout(() => {
          setVisible(false)
          setProgress(0)
        }, 250)
        return () => window.clearTimeout(hide)
      }, 300)

      return () => {
        window.clearTimeout(finish)
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current)
        }
      }
    }

    prevRef.current = current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  if (!visible) return null

  return (
    <div aria-hidden className="fixed top-0 left-0 right-0 h-0 pointer-events-none z-50">
      <div style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left' }} className="h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 will-change-transform transition-transform duration-150" />
    </div>
  )
}
