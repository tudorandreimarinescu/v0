"use client"

import { useTranslations } from "next-intl"

export default function HeroContent() {
  const t = useTranslations()

  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm mb-4 relative border border-white/20"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
          <span className="text-white text-xs font-light relative z-10">✨ New Paper Shaders Experience</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          <span className="font-medium italic instrument">Beautiful</span> Shader
          <br />
          <span className="font-light tracking-tight text-white">Experiences</span>
        </h1>

        {/* Description */}
        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed">
          Transform your creative projects with our premium collection of paper-inspired shader effects. Perfect for web
          design, digital art, and interactive experiences.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <button className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
            View Gallery
          </button>
          <button className="px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer">
            Explore Shaders
          </button>
        </div>
      </div>
    </main>
  )
}
