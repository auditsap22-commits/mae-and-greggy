"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"
import { GoldDust } from "@/components/loader/GoldDust"
import { CoupleNames } from "@/components/couple-name-text"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

interface LoadingScreenProps {
  onComplete: () => void
}

/** Splits a date string like "September 14, 2026" into ["09", "14", "26"] */
function getDateSegments(dateStr: string): string[] {
  const d = new Date(dateStr)
  return [
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getFullYear()).slice(-2),
  ]
}

const GHOST_NUMBERS = getDateSegments(siteConfig.wedding.date)

const MIN_LOAD_MS = 8000
const FADE_MS = 700

const loaderNameClass =
  "font-[family-name:var(--font-safira-march)] text-[clamp(2.85rem,14vw,5.75rem)] sm:text-7xl md:text-8xl leading-none tracking-[0.01em] text-[var(--color-motif-cream)] [text-shadow:0_2px_14px_rgba(0,0,0,0.35)]"

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState(0)
  // phase gates: 0=hidden · 1=monogram · 2=names · 3=divider · 4=date · 5=progress
  const [phase, setPhase] = useState(0)

  // ── Staggered content reveal ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 180),
      setTimeout(() => setPhase(2), 520),
      setTimeout(() => setPhase(3), 960),
      setTimeout(() => setPhase(4), 1400),
      setTimeout(() => setPhase(5), 1840),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Progress counter (minimum 8 seconds) ─────────────────────────────────
  useEffect(() => {
    let rafId = 0
    const start = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_LOAD_MS)
      const next = Math.round(easeOutCubic(t) * 100)
      setProgress((prev) => (next > prev ? next : prev))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const fadeTimer = setTimeout(() => setFadeOut(true), MIN_LOAD_MS - FADE_MS)
    const doneTimer = setTimeout(() => {
      setProgress(100)
      onComplete()
    }, MIN_LOAD_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  return (
    <div
      className={`invite-gate-backdrop fixed inset-0 z-50 flex flex-col overflow-hidden transition-opacity ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
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
        priority
      />
      <Image
        src="/decoration/top-right-corner.png"
        alt=""
        width={901}
        height={1186}
        className="absolute top-0 right-0 pointer-events-none select-none w-28 opacity-80 sm:w-40 md:w-48 lg:w-56"
        aria-hidden
        priority
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

      {/* Ghost wedding-date watermark */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-end justify-center pr-3 max-[380px]:pr-2 sm:pr-8 md:pr-12 lg:pr-16 select-none"
        aria-hidden
      >
        {GHOST_NUMBERS.map((num, i) => (
          <span
            key={`ghost-${num}-${i}`}
            className={`${cinzel.className} leading-[0.82]`}
            style={{
              fontSize: "clamp(3.75rem, 12vw, 12rem)",
              color: "color-mix(in srgb, var(--color-motif-soft) 14%, transparent)",
              letterSpacing: "-0.04em",
              opacity: phase >= 1 ? 1 : 0,
              transition: `opacity 1.6s ease-out ${i * 150}ms`,
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* Three-zone layout: top monogram · center names · bottom progress */}
      <div className={`${cormorant.className} relative z-10 flex min-h-0 flex-1 flex-col`}>
        {/* Top — monogram */}
        <header
          className={`flex shrink-0 justify-center pt-[max(2.75rem,env(safe-area-inset-top))] sm:pt-14 md:pt-16 ${vis(1)}`}
        >
          <div className="relative h-12 w-12 opacity-90 max-[380px]:h-11 max-[380px]:w-11 sm:h-16 sm:w-16">
            <Image
              src={siteConfig.couple.monogram}
              alt=""
              fill
              className="object-contain"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(88%) sepia(18%) saturate(650%) hue-rotate(1deg) drop-shadow(0 4px 14px rgba(0,0,0,0.35))",
              }}
              aria-hidden
              priority
            />
          </div>
        </header>

        {/* Center — names + date */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 text-center sm:px-8">
          <div className={vis(2)} role="heading" aria-level={1} style={{ transitionDelay: "60ms" }}>
            <CoupleNames
              groomName={siteConfig.couple.groomNickname.trim()}
              brideName={siteConfig.couple.brideNickname.trim()}
              connector="and"
              layout="stacked"
              nameOrder="groom-first"
              className={loaderNameClass}
              connectorClassName="text-[var(--color-motif-accent)] opacity-90"
            />
          </div>

          <div className={`mt-4 mb-2 flex items-center justify-center gap-2 sm:mt-6 sm:mb-3 ${vis(3)}`}>
            <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
              <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-50" />
              <span className="h-1.5 w-1.5 rounded-full bg-motif-accent opacity-80" />
            </div>
            <span className="h-px w-10 rounded-full bg-motif-accent/60 sm:w-14" />
          </div>

          <p
            className={`text-[9px] leading-relaxed font-medium tracking-[0.24em] uppercase max-[380px]:tracking-[0.2em] sm:text-xs sm:tracking-[0.32em] ${vis(4)}`}
            style={{ color: "var(--color-motif-cream)", opacity: 0.85 }}
            aria-label={`${siteConfig.ceremony.day}, ${siteConfig.wedding.date} · ${siteConfig.ceremony.time}`}
          >
            <span>{siteConfig.ceremony.day}</span>
            <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>
              ·
            </span>
            <span className="tabular-nums">{siteConfig.wedding.date}</span>
            <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>
              ·
            </span>
            <span className="tabular-nums">{siteConfig.ceremony.time}</span>
          </p>
        </div>

        {/* Bottom — progress */}
        <footer
          className={`shrink-0 px-5 pb-[max(2.25rem,env(safe-area-inset-bottom))] text-center sm:px-8 sm:pb-[max(2.75rem,env(safe-area-inset-bottom))] ${vis(5)}`}
        >
          <p
            className={`${cinzel.className} mb-3 text-[9px] font-medium tracking-[0.2em] uppercase sm:mb-3.5 sm:text-[11px] sm:tracking-[0.26em]`}
            style={{ color: "var(--color-motif-cream)", opacity: 0.9 }}
          >
            Preparing your invitation
          </p>

          <div
            className="relative mx-auto w-full max-w-[200px]"
            style={{ height: "1px" }}
            role="presentation"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-motif-soft) 30%, transparent)",
              }}
            />
            <div
              className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background:
                  "linear-gradient(to right, var(--color-motif-soft), var(--color-motif-accent))",
              }}
            >
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{
                  width: "50px",
                  background:
                    "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-motif-cream) 65%, transparent) 50%, transparent 100%)",
                }}
              />
            </div>
            <div
              className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
              style={{
                left: `${Math.max(progress, 2)}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: "var(--color-motif-cream)",
                boxShadow:
                  "0 0 8px 2px color-mix(in srgb, var(--color-motif-accent) 70%, transparent)",
                transition: "left 200ms linear",
              }}
            />
          </div>

          <p
            className={`${cinzel.className} mt-3 tabular-nums text-[9px] tracking-[0.28em] sm:mt-4 sm:text-[11px] sm:tracking-[0.3em]`}
            style={{ color: "var(--color-motif-cream)" }}
            aria-live="polite"
          >
            {progress}%
          </p>
        </footer>
      </div>
    </div>
  )
}
