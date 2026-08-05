"use client"

import { useState, useEffect } from "react"
import { RefreshCw, TrendingUp, Users, MapPin, Calendar, Crown } from "lucide-react"
import { InvitationCard } from "@/components/invitation-card"
import { NameConnector } from "@/components/couple-name-text"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400"],
})

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

const CARDS_PER_VIEW = 4

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
  "relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#BB8A3D]/30 bg-[#FDFBF7]/80 shadow-[0_4px_20px_rgba(139,111,71,0.12)]"

const GUEST_CARD_CLASS =
  "relative group rounded-xl border border-[#BB8A3D]/20 bg-[#F5EDE0]/60 p-2.5 transition-all duration-300 hover:border-[#BB8A3D]/35 hover:bg-[#F5EDE0]/80 hover:scale-[1.01] sm:rounded-2xl sm:p-4 md:p-6"

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

export function BookOfGuests() {
  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [justEntered, setJustEntered] = useState(false)

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  // Get visible guests (max 4 cards) for carousel
  const getVisibleGuests = () => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return confirmedGuests
    const visible: Guest[] = []
    for (let i = 0; i < CARDS_PER_VIEW; i++) {
      const index = (currentIndex + i) % confirmedGuests.length
      visible.push(confirmedGuests[index])
    }
    return visible
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  // Auto-rotate carousel every 5 seconds when more than 4 guests
  useEffect(() => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + CARDS_PER_VIEW
          return next >= confirmedGuests.length ? 0 : next
        })
        setIsTransitioning(false)
        setJustEntered(true)
        setTimeout(() => setJustEntered(false), 1100)
      }, 600)
    }, 5000)
    return () => clearInterval(interval)
  }, [confirmedGuests.length])

  return (
    <section
      id="guests"
      className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12"
    >
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="w-full max-w-[440px] md:max-w-[500px] lg:max-w-[540px]"
      >
        <div className="space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="flex flex-col items-center gap-3 text-center sm:gap-4 md:gap-5">
        <p
          className={`${cormorant.className} inline-flex flex-wrap items-baseline justify-center gap-y-1 text-[0.7rem] uppercase tracking-[0.28em] sm:text-xs md:text-sm ${invitationText.accent}`}
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
          className={`font-[family-name:var(--font-safira-march)] px-2 text-[clamp(1.4rem,5.8vw,1.8rem)] leading-none tracking-[0.015em] sm:text-[2.25rem] sm:tracking-[0.01em] md:text-[2.85rem] lg:text-[3.35rem] ${invitationText.heading}`}
        >
          Book of Guests
        </h2>

        <p
          className={`${cormorant.className} mx-auto max-w-lg px-2 text-xs italic leading-relaxed sm:px-4 sm:text-sm md:text-base ${invitationText.muted}`}
        >
          Meet the cherished souls joining us in celebration — your presence makes our day truly special
        </p>
      </div>

      {/* Guests content */}
      <div className={INNER_CARD_CLASS}>
          <div className="relative p-4 sm:p-5 md:p-6">
        {/* Stats */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="relative max-w-3xl mx-auto">
            <div className="relative">
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="group absolute right-0 top-0 z-10 rounded-full border border-[#BB8A3D]/30 bg-[#F5EDE0]/80 p-1.5 transition-all duration-300 hover:scale-110 disabled:opacity-50 sm:p-2"
                title="Refresh counts"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-[#BB8A3D] transition-transform duration-500 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`} />
              </button>

              <div className="mb-1.5 sm:mb-2.5">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <h3 className={`${cinzel.className} text-xl font-bold transition-all duration-500 sm:text-3xl md:text-4xl ${invitationText.heading} ${showIncrease ? "scale-110" : ""}`}>
                    {totalGuests}
                  </h3>
                  {showIncrease && (
                    <TrendingUp className={`h-3.5 w-3.5 animate-bounce sm:h-5 sm:w-5 ${invitationText.accent}`} />
                  )}
                  <p className={`${cormorant.className} text-sm font-medium leading-tight sm:text-lg md:text-xl ${invitationText.body}`}>
                    {totalGuests === 1 ? "Guest" : "Guests"} Celebrating With Us
                  </p>
                </div>
              </div>

              <p className={`${cormorant.className} mb-2 text-xs sm:mb-3 sm:text-base ${invitationText.muted}`}>
                {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
              </p>
              <p className={`${cormorant.className} text-[10px] leading-tight sm:text-xs md:text-sm ${invitationText.muted}`}>
                Thank you for confirming your RSVP! Your presence means the world to us.
              </p>
            </div>
          </div>
        </div>

        {/* Guest List Display - 4 cards with carousel */}
        {confirmedGuests.length > 0 && (
          <div>
            <div
              className="relative overflow-hidden"
              style={{
                perspective: "1200px",
                perspectiveOrigin: "center 85%",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`space-y-2 sm:space-y-3 md:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {getVisibleGuests().map((guest, index) => (
                  <div
                    key={`${guest.id}-${currentIndex}-${index}`}
                    className={`${GUEST_CARD_CLASS} ${justEntered ? "animate-guest-roll-in" : ""}`}
                    style={{
                      ...(justEntered
                        ? {
                            animationDelay: `${index * 120}ms`,
                            backfaceVisibility: "hidden",
                          }
                        : {}),
                    }}
                  >
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-2.5 md:mb-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#BB8A3D]/30 bg-[#FDFBF7] shadow-md sm:h-12 sm:w-12 md:h-14 md:w-14"
                      >
                        <span className={`text-xs font-semibold sm:text-base md:text-lg ${invitationText.heading}`}>
                          {getInitials(guest.name)}
                        </span>
                      </div>
                      {guest.isVip && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md border-2 border-white">
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3.5 md:w-3.5 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-1 sm:mb-1.5">
                        <h3 className={`${cinzel.className} mb-0.5 text-xs font-semibold leading-tight sm:text-base sm:font-bold md:text-lg ${invitationText.heading}`}>
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p className={`${cormorant.className} text-[9px] font-medium sm:text-[10px] md:text-xs ${invitationText.muted}`}>
                            {guest.role}
                          </p>
                        )}
                      </div>
{/* 
                      {guest.email && (
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs mb-1.5 sm:mb-2 md:mb-3 opacity-75" style={{ color: cardTextColor }}>
                          <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" style={{ color: accentColor }} />
                          <span className="truncate">{guest.email}</span>
                        </div>
                      )} */}

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                        <div className="flex items-center gap-0.5 rounded-lg border border-[#BB8A3D]/20 bg-[#FDFBF7]/70 px-1.5 py-0.5 sm:gap-1 sm:px-2 md:px-2.5 sm:py-1">
                          <Users className={`h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 ${invitationText.accent}`} />
                          <span className={`${cormorant.className} text-[9px] font-semibold sm:text-[10px] md:text-xs ${invitationText.body}`}>
                            {guest.allowedGuests} {guest.allowedGuests === 1 ? "Guest" : "Guests"}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 rounded-lg border border-[#BB8A3D]/20 bg-[#FDFBF7]/70 px-1.5 py-0.5 sm:gap-1 sm:px-2 md:px-2.5 sm:py-1">
                          <MapPin className={`h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 ${invitationText.accent}`} />
                          <span className={`${cormorant.className} text-[9px] font-semibold sm:text-[10px] md:text-xs ${invitationText.body}`}>
                            {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                              <>Table {guest.tableNumber}</>
                            ) : (
                              <span className={invitationText.muted}>Not Assigned</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* {guest.message && guest.message.trim() !== "" && (
                        <div
                          className="relative mb-1.5 sm:mb-2.5 md:mb-3 p-2 sm:p-3 md:p-5 rounded-lg md:rounded-xl border overflow-hidden"
                          style={{ backgroundColor: cardBg, borderColor: "color-mix(in srgb, var(--color-motif-accent) 15%, transparent)" }}
                        >
                          <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.06]" style={{ color: accentColor }}>
                            <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L100,0 L0,100 Z" /></svg>
                          </div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.06]" style={{ color: accentColor }}>
                            <svg viewBox="0 0 100 100" fill="currentColor"><path d="M100,100 L0,100 L100,0 Z" /></svg>
                          </div>
                          <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-2 md:left-2 opacity-20" style={{ color: accentColor }}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
                          </div>
                          <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 opacity-20" style={{ color: accentColor }}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 7h-3l-2 4v6h6v-6h-3zm-8 0H7l-2 4v6h6v-6h-3z" /></svg>
                          </div>
                          <div className="relative px-0.5 sm:px-1">
                            <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-base leading-tight sm:leading-relaxed italic font-medium`} style={{ color: cardTextColor }}>
                              {guest.message}
                            </p>
                          </div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-8 sm:h-12 md:h-16 rounded-r-full opacity-40 bg-motif-accent/40" />
                        </div>
                      )} */}

                      {guest.companions && guest.companions.length > 0 && (
                        <div className="pt-2 sm:pt-2.5 md:pt-3">
                          <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                            <Users className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 ${invitationText.accent}`} />
                            <span className={`${cormorant.className} text-[9px] font-semibold sm:text-[10px] md:text-xs ${invitationText.body}`}>Companions</span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {guest.companions.map((companion, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#BB8A3D]/20 bg-[#FDFBF7]/70 px-1.5 py-0.5 transition-colors hover:bg-[#FDFBF7] sm:gap-1.5 sm:px-2 md:px-2.5 sm:py-1"
                              >
                                <span className={`${cormorant.className} whitespace-nowrap text-[9px] font-medium sm:text-[10px] md:text-xs ${invitationText.body}`}>{companion.name}</span>
                                {companion.relationship && companion.relationship.trim() !== "" && (
                                  <span className={`${cormorant.className} whitespace-nowrap rounded-full border border-[#BB8A3D]/20 bg-[#F5EDE0]/80 px-1.5 py-0.5 text-[8px] font-medium sm:px-2 sm:text-[9px] md:text-[10px] ${invitationText.muted}`}>
                                    {companion.relationship}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1 pt-2 sm:pt-2.5 md:pt-3 mt-1.5 sm:mt-2 md:mt-2.5">
                        <Calendar className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${invitationText.muted}`} />
                        <span className={`${cormorant.className} text-[8px] sm:text-[9px] md:text-[10px] ${invitationText.muted}`}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Carousel indicators */}
              {confirmedGuests.length > CARDS_PER_VIEW && (
                <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                  {Array.from({ length: Math.ceil(confirmedGuests.length / CARDS_PER_VIEW) }).map((_, idx) => {
                    const pageIndex = Math.floor(currentIndex / CARDS_PER_VIEW)
                    const isActive = pageIndex === idx
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setCurrentIndex(idx * CARDS_PER_VIEW)
                            setIsTransitioning(false)
                            setJustEntered(true)
                            setTimeout(() => setJustEntered(false), 1100)
                          }, 600)
                        }}
                        className={`h-2 rounded-full transition-all duration-300 hover:opacity-90 ${isActive ? "w-7 bg-[#BB8A3D]" : "w-2 bg-[#BB8A3D]/40"}`}
                        aria-label={`Go to page ${idx + 1}`}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
          </div>
      </div>
        </div>
      </InvitationCard>
    </section>
  )
}