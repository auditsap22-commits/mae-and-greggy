"use client"

import { InvitationCard } from "@/components/invitation-card"
import { CoupleNames } from "@/components/couple-name-text"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

const CORNER_DECORATIONS = [
  {
    src: "/decoration/top-right-corner.png",
    className: "right-0 top-0",
  },
  {
    src: "/decoration/bottom-left-new.png",
    className: "bottom-0 left-0",
  },
] as const

const invitationText = {
  accent: "text-[#BB8A3D]",
  heading: "text-[#6B5335]",
  body: "text-[#7A6248]",
  muted: "text-[#8B7355]",
}

const heroNameClass =
  "font-[family-name:var(--font-safira-march)] text-[2.85rem] leading-none tracking-[0.01em] sm:text-[3.35rem] md:text-[4rem] lg:text-[4.5rem] text-[#5A4630]"

function Divider() {
  return (
    <div
      className="mx-auto flex w-full max-w-[12rem] items-center justify-center gap-2 sm:max-w-[14rem] md:max-w-[16rem]"
      aria-hidden="true"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
      <div className="h-1 w-1 shrink-0 rounded-full bg-[#BB8A3D]/80" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
    </div>
  )
}

export function Hero() {
  const siteConfig = useSiteConfig()
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom

  const eventDate = new Date(siteConfig.ceremony.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <section id="home" className="relative flex w-full justify-center px-4 sm:px-6">
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="mt-4 w-full max-w-[440px] sm:mt-5 md:mt-6 md:max-w-[500px] lg:max-w-[540px]"
      >
        <div className="space-y-5 px-2 py-6 text-center sm:space-y-6 sm:py-8 md:space-y-7 md:py-10">
          <p
            className={`${cormorant.className} mx-auto max-w-xs px-2 text-[0.75rem] italic leading-relaxed sm:text-sm md:text-base ${invitationText.muted}`}
          >
            By the grace of God and with the blessings of our dear parents
          </p>

          <div className="py-1 sm:py-1.5">
            <CoupleNames
              groomName={groomName}
              brideName={brideName}
              connector="and"
              layout="stacked"
              nameOrder="groom-first"
              className={heroNameClass}
            />
          </div>

          <p
            className={`${cormorant.className} mx-auto max-w-xs px-2 text-[0.75rem] italic leading-relaxed sm:text-sm md:text-base ${invitationText.muted}`}
          >
            Joyfully invite you to the celebration of their love and marriage
          </p>

          <Divider />

          <div className="space-y-1">
            <p className={`${cinzel.className} text-xs uppercase tracking-[0.25em] ${invitationText.body}`}>
              {siteConfig.ceremony.day}
            </p>
            <p className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl ${invitationText.heading}`}>
              {eventDate}
            </p>
            <p className={`${cinzel.className} text-sm tracking-wide sm:text-base ${invitationText.body}`}>
              {siteConfig.ceremony.time}
            </p>
          </div>

          <Divider />

          <div className="space-y-4 sm:space-y-5">
            <div>
              <p className={`${cinzel.className} text-[10px] uppercase tracking-[0.3em] sm:text-xs ${invitationText.accent}`}>
                Ceremony
              </p>
              <p className={`${cormorant.className} text-sm font-semibold sm:text-base ${invitationText.heading}`}>
                {siteConfig.ceremony.location}
              </p>
              <p className={`${cormorant.className} text-xs sm:text-sm ${invitationText.muted}`}>
                {siteConfig.ceremony.venue}
              </p>
            </div>

            <div>
              <p className={`${cinzel.className} text-[10px] uppercase tracking-[0.3em] sm:text-xs ${invitationText.accent}`}>
                Reception
              </p>
              <p className={`${cormorant.className} text-sm font-semibold sm:text-base ${invitationText.heading}`}>
                {siteConfig.reception.location}
              </p>
              <p className={`${cormorant.className} text-xs sm:text-sm ${invitationText.muted}`}>
                {siteConfig.reception.venue}
              </p>
            </div>
          </div>
        </div>
      </InvitationCard>
    </section>
  )
}
