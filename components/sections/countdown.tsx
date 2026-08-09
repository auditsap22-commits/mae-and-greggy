"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Cinzel } from "next/font/google"
import { InvitationCard } from "@/components/invitation-card"
import Counter from "@/components/Counter"
import { CoupleNames } from "@/components/couple-name-text"
import { useSiteConfig } from "@/hooks/use-site-config"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownUnitProps {
  value: number
  label: string
}

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
})

const CORNER_DECORATIONS = [
  { src: "/decoration/top-right-corner.png", className: "right-0 top-0" },
  { src: "/decoration/bottom-left-new.png", className: "bottom-0 left-0" },
] as const

const invitationText = {
  accent: "text-[#BB8A3D]",
  heading: "text-[#6B5335]",
  body: "text-[#7A6248]",
  muted: "text-[#8B7355]",
}

const countdownTextColor = "#6B5335"

function CountdownUnit({ value, label }: CountdownUnitProps) {
  const places = value >= 100 ? [100, 10, 1] : [10, 1]

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className="relative w-full max-w-[88px] sm:max-w-[96px] md:max-w-[110px]">
        <div className="relative rounded-xl border border-[#BB8A3D]/35 bg-[#FDFBF7]/70 px-2.5 py-2.5 shadow-[0_4px_16px_rgba(139,111,71,0.12)] sm:rounded-2xl sm:px-3.5 sm:py-3.5 md:px-4 md:py-4">
          <div className="relative z-10 flex items-center justify-center" style={{ color: countdownTextColor }}>
            <Counter
              value={value}
              places={places}
              fontSize={26}
              padding={4}
              gap={2}
              textColor={countdownTextColor}
              fontWeight={800}
              borderRadius={6}
              horizontalPadding={3}
              gradientHeight={0}
              gradientFrom="transparent"
              gradientTo="transparent"
              counterStyle={{
                backgroundColor: "transparent",
              }}
              digitStyle={{
                minWidth: "1.15ch",
                fontFamily: "Arial, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                color: countdownTextColor,
              }}
            />
          </div>
        </div>
      </div>

      <span
        className={`font-inter text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-xs md:text-sm ${invitationText.muted}`}
      >
        {label}
      </span>
    </div>
  )
}

export function Countdown() {
  const siteConfig = useSiteConfig()
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTimeDisplay = siteConfig.ceremony.time
  const [ceremonyMonth = "June", ceremonyDayRaw = "7", ceremonyYear = "2026"] = ceremonyDate.split(" ")
  const ceremonyDayNumber = ceremonyDayRaw.replace(/[^0-9]/g, "") || "7"
  const { brideNickname, groomNickname } = siteConfig.couple
  const ceremonyDay = siteConfig.ceremony.day || "Thursday"
  const ceremonyDayShort = ceremonyDay.slice(0, 3).toUpperCase()
  const timeStr = ceremonyTimeDisplay.split(",")[0].trim()

  const monthMap: { [key: string]: string } = {
    January: "01", February: "02", March: "03", April: "04",
    May: "05", June: "06", July: "07", August: "08",
    September: "09", October: "10", November: "11", December: "12",
  }
  const monthNum = monthMap[ceremonyMonth] || "12"
  const dayNum = ceremonyDayNumber.padStart(2, "0")

  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  let hour = 15
  let minutes = 0

  if (timeMatch) {
    hour = parseInt(timeMatch[1])
    minutes = parseInt(timeMatch[2])
    const ampm = timeMatch[3].toUpperCase()
    if (ampm === "PM" && hour !== 12) hour += 12
    if (ampm === "AM" && hour === 12) hour = 0
  }

  const parsedTargetDate = new Date(Date.UTC(
    parseInt(ceremonyYear),
    parseInt(monthNum) - 1,
    parseInt(dayNum),
    hour - 8,
    minutes,
    0
  ))

  const targetTimestamp = Number.isNaN(parsedTargetDate.getTime())
    ? new Date(Date.UTC(2026, 1, 8, 8, 0, 0)).getTime()
    : parsedTargetDate.getTime()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = targetTimestamp
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetTimestamp])

  return (
    <section id="countdown" className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12">
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="w-full max-w-[440px] md:max-w-[500px] lg:max-w-[540px]"
      >
        <div className="space-y-6 text-center sm:space-y-7 md:space-y-8">
          {/* Monogram */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52"
            role="img"
            aria-label={`${groomNickname} & ${brideNickname} Monogram`}
          >
            <div
              className="absolute inset-0 bg-[#796347]"
              style={{
                WebkitMaskImage: `url(${siteConfig.couple.monogram})`,
                maskImage: `url(${siteConfig.couple.monogram})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </motion.div>

          {/* Header */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
            {/* <CoupleNames
              groomName={groomNickname}
              brideName={brideNickname}
              connector="and"
              className="font-[family-name:var(--font-safira-march)] text-[0.75rem] leading-none tracking-[0.04em] text-[#6B5335] sm:text-[0.8rem] sm:tracking-[0.05em] md:text-[0.85rem] lg:text-[0.9rem]"
            /> */}

            <div
              className="flex w-full max-w-[12rem] items-center justify-center gap-2 sm:max-w-[14rem] md:max-w-[16rem]"
              aria-hidden="true"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
              <div className="h-1 w-1 shrink-0 rounded-full bg-[#BB8A3D]/80" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
            </div>

            <h2
              className={`mx-auto flex max-w-[14rem] flex-col items-center gap-2 font-[family-name:var(--font-safira-march)] text-[1.05rem] leading-none tracking-[0.015em] sm:max-w-[22rem] sm:text-[1.85rem] sm:tracking-[0.01em] md:max-w-none md:gap-2.5 md:text-[2.65rem] lg:text-[3.35rem] ${invitationText.heading}`}
            >
              <span className="block">Counting down</span>
              <span className="block">to our</span>
              <span className="block">forever</span>
            </h2>
          </div>

          {/* Countdown grid */}
          <div className="font-inter">
            <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-md sm:gap-4 md:max-w-xl md:grid-cols-4 md:gap-5">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <CountdownUnit value={timeLeft.minutes} label="Minutes" />
              <CountdownUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          </div>

          {/* Date section */}
          <div className={`flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3 ${invitationText.body}`}>
            <span className={`${cinzel.className} text-[0.65rem] uppercase tracking-[0.4em] sm:text-xs sm:tracking-[0.5em] md:text-sm ${invitationText.accent}`}>
              {ceremonyMonth}
            </span>

            <div className="flex w-full items-center gap-2 sm:gap-4 md:gap-5">
              <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
                <span className="h-px flex-1 rounded-full bg-[#BB8A3D]/40" />
                <span className={`${cinzel.className} text-[0.6rem] uppercase tracking-[0.3em] sm:text-[0.7rem] sm:tracking-[0.4em] md:text-xs ${invitationText.muted}`}>
                  {ceremonyDayShort}
                </span>
                <span className="h-px w-6 rounded-full bg-[#BB8A3D]/40 sm:w-8 md:w-10" />
              </div>

              <div className="relative flex items-center justify-center px-3 sm:px-4 md:px-5">
                <span
                  className={`${cinzel.className} relative text-[2.5rem] font-bold leading-none tracking-wider sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] ${invitationText.heading}`}
                >
                  {ceremonyDayNumber.padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
                <span className="h-px w-6 rounded-full bg-[#BB8A3D]/40 sm:w-8 md:w-10" />
                <span className={`${cinzel.className} text-[0.6rem] uppercase tracking-[0.3em] sm:text-[0.7rem] sm:tracking-[0.4em] md:text-xs ${invitationText.muted}`}>
                  {ceremonyTimeDisplay.split(",")[0]}
                </span>
                <span className="h-px flex-1 rounded-full bg-[#BB8A3D]/40" />
              </div>
            </div>

            <span className={`${cinzel.className} text-[0.65rem] uppercase tracking-[0.4em] sm:text-xs sm:tracking-[0.5em] md:text-sm ${invitationText.accent}`}>
              {ceremonyYear}
            </span>
          </div>
        </div>
      </InvitationCard>
    </section>
  )
}
