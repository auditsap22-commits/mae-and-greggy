"use client"

import { NameConnector } from "@/components/couple-name-text"
import { InvitationCard } from "@/components/invitation-card"
import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useSiteConfig } from "@/hooks/use-site-config"
import Image from "next/image"
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import {
  Shirt,
  Clock,
  Utensils,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"


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

const INNER_CARD_CLASS =
  "relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#BB8A3D]/30 bg-[#FDFBF7]/80 shadow-[0_4px_20px_rgba(139,111,71,0.12)] transition-all duration-300 hover:border-[#BB8A3D]/45"

const INNER_BOX_CLASS =
  "rounded-xl bg-[#F5EDE0]/60 border border-[#BB8A3D]/25 p-3 sm:p-4 md:p-5"

const ATTIRE_PALETTE = [
  { name: "champagne", color: "#e3ccb2" },
  { name: "gold", color: "#b48c41" },
  { name: "ivory", color: "#f2eee7" },
  { name: "cream", color: "#f5f4f0" },
  { name: "beige", color: "#eadfd4" },
] as const

function AttireColorPalette() {
  return (
    <div className="mx-auto max-w-2xl">
      <p
        className={`${cinzel.className} mb-5 text-center text-xs tracking-[0.32em] uppercase sm:mb-6 sm:text-sm ${invitationText.heading}`}
      >
        Color Palette
      </p>
      <ul className="flex flex-wrap items-end justify-center gap-x-3 gap-y-5 sm:gap-x-5 md:gap-x-6">
        {ATTIRE_PALETTE.map(({ name, color }) => (
          <li key={name} className="flex flex-col items-center gap-2">
            <div
              className="h-[3.25rem] w-[3.25rem] rounded-full border border-[#BB8A3D]/25 shadow-[0_2px_8px_rgba(107,83,53,0.12)] sm:h-[3.75rem] sm:w-[3.75rem] md:h-16 md:w-16"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <span className={`${cormorant.className} text-xs italic capitalize sm:text-sm ${invitationText.body}`}>
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const BTN_PRIMARY =
  "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-[#BB8A3D] hover:bg-[#A67A35] text-[#FDFBF7] rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(139,111,71,0.2)]"

const BTN_SECONDARY =
  "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-transparent border border-[#BB8A3D]/45 hover:border-[#BB8A3D]/65 hover:bg-[#BB8A3D]/10 text-[#6B5335] rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"

function CoupleNameInline() {
  const { groomNickname, brideNickname } = useSiteConfig().couple

  return (
    <>
      {groomNickname}
      <NameConnector size="sm">&</NameConnector>
      {brideNickname}
    </>
  )
}

export function Details() {
  const siteConfig = useSiteConfig()
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rotationOffset, setRotationOffset] = useState(0)
  
  const coupleImages = [
    "/frontboxes/box_1.webp",
    "/frontboxes/box_2.webp",
    "/frontboxes/box_3.webp",
    "/frontboxes/hero.webp",
  ]

  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReceptionImageIndex((prev) => (prev + 1) % receptionImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Gentle reminders couple photos — subtle carousel + wobble animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % coupleImages.length)
      setRotationOffset((prev) => (prev + 10) % 360)
    }, 2600)

    return () => clearInterval(interval)
  }, [coupleImages.length])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Venue information from site config
  const ceremonyVenueName = siteConfig.ceremony.location
  const ceremonyVenueDetail = ""
  const ceremonyAddress = siteConfig.ceremony.venue
  const ceremonyVenue = `${ceremonyVenueName}, ${ceremonyAddress}`
  const ceremonyMapsLink = siteConfig.ceremony.map

  const receptionVenueName = siteConfig.reception.location
  const receptionVenueDetail = ""
  const receptionAddress = siteConfig.reception.venue
  const receptionVenue = `${receptionVenueName}, ${receptionAddress}`
  const receptionMapsLink = `https://maps.google.com/?q=${encodeURIComponent(receptionVenue)}`

  // Aliases used in the image modal
  const ceremonyLocationFormatted = ceremonyVenueName
  const receptionLocationFormatted = receptionVenueName
  const ceremonyLocation = ceremonyVenue
  const receptionLocation = receptionVenue
  const formattedCeremonyDate = siteConfig.ceremony.date
  const formattedReceptionDate = siteConfig.ceremony.date // reception follows ceremony on same day

  const openInMaps = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }


  return (
    <>
    <section
      id="details"
      className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12"
    >
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="w-full max-w-[440px] md:max-w-[500px] lg:max-w-[540px] [&_.hero-invitation__content]:px-3 [&_.hero-invitation__content]:pt-10 sm:[&_.hero-invitation__content]:px-4 sm:[&_.hero-invitation__content]:pt-8 md:[&_.hero-invitation__content]:pt-6"
      >
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 px-6 text-center sm:gap-4 sm:px-8 md:gap-5 md:px-10">
        <p
          className={`${cormorant.className} inline-flex max-w-[14rem] flex-wrap items-baseline justify-center gap-y-1 text-[0.65rem] uppercase tracking-[0.16em] sm:max-w-none sm:text-[0.7rem] sm:tracking-[0.28em] md:text-sm ${invitationText.accent}`}
        >
          <CoupleNameInline />
        </p>

        <div
          className="flex w-full max-w-[12rem] items-center justify-center gap-2 sm:max-w-[14rem] md:max-w-[16rem]"
          aria-hidden="true"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
          <div className="h-1 w-1 shrink-0 rounded-full bg-[#BB8A3D]/80" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#BB8A3D]/45 to-[#CDAC77]/55" />
        </div>

        <h2
          className={`flex flex-col items-center gap-1 font-[family-name:var(--font-safira-march)] px-2 text-[clamp(1rem,4.2vw,1.35rem)] leading-[1.25] tracking-[0.015em] sm:text-[1.5rem] sm:leading-none sm:tracking-[0.01em] md:text-[2.1rem] lg:text-[2.65rem] ${invitationText.heading}`}
        >
          <span className="block">Event</span>
          <span className="block">Details</span>
        </h2>

        <p
          className={`${cormorant.className} mx-auto max-w-xl px-2 text-xs italic leading-relaxed sm:text-sm md:text-base ${invitationText.muted}`}
        >
          Everything you need to know about our special day.
        </p>
      </div>

      {/* Venue and Event Information */}
      <div className="space-y-6 sm:space-y-8 md:space-y-10">
        
        {/* Ceremony Card */}
        <div className="relative group">
          <div className={INNER_CARD_CLASS}>
            {/* Venue Image */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              <Image
                src={siteConfig.ceremony.image}
                alt={siteConfig.ceremony.location}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Venue name overlay with warm gold accent */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6">
                <h3 className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl font-[family-name:var(--font-crimson)] font-normal text-white mb-0.5 sm:mb-1 drop-shadow-lg uppercase tracking-[0.1em] leading-tight`}>
                  {siteConfig.ceremony.location}
                </h3>
                <p className={`${cinzel.className} text-xs sm:text-sm md:text-base text-white/95 drop-shadow-md tracking-wide`}>
                  {siteConfig.ceremony.venue}
                </p>
              </div>
            </div>

            {/* Event Details Content */}
            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
              {/* Date Section */}
              <div className="text-center mb-5 sm:mb-8 md:mb-10">
                <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 ${invitationText.muted}`}>
                  {siteConfig.ceremony.day}
                </p>

                <div className="mb-2 sm:mb-4">
                  <p className={`${cinzel.className} text-lg leading-none sm:text-2xl md:text-3xl lg:text-4xl ${invitationText.accent}`}>
                  {new Date(siteConfig.ceremony.date).toLocaleString('default', { month: 'long' })}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-7">
                  <p className={`${cinzel.className} text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-none ${invitationText.heading}`}>
                  {new Date(siteConfig.ceremony.date).getDate()}
                  </p>
                  <div className="h-8 sm:h-12 md:h-16 lg:h-20 w-[2px] bg-gradient-to-b from-[#BB8A3D]/30 via-[#BB8A3D]/70 to-[#BB8A3D]/30" />
                  <p className={`${cinzel.className} text-lg sm:text-2xl md:text-3xl lg:text-4xl font-light leading-none ${invitationText.heading}`}>
                  {new Date(siteConfig.ceremony.date).getFullYear()}
                  </p>
                </div>

                <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wide ${invitationText.body}`}>
                  {siteConfig.ceremony.time}
                </p>
              </div>

              {/* Location Details */}
              <div className={`${INNER_BOX_CLASS} mb-4 sm:mb-6`}>
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className={`mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5 md:h-6 md:w-6 ${invitationText.accent}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`mb-1.5 text-xs font-[family-name:var(--font-crimson)] font-semibold uppercase tracking-wide sm:mb-2 sm:text-sm md:text-base ${invitationText.accent}`}>
                      Location
                    </p>
                    <p className={`${cinzel.className} text-xs font-[family-name:var(--font-crimson)] leading-relaxed sm:text-sm md:text-base lg:text-lg ${invitationText.heading}`}>
                      {ceremonyVenueName}
                    </p>
                    {ceremonyVenueDetail && (
                      <p className={`${cinzel.className} mt-1 text-[10px] font-[family-name:var(--font-crimson)] leading-relaxed sm:text-xs md:text-sm ${invitationText.muted}`}>
                        {ceremonyVenueDetail}
                      </p>
                    )}
                    <p className={`${cinzel.className} text-[10px] font-[family-name:var(--font-crimson)] leading-relaxed sm:text-xs md:text-sm ${invitationText.muted}`}>
                      {ceremonyAddress}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-center gap-1.5 sm:gap-2">
                    <div className="rounded-lg border border-[#BB8A3D]/30 bg-white p-1.5 shadow-sm sm:p-2 md:p-2.5">
                      <QRCodeSVG
                        value={ceremonyMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor="#3E2914"
                        bgColor="#FFFFFF"
                      />
                    </div>
                    <p className={`max-w-[80px] text-center text-[9px] italic sm:text-[10px] md:text-xs ${invitationText.muted}`}>
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(ceremonyMapsLink)}
                  className={BTN_PRIMARY}
                  aria-label="Get directions to ceremony venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(ceremonyVenue, 'ceremony')}
                  className={BTN_SECONDARY}
                  aria-label="Copy ceremony venue address"
                >
                  {copiedItems.has('ceremony') ? (
                    <Check className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  )}
                  <span>{copiedItems.has('ceremony') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reception Card */}
        <div className="relative group">
          <div className={INNER_CARD_CLASS}>
       
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              {receptionImages.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentReceptionImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={src}
                    alt={siteConfig.reception.venue}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              
          
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6 z-20">
                <h3 className={`${cinzel.className} text-lg sm:text-xl md:text-2xl lg:text-3xl font-[family-name:var(--font-crimson)] font-normal text-white mb-0.5 sm:mb-1 drop-shadow-lg uppercase tracking-[0.1em] leading-tight`}>
                  {siteConfig.reception.location}
                </h3>
                <p className={`${cinzel.className} text-xs sm:text-sm md:text-base font-[family-name:var(--font-crimson)] text-white/95 drop-shadow-md tracking-wide`}>
                  {siteConfig.reception.venue}
                </p>
              </div>
            </div>
            

            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
         
              <div className="text-center mb-5 sm:mb-8">
                {siteConfig.reception.time === "To follow after the ceremony" ? (
                  <p className={`${cinzel.className} text-sm sm:text-base font-[family-name:var(--font-crimson)] font-semibold tracking-wide md:text-lg lg:text-xl ${invitationText.body}`}>
                    To follow after the ceremony
                  </p>
                ) : (
                  <>
                    {/* <p className={`${cinzel.className} text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] font-semibold text-white/90 uppercase tracking-[0.2em] mb-2 sm:mb-3`}>
                      {siteConfig.reception.time === "After ceremony" ? "Starts" : "Starts at"}
                    </p> */}
                    {/* <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-[family-name:var(--font-crimson)] font-semibold text-white tracking-wide`}>
                      {siteConfig.reception.time}
                    </p> */}
                  </>
                )}
              </div>

        
              <div className={`${INNER_BOX_CLASS} mb-4 sm:mb-6`}>
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className={`mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5 md:h-6 md:w-6 ${invitationText.accent}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`mb-1.5 text-xs font-[family-name:var(--font-crimson)] font-semibold uppercase tracking-wide sm:mb-2 sm:text-sm md:text-base ${invitationText.accent}`}>
                      Location
                    </p>
                    <p className={`${cinzel.className} text-xs font-[family-name:var(--font-crimson)] leading-relaxed sm:text-sm md:text-base lg:text-lg ${invitationText.heading}`}>
                      {receptionVenueName}
                    </p>
                    {receptionVenueDetail && (
                    <p className={`${cinzel.className} mt-1 text-[10px] font-[family-name:var(--font-crimson)] leading-relaxed sm:text-xs md:text-sm ${invitationText.muted}`}>
                        {receptionVenueDetail}
                      </p>
                    )}
                    <p className={`${cinzel.className} text-[10px] font-[family-name:var(--font-crimson)] leading-relaxed sm:text-xs md:text-sm ${invitationText.muted}`}>
                      {receptionAddress}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-center gap-1.5 sm:gap-2">
                    <div className="rounded-lg border border-[#BB8A3D]/30 bg-white p-1.5 shadow-sm sm:p-2 md:p-2.5">
                      <QRCodeSVG
                        value={receptionMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor="#3E2914"
                        bgColor="#FFFFFF"
                      />
                    </div>
                    <p className={`max-w-[80px] text-center text-[9px] italic sm:text-[10px] md:text-xs ${invitationText.muted}`}>
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

     
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(receptionMapsLink)}
                  className={BTN_PRIMARY}
                  aria-label="Get directions to reception venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(receptionVenue, 'reception')}
                  className={BTN_SECONDARY}
                  aria-label="Copy reception venue address"
                >
                  {copiedItems.has('reception') ? (
                    <Check className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  )}
                  <span>{copiedItems.has('reception') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attire Guide */}
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center sm:mb-5">
          <Shirt className={`h-5 w-5 sm:h-6 sm:w-6 ${invitationText.accent}`} aria-hidden />
        </div>
        <h3 className={`px-4 font-[family-name:var(--font-safira-march)] text-[1.05rem] leading-[1.2] tracking-[0.01em] sm:text-[1.45rem] sm:leading-none md:text-[1.65rem] ${invitationText.heading}`}>
          Attire Guide
        </h3>
      </div>

      <div className={INNER_CARD_CLASS}>
          <div className="space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-7 md:px-8">
            <AttireColorPalette />

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <div>
                <h4 className={`mb-3 px-2 text-center font-[family-name:var(--font-safira-march)] text-[0.95rem] leading-[1.2] tracking-[0.01em] sm:mb-4 sm:text-[1.15rem] sm:leading-none md:text-[1.3rem] ${invitationText.heading}`}>
                  Principal Sponsors
                </h4>
                <div className={`${INNER_BOX_CLASS} px-3 py-3 sm:px-4 sm:py-3.5`}>
                  <p className={`${cormorant.className} text-left text-sm leading-snug sm:text-base ${invitationText.body}`}>
                    Ninang in beige or champagne dress. Ninong in Classic Barong Tagalog with white undershirt{" "}
                    <NameConnector size="sm">and</NameConnector>{" "}
                    black slacks.
                  </p>
                </div>
              </div>

              <div>
                <h4 className={`mb-3 px-2 text-center font-[family-name:var(--font-safira-march)] text-[0.95rem] leading-[1.2] tracking-[0.01em] sm:mb-4 sm:text-[1.15rem] sm:leading-none md:text-[1.3rem] ${invitationText.heading}`}>
                  Guests
                </h4>
                <div className={`${INNER_BOX_CLASS} px-3 py-3 sm:px-4 sm:py-3.5`}>
                  <p className={`${cormorant.className} text-left text-sm leading-snug sm:text-base ${invitationText.body}`}>
                    Semi-formal attire in any shade from our color palette above. Ladies: should wear long satin dress. Gentlemen: should wear long sleeves or collared shirt—strictly no denim or open-toe shoes.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#BB8A3D]/20 pt-6 sm:pt-8">
              <div className="mb-4 flex flex-col items-center sm:mb-5">
                <p className={`mb-3 px-2 text-center font-[family-name:var(--font-safira-march)] text-[0.95rem] leading-[1.2] tracking-[0.01em] sm:mb-4 sm:text-[1.15rem] sm:leading-none md:text-[1.3rem] ${invitationText.heading}`}>
                  Gift Guide
                </p>
                <Image
                  src="/weddingtimeline/gift.png"
                  alt="Gift guide"
                  width={288}
                  height={288}
                  className="h-48 w-48 object-contain opacity-90 sm:h-60 sm:w-60 md:h-72 md:w-72"
                  style={{ filter: "brightness(0) saturate(100%) invert(46%) sepia(18%) saturate(749%) hue-rotate(358deg) brightness(91%) contrast(89%)" }}
                />
              </div>
              <div className={`${INNER_BOX_CLASS} px-3 py-3 sm:px-4 sm:py-3.5`}>
                <p className={`${cormorant.className} text-left text-sm leading-snug sm:text-base sm:leading-relaxed ${invitationText.body}`}>
                  Your presence at our wedding is the greatest gift we could ask for. Your love, laughter, and company on our special day are more than enough. Should you wish to honor us with a gift, a monetary contribution toward our future together would be deeply appreciated and gratefully received.
                </p>
              </div>
            </div>

            <div className="border-t border-[#BB8A3D]/20 pt-6 sm:pt-8">
              <div className="mb-4 flex flex-col items-center sm:mb-5">
                <p className={`mb-3 px-2 text-center font-[family-name:var(--font-safira-march)] text-[0.95rem] leading-[1.2] tracking-[0.01em] sm:mb-4 sm:text-[1.15rem] sm:leading-none md:text-[1.3rem] ${invitationText.heading}`}>
                  Friendly Reminder
                </p>
                <Image
                  src="/Details/camera.png"
                  alt=""
                  width={288}
                  height={288}
                  className="h-48 w-48 object-contain opacity-90 sm:h-60 sm:w-60 md:h-72 md:w-72"
                  style={{ filter: "brightness(0) saturate(100%) invert(46%) sepia(18%) saturate(749%) hue-rotate(358deg) brightness(91%) contrast(89%)" }}
                  aria-hidden
                />
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className={`${INNER_BOX_CLASS} px-3 py-3 sm:px-4 sm:py-3.5`}>
                  <p className={`${cormorant.className} text-left text-sm leading-snug sm:text-base sm:leading-relaxed ${invitationText.body}`}>
                    We warmly invite you to capture special moments of our wedding. As the ceremony begins, we kindly ask that phones{" "}
                    <NameConnector size="sm">and</NameConnector>{" "}
                    cameras remain out of the aisle. Feel free to take photos discreetly from your seat, allowing our photographers to capture each moment without obstruction.
                  </p>
                </div>
                <div className={`${INNER_BOX_CLASS} space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-3.5`}>
                  <p className={`mx-auto flex max-w-[12.5rem] flex-col items-center gap-2 px-1 text-center font-[family-name:var(--font-safira-march)] text-[0.78rem] leading-[1.35] tracking-[0.01em] sm:max-w-[16rem] sm:text-[0.95rem] sm:leading-snug md:max-w-none md:text-[1.1rem] ${invitationText.heading}`}>
                    <span className="block">Can I bring children</span>
                    <span className="block">or tag along</span>
                    <span className="block">someone?</span>
                  </p>
                  <div className={`${cormorant.className} space-y-3 text-left text-sm leading-snug sm:text-base sm:leading-relaxed ${invitationText.body}`}>
                    <p>
                      Unfortunately, due to space and seating constraints, we kindly ask for your understanding that we cannot accommodate our lovely guest to bring a guest of their own.
                    </p>
                    <p>
                      Therefore, we request our guest not to bring plus one, unless they are specifically named on the invitation.
                    </p>
                    <p>
                      We adore your little ones — truly. However, we have lovingly planned this as an adults-only celebration so that every guest, including you, can fully relax, enjoy the program, and be present in the moment. We kindly ask that you make childcare arrangements for the day.
                    </p>
                    <p>Thank you so much for understanding!</p>
                  </div>
                  <p className={`${cormorant.className} text-center text-xs italic leading-relaxed sm:text-sm md:text-base ${invitationText.muted}`}>
                    &quot;When the time is right, I, the Lord, will make it happen.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </InvitationCard>
    </section>

      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(91,102,85,0.96)" }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.12 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.14, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] bg-motif-deep rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "var(--color-motif-cream)" }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: "linear-gradient(to right, var(--color-motif-cream), var(--color-motif-cream), var(--color-motif-deep))" }}
            />

            {/* Enhanced close button */}
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hover:bg-motif-accent backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group/close"
              title="Close (ESC)"
              style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)", color: "var(--color-motif-cream)" }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/close:text-[#E1D5C7] transition-colors" />
            </button>

            {/* Venue badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2"
                style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="var(--color-motif-cream)" style={{ color: "var(--color-motif-cream)" }} />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Ceremony Venue
                    </span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 text-motif-cream" />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Reception Venue
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image section with enhanced effects */}
            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: "var(--color-motif-deep)" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <Image
                src={showImageModal === "ceremony" ? "/Details/ceremony&location.jpg" : "/Details/Kayama Mountain Resort And Events Place, Sitio Kaytuyang, Brgy. Aga Nasugbu, Batangas.png"}
                alt={showImageModal === "ceremony" ? ceremonyLocationFormatted : receptionLocationFormatted}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            {/* Enhanced content section */}
            <div
              className={`${cormorant.className} p-5 sm:p-6 md:p-8 bg-motif-deep backdrop-blur-sm border-t-2 relative`}
              style={{ borderColor: "var(--color-motif-cream)" }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-motif-cream/30 to-transparent" />

              <div className="space-y-5">
                {/* Header with venue info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3`}
                      style={{ color: "var(--color-motif-cream)" }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6 text-motif-cream" fill="var(--color-motif-cream)" />
                      ) : (
                        <Utensils className="w-6 h-6 text-motif-cream" />
                      )}
                      {showImageModal === "ceremony" ? siteConfig.ceremony.venue : siteConfig.reception.venue}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-70 text-motif-cream">
                      <MapPin className="w-4 h-4 text-motif-cream" />
                      <span>
                        {showImageModal === "ceremony"
                          ? ceremonyLocationFormatted
                          : receptionLocationFormatted}
                      </span>
                    </div>

                    {/* Date & Time info */}
                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream" />
                        <span>
                          {formattedCeremonyDate} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream" />
                        <span>
                          {formattedReceptionDate} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony"
                            ? ceremonyLocation
                            : receptionLocation,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-motif-deep border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md hover:bg-motif-accent whitespace-nowrap text-motif-cream"
                      title="Copy address"
                      style={{ borderColor: "var(--color-motif-cream)" }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap bg-motif-cream text-white"
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                {/* Additional info */}
                  <div className="flex items-center gap-2 text-xs opacity-65 text-motif-cream">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
