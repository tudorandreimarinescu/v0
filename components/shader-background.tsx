"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            isActive ? "opacity-80" : "opacity-60"
          }`}
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 27, 75, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%)
            `,
          }}
        />
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-2000 ${
            isActive ? "scale-110 opacity-40" : "scale-100 opacity-20"
          }`}
          style={{
            background: `
              conic-gradient(from 0deg at 50% 50%, 
                rgba(139, 92, 246, 0.1) 0deg, 
                transparent 60deg, 
                rgba(139, 92, 246, 0.05) 120deg, 
                transparent 180deg, 
                rgba(139, 92, 246, 0.1) 240deg, 
                transparent 300deg, 
                rgba(139, 92, 246, 0.05) 360deg
              )
            `,
          }}
        />
      </div>

      {children}
    </div>
  )
}
