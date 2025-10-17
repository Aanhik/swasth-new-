"use client"

import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function RouteLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = React.useState(false)
  const [exiting, setExiting] = React.useState(false)
  const hideTimeoutRef = React.useRef<number | null>(null)
  const showTimeoutRef = React.useRef<number | null>(null)
  const prevRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    const current = pathname + (searchParams ? '?' + searchParams.toString() : '')
    if (prevRef.current && prevRef.current !== current) {
      // navigation completed: start exit animation and then hide overlay
      if (showTimeoutRef.current) {
        window.clearTimeout(showTimeoutRef.current)
        showTimeoutRef.current = null
      }
      setExiting(true)
      hideTimeoutRef.current = window.setTimeout(() => {
        setVisible(false)
        setExiting(false)
      }, 300) // match CSS transition duration
    }

    prevRef.current = current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  // start overlay on internal link clicks to make UI feel responsive
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      // only left-clicks without modifier keys
      if (e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
      const target = e.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest && (target.closest('a') as HTMLAnchorElement | null)
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      // same-origin check (relative links or absolute same-origin)
      try {
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return
      } catch {
        return
      }

      // show overlay with a small delay anchor click -> visible
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      if (!visible) {
        showTimeoutRef.current = window.setTimeout(() => setVisible(true), 60)
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // show nothing until visible is true
  if (!visible) return null

  // animated overlay: fade/scale transition
  return (
    <div aria-hidden className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/75 backdrop-blur-md transition-opacity duration-300 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`flex flex-col items-center gap-4 transform transition-all duration-300 ${exiting ? 'scale-95' : 'scale-100'}`}>
        <Image src="/images/logo1.png" alt="SWASTH logo" width={84} height={84} className="animate-bounce" priority />
        <div className="text-center">
          <p className="font-semibold text-lg text-[#2E7D32]">Loading</p>
          <p className="text-sm text-muted-foreground">Preparing your health space...</p>
        </div>
      </div>
    </div>
  )
}
