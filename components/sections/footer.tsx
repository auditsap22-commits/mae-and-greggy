"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "motion/react"
import { Instagram, Twitter, Facebook, MapPin, Calendar, Clock, Heart, Music2 } from "lucide-react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { InvitationCard } from "@/components/invitation-card"
import { NameConnector, StyledName } from "@/components/couple-name-text"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
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

const INNER_PANEL_CLASS =
  "rounded-xl border border-[#BB8A3D]/25 bg-[#F5EDE0]/60 p-3 transition-all duration-300 hover:border-[#BB8A3D]/35 hover:bg-[#F5EDE0]/80 sm:rounded-2xl sm:p-4 md:p-5"

const ICON_WRAP_CLASS =
  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#BB8A3D]/30 bg-[#F5EDE0]/80 sm:h-9 sm:w-9 md:h-10 md:w-10"

const LINK_CLASS =
  "font-semibold text-[#BB8A3D] underline transition-colors hover:text-[#A67A35]"

const SOCIAL_BTN_CLASS =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#BB8A3D]/25 bg-[#F5EDE0]/60 text-[#BB8A3D] transition-all duration-200 hover:scale-110 hover:border-[#BB8A3D]/40 hover:bg-[#F5EDE0]/90 sm:h-11 sm:w-11"

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

function CoupleNameInline() {
  const { groomNickname, brideNickname } = useSiteConfig().couple

  return (
    <>
      {groomNickname}
      <NameConnector size="sm">and</NameConnector>
      {brideNickname}
    </>
  )
}

export function Footer() {
  const siteConfig = useSiteConfig()
  const year = new Date().getFullYear()
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTime = siteConfig.ceremony.time
  const receptionTime = siteConfig.reception.time
  const ceremonyVenue = siteConfig.ceremony.location
  const receptionVenue = siteConfig.reception.location
  const isSameVenue = ceremonyVenue === receptionVenue
  const combinedVenue = isSameVenue ? ceremonyVenue : null

  const quotes = useMemo(
    () => [
      `"I have found the one whom my soul loves." – Song of Solomon 3:4`,
      "Welcome to our wedding website! We've found a love that's a true blessing, and we give thanks to God for writing the beautiful story of our journey together.",
      "Thank you for your love, prayers, and support. We can't wait to celebrate this joyful day together!",
    ],
    []
  )

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => setIsPaused(false), 3000)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        const deleteTimeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30)
        return () => clearTimeout(deleteTimeout)
      }
      setIsDeleting(false)
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    } else {
      const currentQuote = quotes[currentQuoteIndex]
      if (displayedText.length < currentQuote.length) {
        const typeTimeout = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, displayedText.length + 1))
        }, 50)
        return () => clearTimeout(typeTimeout)
      }
      setIsPaused(true)
      setIsDeleting(true)
    }
  }, [displayedText, isDeleting, isPaused, currentQuoteIndex, quotes])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  }

  const staggerChildren = {
    animate: {
      transition: { staggerChildren: 0.2 },
    },
  }

  const nav = [
    { label: "Home", href: "#home" },
    { label: "Events", href: "#details" },
    { label: "Gallery", href: "#gallery" },
    { label: "RSVP", href: "#guest-list" },
  ] as const

  const brideNickname = siteConfig.couple.brideNickname
  const groomNickname = siteConfig.couple.groomNickname

  return (
    <footer className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12">
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="w-full max-w-[440px] md:max-w-[500px] lg:max-w-[540px]"
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Monogram & couple header */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48"
              role="img"
              aria-label={`${groomNickname} and ${brideNickname} monogram`}
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

            <div className="mt-4 w-full max-w-[18rem] px-2 sm:mt-5 sm:max-w-[22rem] md:max-w-none">
              <p className={`font-[family-name:var(--font-safira-march)] inline-flex flex-wrap items-baseline justify-center gap-x-0 gap-y-0.5 text-[0.78rem] leading-none tracking-[0.02em] sm:gap-y-1 sm:text-[1rem] sm:tracking-[0.03em] md:text-[1.3rem] lg:text-[1.6rem] ${invitationText.heading}`}>
                <StyledName name={groomNickname} />
                <NameConnector size="sm">and</NameConnector>
                <StyledName name={brideNickname} />
              </p>
              <p className={`${cormorant.className} mt-2 text-sm tracking-[0.08em] sm:mt-3 sm:text-base md:text-lg ${invitationText.body}`}>
                {ceremonyDate}
              </p>
              {/* <p className={`${cormorant.className} mt-1 text-xs sm:text-sm md:text-base ${invitationText.muted}`}>
                {combinedVenue ?? ceremonyVenue}
              </p> */}
            </div>
          </div>

          <motion.div
            className="space-y-4 sm:space-y-5"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {/* Couple info + quote */}
            <motion.div className="space-y-4" variants={fadeInUp}>
           

              <motion.div className={INNER_PANEL_CLASS} whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
                <blockquote className={`${cormorant.className} min-h-[60px] text-sm italic leading-relaxed sm:min-h-[70px] sm:text-base md:text-lg ${invitationText.body}`}>
                  &quot;{displayedText}
                  <span className={`ml-1 inline-block h-4 w-0.5 animate-pulse bg-[#BB8A3D]/70 sm:h-5`}>|</span>&quot;
                </blockquote>
              </motion.div>
            </motion.div>

            {/* Event details */}
            <motion.div className="space-y-3 sm:space-y-4" variants={fadeInUp}>
              {isSameVenue ? (
                <motion.div className={INNER_PANEL_CLASS} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <div className="mb-2.5 flex items-center gap-2 sm:mb-3 sm:gap-3">
                    <div className={ICON_WRAP_CLASS}>
                      <MapPin className={`h-4 w-4 ${invitationText.accent}`} />
                    </div>
                    <h4 className={`${cinzel.className} inline-flex flex-wrap items-baseline gap-y-1 text-sm font-semibold sm:text-base md:text-lg ${invitationText.heading}`}>
                      Ceremony
                      <NameConnector size="sm">and</NameConnector>
                      Reception
                    </h4>
                  </div>
                  <div className={`space-y-2 ${cormorant.className} text-xs leading-relaxed sm:text-sm ${invitationText.body}`}>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${invitationText.muted}`} />
                      <span>{toTitleCase(combinedVenue ?? ceremonyVenue)}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Clock className={`h-3.5 w-3.5 flex-shrink-0 ${invitationText.muted}`} />
                      <span>Ceremony {ceremonyTime} · Reception {receptionTime}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div className={INNER_PANEL_CLASS} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <div className="mb-2.5 flex items-center gap-2 sm:mb-3 sm:gap-3">
                      <div className={ICON_WRAP_CLASS}>
                        <Clock className={`h-4 w-4 ${invitationText.accent}`} />
                      </div>
                      <h4 className={`${cinzel.className} text-sm font-semibold sm:text-base md:text-lg ${invitationText.heading}`}>
                        Ceremony
                      </h4>
                    </div>
                    <div className={`space-y-2 ${cormorant.className} text-xs leading-relaxed sm:text-sm ${invitationText.body}`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <MapPin className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${invitationText.muted}`} />
                        <span>{toTitleCase(ceremonyVenue)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Clock className={`h-3.5 w-3.5 flex-shrink-0 ${invitationText.muted}`} />
                        <span>{ceremonyTime}</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div className={INNER_PANEL_CLASS} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <div className="mb-2.5 flex items-center gap-2 sm:mb-3 sm:gap-3">
                      <div className={ICON_WRAP_CLASS}>
                        <Heart className={`h-4 w-4 fill-[#BB8A3D]/30 ${invitationText.accent}`} />
                      </div>
                      <h4 className={`${cinzel.className} text-sm font-semibold sm:text-base md:text-lg ${invitationText.heading}`}>
                        Reception
                      </h4>
                    </div>
                    <div className={`space-y-2 ${cormorant.className} text-xs leading-relaxed sm:text-sm ${invitationText.body}`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <MapPin className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${invitationText.muted}`} />
                        <span>{toTitleCase(receptionVenue)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Clock className={`h-3.5 w-3.5 flex-shrink-0 ${invitationText.muted}`} />
                        <span>{receptionTime}</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              <motion.div className={INNER_PANEL_CLASS} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <div className="mb-2.5 flex items-center gap-2 sm:mb-3 sm:gap-3">
                  <div className={ICON_WRAP_CLASS}>
                    <Calendar className={`h-4 w-4 ${invitationText.accent}`} />
                  </div>
                  <h4 className={`${cinzel.className} text-sm font-semibold sm:text-base md:text-lg ${invitationText.heading}`}>
                    RSVP 
                  </h4>
                </div>
                <div className={`space-y-2 ${cormorant.className} text-xs leading-relaxed sm:text-sm ${invitationText.body}`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className={`h-3.5 w-3.5 flex-shrink-0 ${invitationText.muted}`} />
                    <span>{siteConfig.details.rsvp.deadline}</span>
                  </div>
                  <p className={invitationText.muted}>Please confirm your attendance by this date.</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Social + quick links */}
            <motion.div className="space-y-4 sm:space-y-5" variants={fadeInUp}>
              <div>
                <h4 className={`${cinzel.className} mb-3 flex items-center gap-2 text-sm font-semibold sm:mb-4 sm:text-base md:text-lg ${invitationText.heading}`}>
                  <span className="h-5 w-1 rounded-full bg-[#BB8A3D]/50 sm:h-6" />
                  Follow Us
                </h4>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {[
                    { href: "https://www.facebook.com", label: "Facebook", Icon: Facebook },
                    { href: "https://www.instagram.com/", label: "Instagram", Icon: Instagram },
                    { href: "https://www.youtube.com", label: "YouTube", Icon: Music2 },
                    { href: "https://x.com/", label: "Twitter", Icon: Twitter },
                  ].map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={SOCIAL_BTN_CLASS}
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div className={INNER_PANEL_CLASS}>
                <h5 className={`${cinzel.className} mb-2.5 text-sm font-semibold sm:mb-3 sm:text-base ${invitationText.heading}`}>
                  Quick Links
                </h5>
                <div className="space-y-1.5 sm:space-y-2">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`block text-xs transition-colors duration-200 sm:text-sm ${cormorant.className} ${invitationText.muted} hover:text-[#BB8A3D]`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bottom row */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <div className="border-t border-[#BB8A3D]/20 pt-5 sm:pt-6">
                <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:gap-5">
                  <div className="text-center">
                    <p className={`${cormorant.className} text-xs leading-relaxed sm:text-sm ${invitationText.body}`}>
                      © {year}{" "}
                      <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1">
                        <CoupleNameInline />
                      </span>
                      {" "}— crafted with love, prayers,{" "}
                      <NameConnector size="sm">and</NameConnector>{" "}
                      gratitude.
                    </p>
                    <p className={`${cormorant.className} mt-1 text-xs leading-relaxed sm:text-sm ${invitationText.muted}`}>
                      This celebration site was designed to share our story and joy with you.
                    </p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className={`${cormorant.className} text-xs sm:text-sm ${invitationText.muted}`}>
                      Developed by{" "}
                      <a
                        href="https://lance28-beep.github.io/portfolio-website/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                      >
                        Lance Valle
                      </a>
                    </p>
                    <p className={`${cormorant.className} text-xs sm:text-sm ${invitationText.muted}`}>
                      Want a website like this? Visit{" "}
                      <a
                        href="https://www.facebook.com/WeddingInvitationNaga"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                      >
                        Wedding Invitation Naga
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </InvitationCard>
    </footer>
  )
}
