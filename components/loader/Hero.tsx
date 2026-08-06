"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useSiteConfig } from "@/hooks/use-site-config"
import { GoldDust } from "@/components/loader/GoldDust"

interface HeroProps {
  onOpen: () => void
  visible: boolean
}

const textColor = "var(--color-motif-cream)"

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const siteConfig = useSiteConfig()
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setContentVisible(true), 200)
      return () => clearTimeout(timer)
    }
    setContentVisible(false)
  }, [visible])

  return (
    <div
      className={`invite-gate-backdrop fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <GoldDust />
      <div className="invite-gate-vignette pointer-events-none absolute inset-0" aria-hidden />

      {/* Champagne floral corners */}
      <Image
        src="/decoration/top-left-corner.png"
        alt=""
        width={901}
        height={1186}
        className="absolute top-0 left-0 pointer-events-none select-none w-28 opacity-80 sm:w-40 md:w-48 lg:w-56"
        aria-hidden
      />
      <Image
        src="/decoration/top-right-corner.png"
        alt=""
        width={901}
        height={1186}
        className="absolute top-0 right-0 pointer-events-none select-none w-28 opacity-80 sm:w-40 md:w-48 lg:w-56"
        aria-hidden
      />
      <Image
        src="/decoration/bottom-left-corner.png"
        alt=""
        width={901}
        height={1186}
        className="absolute bottom-0 left-0 pointer-events-none select-none w-28 opacity-70 sm:w-40 md:w-48 lg:w-56"
        aria-hidden
      />
      <Image
        src="/decoration/bottom-right-corner.png"
        alt=""
        width={901}
        height={1186}
        className="absolute bottom-0 right-0 pointer-events-none select-none w-28 opacity-70 sm:w-40 md:w-48 lg:w-56"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col items-center justify-center px-6 py-10 text-center">
        {/* Monogram */}
        <div
          className={`mb-8 transition-all duration-1000 ease-out sm:mb-10 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
            <Image
              src={siteConfig.couple.monogram}
              alt="Monogram"
              fill
              className="object-contain"
              priority
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(88%) sepia(18%) saturate(650%) hue-rotate(1deg) drop-shadow(0 6px 18px rgba(0,0,0,0.35))",
              }}
            />
          </div>
        </div>

        <h2
          className={`text-5xl transform -rotate-6 transition-all duration-1000 ease-out delay-100 sm:text-6xl md:text-7xl ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontWeight: 400,
            color: textColor,
            textShadow: "0 2px 14px rgba(0,0,0,0.35)",
          }}
        >
          You are
        </h2>

        <h1
          className={`mt-2 text-4xl font-bold tracking-[0.12em] uppercase transition-all duration-1000 ease-out delay-200 sm:mt-3 sm:text-5xl md:text-6xl ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            color: textColor,
            textShadow: "0 2px 16px rgba(0,0,0,0.4)",
          }}
        >
          Invited
        </h1>

        {/* Motif divider */}
        <div
          className={`my-6 flex items-center justify-center gap-2 transition-all duration-1000 ease-out delay-300 sm:my-8 ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
            <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
          </div>
          <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
        </div>

        <p
          className={`mb-8 text-[11px] font-medium tracking-[0.28em] uppercase transition-all duration-1000 ease-out delay-300 sm:mb-10 sm:text-xs sm:tracking-[0.32em] ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ color: textColor, opacity: contentVisible ? 0.8 : 0 }}
        >
          <span>{siteConfig.ceremony.day}</span>
          <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.wedding.date}</span>
        </p>

        <button
          onClick={onOpen}
          className={`group relative overflow-hidden rounded-sm border px-10 py-4 font-serif text-sm tracking-[0.2em] uppercase shadow-lg transition-all duration-500 ease-out delay-500 hover:shadow-xl ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 90%, transparent)",
            borderColor: "var(--color-motif-cream)",
            color: "var(--color-motif-deep)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-motif-cream)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-motif-accent) 90%, transparent)"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <span style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, letterSpacing: "0.18em" }}>
            Open Invitation
          </span>
        </button>
      </div>
    </div>
  )
}
