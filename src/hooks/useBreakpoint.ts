import { useState, useEffect } from 'react'

/**
 * Hook para detectar breakpoint atual do viewport
 * @returns {object} - { isMobile, isDesktop }
 */
export function useBreakpoint() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile,
    isDesktop: !isMobile
  }
}
