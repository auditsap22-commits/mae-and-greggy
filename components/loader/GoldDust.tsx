"use client"

import React, { useEffect, useRef } from "react"

/** Warm gold/champagne motif tones — matches --color-motif-* in globals.css */
const PARTICLE_COLORS = [
  "205, 172, 119", // --color-motif-soft
  "187, 138, 61",  // --color-motif-accent
  "253, 251, 247", // --color-motif-cream
  "122, 98, 72",   // --color-motif-medium
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  twinklePhase: number
  twinkleSpeed: number
  colorIdx: number
}

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(50, Math.max(22, Math.floor((width * height) / 15000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -(Math.random() * 0.16 + 0.05),
    radius: Math.random() * 1.7 + 0.4,
    opacity: Math.random() * 0.4 + 0.22,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

/** Drifting, twinkling gold-dust canvas — shared ambience for the loading and gate screens. */
export const GoldDust: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.twinklePhase += p.twinkleSpeed
        const twinkle = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha = p.opacity * (0.3 + twinkle * 0.7)
        const color = PARTICLE_COLORS[p.colorIdx]
        const blurR = p.radius * 3.5

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0, `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`)
        g.addColorStop(1, `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        const { width, height } = canvas
        if (p.y < -20) { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    />
  )
}
