"use client"

import { InvitationCard } from "@/components/invitation-card"
import { CoupleNames, NameConnector } from "@/components/couple-name-text"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

export function Welcome() {
  const siteConfig = useSiteConfig()
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom

  return (
    <section id="welcome" className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12">
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="w-full max-w-[440px] md:max-w-[500px] lg:max-w-[540px]"
      >
        <div className={`space-y-5 text-center sm:space-y-6 md:space-y-7 ${invitationText.body}`}>
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <p
              className={`${cormorant.className} inline-flex flex-wrap items-baseline justify-center gap-y-1 px-2 text-[0.65rem] uppercase tracking-[0.24em] sm:px-3 sm:text-[0.7rem] sm:tracking-[0.28em] md:text-xs lg:text-sm ${invitationText.accent}`}
            >
              {siteConfig.couple.groomNickname}
              <NameConnector size="sm">&</NameConnector>
              {siteConfig.couple.brideNickname}
            </p>

            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
              <div
                className="flex w-full max-w-[12rem] items-center justify-center gap-2 sm:max-w-[14rem] md:max-w-[16rem]"
                aria-hidden="true"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
                <div className="h-1 w-1 shrink-0 rounded-full bg-[#BB8A3D]/80" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
              </div>

              <h2
                className={`mx-auto flex max-w-[14rem] flex-col items-center gap-3 px-1 font-[family-name:var(--font-safira-march)] text-[1.05rem] leading-none tracking-[0.015em] sm:max-w-[22rem] sm:gap-2 sm:px-0 sm:text-[1.85rem] sm:tracking-[0.01em] md:max-w-none md:gap-2.5 md:text-[2.65rem] lg:text-[3.35rem] xl:text-[4rem] ${invitationText.heading}`}
              >
                <span className="block">Welcome to our</span>
                <span className="block">forever</span>
              </h2>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <p
                className={`${cormorant.className} text-[0.7rem] italic leading-relaxed sm:text-xs md:text-sm lg:text-base ${invitationText.muted}`}
              >
                &quot;I have found the one whom my soul loves.&quot;
              </p>
              <p
                className={`${cormorant.className} text-[0.7rem] italic leading-relaxed sm:text-xs md:text-sm lg:text-base ${invitationText.muted}`}
              >
                Song of Solomon 3:4
              </p>
            </div>
          </div>

          <div
            className={`${cormorant.className} space-y-2.5 text-[0.75rem] leading-relaxed sm:space-y-3 sm:text-[0.85rem] sm:leading-6 md:space-y-4 md:text-sm md:leading-7 lg:text-base`}
          >
            <p>
              By the grace of God and with the blessings of our parents, we joyfully invite you to the celebration of our love and marriage.
            </p>
            <p>
              Kindly explore this invitation for event details and RSVP information.
            </p>

            <div className="space-y-4 pt-4 sm:space-y-5 sm:pt-5 md:space-y-6 md:pt-6">
              <div className="space-y-2 sm:space-y-2.5">
                <p
                  className={`${cormorant.className} text-[0.8rem] italic sm:text-sm md:text-base ${invitationText.muted}`}
                >
                  With all our love,
                </p>
                <CoupleNames
                  groomName={groomName}
                  brideName={brideName}
                  connector="and"
                  className="font-[family-name:var(--font-safira-march)] text-[0.75rem] leading-none tracking-[0.04em] text-[#6B5335] sm:text-[0.8rem] sm:tracking-[0.05em] md:text-[0.85rem] lg:text-[0.9rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </InvitationCard>
    </section>
  )
}
