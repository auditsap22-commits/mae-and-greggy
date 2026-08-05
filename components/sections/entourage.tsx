"use client"

import React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { entourage as staticEntourage, principalSponsors as staticSponsors } from "@/content/site"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Loader2, Users } from "lucide-react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { InvitationCard } from "@/components/invitation-card"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

interface EntourageMember {
  name: string
  roleCategory: string
  roleTitle: string
  email: string
}

interface PrincipalSponsor {
  malePrincipalSponsor: string
  femalePrincipalSponsor: string
}

/** Accepts PascalCase from API / Sheets or camelCase */
function entourageMemberFromApi(row: Record<string, unknown>): EntourageMember {
  const r = row as Record<string, string | undefined>
  return {
    name: r.name ?? r.Name ?? "",
    roleCategory: r.roleCategory ?? r.RoleCategory ?? "",
    roleTitle: r.roleTitle ?? r.RoleTitle ?? "",
    email: r.email ?? r.Email ?? "",
  }
}

function principalSponsorFromApi(row: Record<string, unknown>): PrincipalSponsor {
  const r = row as Record<string, string | undefined>
  return {
    malePrincipalSponsor: r.malePrincipalSponsor ?? r.MalePrincipalSponsor ?? "",
    femalePrincipalSponsor: r.femalePrincipalSponsor ?? r.FemalePrincipalSponsor ?? "",
  }
}

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

function mapStaticEntourage(): EntourageMember[] {
  const roleToCategory: Record<string, string> = {
    "Best Man": "Best Man",
    "Matron of Honor": "Matron of Honor",
    "Maid of Honor": "Maid of Honor",
    "Bridesmaid": "Bridesmaids",
    "Groomsman": "Groomsmen",
    "Father": "Parents of the Bride",
    "Mother": "Parents of the Bride",
    "Brother": "Parents of the Groom",
    "Flower Girl": "Flower Girls",
    "Little Bride": "Little Bride",
    "Little Groom": "Little Groom",
    "Ring Bearer": "Ring Bearer",
    "Coin Bearer": "Coin Bearer",
    "Bible Bearer": "Bible Bearer",
  }
  return staticEntourage.map(({ role, name, group }) => {
    let category = roleToCategory[role] ?? (role.endsWith("s") ? role : role + "s")
    if (group === "kate-family") category = "Parents of the Bride"
    if (group === "christian-family") category = "Parents of the Groom"
    if (group === "candle") category = "Candle Sponsors"
    if (group === "cord") category = "Cord Sponsors"
    if (group === "veil") category = "Veil Sponsors"
    return { name, roleTitle: role, roleCategory: category, email: "" }
  }).filter((member) => member.name.trim().length > 0)
}

function mapStaticSponsors(): PrincipalSponsor[] {
  return staticSponsors
    .filter((s) => s.name || s.spouse)
    .map(({ name, spouse }) => ({
      malePrincipalSponsor: name || "",
      femalePrincipalSponsor: spouse || "",
    }))
}

const ROLE_CATEGORY_ORDER = [
  "OFFICIATING MINISTER",
  "The Couple",
  "Parents of the Groom",
  "Parents of the Bride",
  "Family of the Groom",
  "Family of the Bride",
  "Matron of Honor",
  "Best Man",
  "Maid of Honor",
  "Candle Sponsors",
  "Veil Sponsors",
  "Cord Sponsors",
  "Groomsmen",
  "Bridesmaids",
  "Little Groom",
  "Little Bride",
  "Ring Bearer",
  "Bible Bearer",
  "Coin Bearer",
  "Flower Girls",
]

/** Categories with dedicated combined layouts below — not the default single-title block. */
const HIDDEN_ROLE_CATEGORIES = new Set<string>([
  "Matron of Honor",
  "Ring Bearer",
  "Bible Bearer",
  "Coin Bearer",
])

function normalizeRoleCategory(category: string): string {
  const normalized = category.trim()
  if (normalized.toLowerCase() === "officiating minister") {
    return "OFFICIATING MINISTER"
  }
  return normalized
}

/** Title case per word; uses Unicode letters so ñe → Ñe (not ñE from ASCII-only `/\b\w/g`). */
function toTitleCaseDisplayName(name: string): string {
  const lower = name.toLocaleLowerCase("es")
  return lower.replace(
    /(^|[\s'\-])(\p{L})/gu,
    (_, sep: string, letter: string) => sep + letter.toLocaleUpperCase("es")
  )
}

function sortParents(members: EntourageMember[]): EntourageMember[] {
  return [...members].sort((a, b) => {
    const aIsFather = a.roleTitle?.toLowerCase().includes("father") ?? false
    const bIsFather = b.roleTitle?.toLowerCase().includes("father") ?? false
    if (aIsFather && !bIsFather) return -1
    if (!aIsFather && bIsFather) return 1
    return 0
  })
}

export function Entourage() {
  const siteConfig = useSiteConfig()
  const [entourage, setEntourage] = useState<EntourageMember[]>([])
  const [sponsors, setSponsors] = useState<PrincipalSponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const fetchEntourage = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/entourage", { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch entourage")
      const data: unknown = await response.json()
      const list =
        Array.isArray(data) && data.length > 0
          ? data.map((row) => entourageMemberFromApi(row as Record<string, unknown>))
          : mapStaticEntourage()
      setEntourage(list)
    } catch (err: unknown) {
      console.error("Failed to load entourage:", err)
      setEntourage(mapStaticEntourage())
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSponsors = async () => {
    try {
      const res = await fetch("/api/principal-sponsor", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load principal sponsors")
      const data: unknown = await res.json()
      const list =
        Array.isArray(data) && data.length > 0
          ? data.map((row) => principalSponsorFromApi(row as Record<string, unknown>)).filter((s) => s.malePrincipalSponsor || s.femalePrincipalSponsor)
          : mapStaticSponsors()
      setSponsors(list)
    } catch (e: unknown) {
      console.error("Failed to load sponsors:", e)
      setSponsors(mapStaticSponsors())
    }
  }

  useEffect(() => {
    fetchEntourage()
    fetchSponsors()

    // Set up auto-refresh listener for dashboard updates
    const handleEntourageUpdate = () => {
      setTimeout(() => {
        fetchEntourage()
        fetchSponsors()
      }, 1000)
    }

    window.addEventListener("entourageUpdated", handleEntourageUpdate)

    return () => {
      window.removeEventListener("entourageUpdated", handleEntourageUpdate)
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Group entourage by role category
  const grouped = useMemo(() => {
    const grouped: Record<string, EntourageMember[]> = {}
    
    entourage.forEach((member) => {
      const category = normalizeRoleCategory(member.roleCategory)

      // Skip members without a category or in "Other"
      if (!category || category === "Other") {
        return
      }
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(member)
    })
    
    return grouped
  }, [entourage])

  const coupleMembers = grouped["The Couple"] ?? []
  const coupleGroom =
    coupleMembers.find((m) => m.roleTitle?.toLowerCase().includes("groom")) ??
    (coupleMembers.length >= 1
      ? coupleMembers[0]
      : {
          name: siteConfig.couple.groom,
          roleCategory: "The Couple",
          roleTitle: "Groom",
          email: "",
        })
  const coupleBride =
    coupleMembers.find((m) => m.roleTitle?.toLowerCase().includes("bride")) ??
    (coupleMembers.length >= 2
      ? coupleMembers[1]
      : {
          name: siteConfig.couple.bride,
          roleCategory: "The Couple",
          roleTitle: "Bride",
          email: "",
        })

  const officiatingMinister = grouped["OFFICIATING MINISTER"] ?? []

  const parentsGroom = useMemo(
    () => sortParents(grouped["Parents of the Groom"] ?? []),
    [grouped]
  )
  const parentsBride = useMemo(
    () => sortParents(grouped["Parents of the Bride"] ?? []),
    [grouped]
  )
  const hasParentsSection = parentsGroom.length > 0 || parentsBride.length > 0

  // Helper component for elegant section titles (category labels)
  const SectionTitle = ({
    children,
    align = "center",
    className = "",
  }: {
    children: React.ReactNode
    align?: "left" | "center" | "right"
    className?: string
  }) => {
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <h3
        className={`relative ${cinzel.className} text-[0.7rem] sm:text-[0.85rem] md:text-base lg:text-lg tracking-[0.2em] uppercase mb-2 sm:mb-2.5 md:mb-3 ${textAlign} ${className} transition-all duration-300 whitespace-nowrap ${invitationText.accent}`}
      >
        {children}
      </h3>
    )
  }

  // Helper component for name items with role title (supports alignment)
  const NameItem = ({
    member,
    align = "center",
    showRole = false,
  }: {
    member: EntourageMember
    align?: "left" | "center" | "right"
    showRole?: boolean
  }) => {
    const containerAlign =
      align === "right" ? "items-end" : align === "left" ? "items-start" : "items-center"
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <div
        className={`relative flex flex-col ${containerAlign} justify-center py-0.5 sm:py-1 md:py-1 leading-snug sm:leading-snug group/item transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03]`}
      >
        <div
          className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
          style={{ background: "color-mix(in srgb, #BB8A3D 10%, transparent)" }}
        />
        <p
          className={`relative text-[10px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13.5px] font-semibold ${textAlign} transition-all duration-300 ${invitationText.heading}`}
        >
          {toTitleCaseDisplayName(member.name)}
        </p>
        {showRole && member.roleTitle && (
          <p
            className={`relative text-[9px] sm:text-[10px] md:text-[10px] lg:text-xs font-medium mt-0 leading-tight ${textAlign} tracking-wide uppercase transition-colors duration-300 ${invitationText.muted}`}
          >
            {member.roleTitle}
          </p>
        )}
      </div>
    )
  }

  // Helper component for two-column layout wrapper
  const TwoColumnLayout = ({ 
    children, 
    leftTitle, 
    rightTitle,
    singleTitle,
    centerContent = false 
  }: { 
    children: React.ReactNode
    leftTitle?: string
    rightTitle?: string
    singleTitle?: string
    centerContent?: boolean
  }) => {
    if (singleTitle) {
      return (
        <div className="mb-2 sm:mb-2.5 md:mb-3">
          <SectionTitle>{singleTitle}</SectionTitle>
          <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-0.5 sm:gap-y-1 md:gap-y-1 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-2 sm:mb-2.5 md:mb-3">
        <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 mb-2 sm:mb-2.5 md:mb-3">
          {leftTitle && (
            <SectionTitle align="right" className="pr-1 sm:pr-1.5 md:pr-2">{leftTitle}</SectionTitle>
          )}
          {rightTitle && (
            <SectionTitle align="left" className="pl-1 sm:pl-1.5 md:pl-2">{rightTitle}</SectionTitle>
          )}
        </div>
        <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-0.5 sm:gap-y-1 md:gap-y-1 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <section
        ref={sectionRef}
        id="entourage"
        className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12"
      >
        <InvitationCard
          decorations={CORNER_DECORATIONS}
          className={`w-full max-w-[440px] transition-all duration-1000 md:max-w-[500px] lg:max-w-[540px] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Section Header */}
            <div
              className={`flex flex-col items-center gap-3 text-center transition-all duration-1000 sm:gap-4 md:gap-5 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
              }`}
            >
              <p
                className={`${cormorant.className} max-w-xs text-[0.7rem] uppercase leading-relaxed tracking-[0.28em] sm:max-w-sm sm:text-xs md:text-sm ${invitationText.muted}`}
              >
                <span className="block">Those who stand with</span>
                <span className={`mt-1 block tracking-[0.22em] sm:tracking-[0.24em] ${invitationText.accent}`}>
                  {siteConfig.couple.groomNickname} &amp; {siteConfig.couple.brideNickname}
                </span>
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
                Wedding Entourage
              </h2>

              <p
                className={`${cormorant.className} mx-auto max-w-xl px-2 text-xs italic leading-relaxed sm:text-sm md:text-base ${invitationText.muted}`}
              >
                Honoring those who share in our joy
              </p>
            </div>

            {/* Entourage list */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
            {isLoading ? (
              <div className="flex items-center justify-center py-16 sm:py-20 md:py-24">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className={`h-10 w-10 animate-spin sm:h-12 sm:w-12 ${invitationText.accent}`} />
                  <span className={`font-serif text-base sm:text-lg ${invitationText.muted}`}>Loading entourage...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16 sm:py-20 md:py-24">
                <div className="text-center">
                  <p className={`font-serif text-base sm:text-lg mb-3 ${invitationText.body}`}>{error}</p>
                  <button
                    onClick={fetchEntourage}
                    className={`font-serif underline transition-colors duration-200 hover:opacity-80 ${invitationText.accent}`}
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : entourage.length === 0 ? (
              <div className="text-center py-16 sm:py-20 md:py-24">
                <Users className={`h-14 w-14 mx-auto mb-4 opacity-40 sm:h-16 sm:w-16 ${invitationText.accent}`} />
                <p className={`font-serif text-base sm:text-lg ${invitationText.muted}`}>No entourage members yet</p>
              </div>
            ) : (
            <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
              {/* The Couple — always shown (API data or site config fallback) */}
              <div key="TheCouple">
                <TwoColumnLayout singleTitle="The Couple" centerContent={true}>
                  <div className="px-1.5 sm:px-2 md:px-2.5">
                    <NameItem member={coupleGroom} align="right" />
                  </div>
                  <div className="px-1.5 sm:px-2 md:px-2.5">
                    <NameItem member={coupleBride} align="left" />
                  </div>
                </TwoColumnLayout>
              </div>

              {hasParentsSection && (
                <div key="Parents">
                  <TwoColumnLayout leftTitle="Groom’s Parents" rightTitle="Bride’s Parents">
                    {(() => {
                      const maxLen = Math.max(parentsGroom.length, parentsBride.length)
                      const rows = []
                      for (let i = 0; i < maxLen; i++) {
                        const left = parentsGroom[i]
                        const right = parentsBride[i]
                        rows.push(
                          <React.Fragment key={`parents-row-${i}`}>
                            <div className="px-1.5 sm:px-2 md:px-2.5">
                              {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                            </div>
                            <div className="px-1.5 sm:px-2 md:px-2.5">
                              {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                            </div>
                          </React.Fragment>
                        )
                      }
                      return rows
                    })()}
                  </TwoColumnLayout>
                </div>
              )}

              {/* Officiating Minister */}
              {officiatingMinister.length > 0 && (
                <div key="OfficiatingMinister">
                  <TwoColumnLayout singleTitle="OFFICIATING MINISTER" centerContent={true}>
                    {officiatingMinister.map((member, idx) => (
                      <div
                        key={`officiating-${idx}-${member.name}`}
                        className="px-1.5 sm:px-2 md:px-2.5 min-[350px]:col-span-2 flex justify-center"
                      >
                        <NameItem member={member} align="center" showRole={false} />
                      </div>
                    ))}
                  </TwoColumnLayout>
                </div>
              )}

              {/* Principal Sponsors */}
              {sponsors.length > 0 && (
                <div key="PrincipalSponsors">
                  <TwoColumnLayout singleTitle="Principal Sponsors" centerContent={true}>
                    {sponsors.map((sponsor, idx) => (
                      <React.Fragment key={`sponsor-row-${idx}`}>
                        <div className="px-1.5 sm:px-2 md:px-2.5">
                          {sponsor.malePrincipalSponsor ? (
                            <NameItem
                              member={{
                                name: sponsor.malePrincipalSponsor,
                                roleCategory: "",
                                roleTitle: "",
                                email: "",
                              }}
                              align="right"
                              showRole={false}
                            />
                          ) : (
                            <div className="py-0.5 sm:py-1 md:py-1.5" />
                          )}
                        </div>
                        <div className="px-1.5 sm:px-2 md:px-2.5">
                          {sponsor.femalePrincipalSponsor ? (
                            <NameItem
                              member={{
                                name: sponsor.femalePrincipalSponsor,
                                roleCategory: "",
                                roleTitle: "",
                                email: "",
                              }}
                              align="left"
                              showRole={false}
                            />
                          ) : (
                            <div className="py-0.5 sm:py-1 md:py-1.5" />
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </TwoColumnLayout>
                </div>
              )}

              {ROLE_CATEGORY_ORDER.map((category) => {
                const members = grouped[category] || []
                
                if (members.length === 0) return null
                if (HIDDEN_ROLE_CATEGORIES.has(category)) return null

                // Already rendered above
                if (
                  category === "The Couple" ||
                  category === "OFFICIATING MINISTER" ||
                  category === "Parents of the Groom" ||
                  category === "Parents of the Bride"
                ) {
                  return null
                }

                // Special handling for Family of the Groom/Bride - combine into single two-column layout
                if (category === "Family of the Groom" || category === "Family of the Bride") {
                  const familyGroom = grouped["Family of the Groom"] || []
                  const familyBride = grouped["Family of the Bride"] || []

                  if (category === "Family of the Groom") {
                    return (
                      <div key="Family">
                        <TwoColumnLayout leftTitle="Family of the Groom" rightTitle="Family of the Bride">
                          {(() => {
                            const maxLen = Math.max(familyGroom.length, familyBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = familyGroom[i]
                              const right = familyBride[i]
                              rows.push(
                                <React.Fragment key={`family-row-${i}`}>
                                  <div key={`family-groom-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`family-bride-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return null
                }

                // Special handling for Maid/Matron of Honor and Best Man - combine into single two-column layout
                if (category === "Matron of Honor" || category === "Maid of Honor" || category === "Best Man") {
                  // Get both honor attendant groups - combine Maid and Matron of Honor
                  const maidOfHonor = grouped["Maid of Honor"] || []
                  const bestMan = grouped["Best Man"] || []
                  
                  // Only render once (when processing "Best Man")
                  if (category === "Best Man") {
                    return (
                      <div key="HonorAttendants">
                        <TwoColumnLayout leftTitle="Best Man" rightTitle="Maid of Honor">
                          {(() => {
                            const maxLen = Math.max(bestMan.length, maidOfHonor.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = bestMan[i]
                              const right = maidOfHonor[i]
                              rows.push(
                                <React.Fragment key={`honor-row-${i}`}>
                                  <div key={`maid-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`bestman-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Matron of Honor" and "Maid of Honor" since they're already rendered above
                  return null
                }

                // Special handling for Little Groom and Little Bride - combine into single two-column layout
                if (category === "Little Groom" || category === "Little Bride") {
                  // Get both little ones groups
                  const littleGroom = grouped["Little Groom"] || []
                  const littleBride = grouped["Little Bride"] || []
                  
                  // Only render once (when processing "Little Groom")
                  if (category === "Little Groom") {
                    return (
                      <div key="LittleOnes">
                        <TwoColumnLayout leftTitle="Little Groom" rightTitle="Little Bride">
                          {(() => {
                            const maxLen = Math.max(littleGroom.length, littleBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = littleGroom[i]
                              const right = littleBride[i]
                              rows.push(
                                <React.Fragment key={`little-row-${i}`}>
                                  <div key={`littlegroom-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`littlebride-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Little Bride" since it's already rendered above
                  return null
                }

                // Special handling for Bridesmaids and Groomsmen - combine into single two-column layout
                if (category === "Bridesmaids" || category === "Groomsmen") {
                  // Get both bridal party groups
                  const bridesmaids = grouped["Bridesmaids"] || []
                  const groomsmen = grouped["Groomsmen"] || []
                  
                  // Only render once (when processing "Bridesmaids")
                  if (category === "Bridesmaids") {
                    return (
                      <React.Fragment key="BridalPartySection">
                        {/* Groomsmen/Bridesmaids section */}
                        <div key="BridalParty">
                          <TwoColumnLayout leftTitle="Groomsmen" rightTitle="Bridesmaids">
                            {(() => {
                              const maxLen = Math.max(bridesmaids.length, groomsmen.length)
                              const rows = []
                              for (let i = 0; i < maxLen; i++) {
                                const groomsman = groomsmen[i]
                                const bridesmaid = bridesmaids[i]
                                rows.push(
                                  <React.Fragment key={`bridal-row-${i}`}>
                                    <div key={`groomsman-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                      {groomsman ? <NameItem member={groomsman} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                    <div key={`bridesmaid-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                      {bridesmaid ? <NameItem member={bridesmaid} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                  </React.Fragment>
                                )
                              }
                              return rows
                            })()}
                          </TwoColumnLayout>
                        </div>
                      </React.Fragment>
                    )
                  }
                  // Skip rendering for "Groomsmen" since it's already rendered above
                  return null
                }

                // Secondary Sponsors block: render all three groups under one heading
                if (category === "Candle Sponsors" || category === "Veil Sponsors" || category === "Cord Sponsors") {
                  // Only render the full block once — when processing the first one that exists in order
                  const secondarySponsorGroups = ["Candle Sponsors", "Veil Sponsors", "Cord Sponsors"] as const
                  const firstPresentGroup = secondarySponsorGroups.find((g) => (grouped[g]?.length ?? 0) > 0)
                  if (category !== firstPresentGroup) return null

                  const renderPairedGroup = (groupName: string) => {
                    const grpMembers = grouped[groupName] || []
                    if (grpMembers.length === 0) return null
                    return (
                      <div key={groupName} className="mb-2 sm:mb-2.5 md:mb-3">
                        <TwoColumnLayout singleTitle={groupName} centerContent={true}>
                          {grpMembers.length === 2 ? (
                            <>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={grpMembers[0]} align="right" />
                              </div>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={grpMembers[1]} align="left" />
                              </div>
                            </>
                          ) : (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1">
                                {grpMembers.map((member, idx) => (
                                  <NameItem key={`${groupName}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return (
                    <div key="SecondarySponsorBlock">
                      {/* Parent heading */}
                      <div className="mb-2 sm:mb-2.5 md:mb-3">
                        <SectionTitle>Secondary Sponsors</SectionTitle>
                      </div>
                      {secondarySponsorGroups.map(renderPairedGroup)}
                    </div>
                  )
                }

                // Default: single title, centered content
                return (
                  <div key={category}>
                    <TwoColumnLayout singleTitle={category} centerContent={true}>
                      {(() => {
                        const SINGLE_COLUMN_SECTIONS = new Set([
                          "Best Man",
                          "Maid of Honor",
                          "Ring Bearer",
                          "Coin Bearer",
                          "Bible Bearer",
                          "Flower Girls",
                          "Presider",
                        ])
                        // Special rule: paired sponsor roles with exactly 2 names should meet at center
                        const PAIRED_SECTIONS = new Set(["Candle Sponsors", "Cord Sponsors", "Veil Sponsors"])
                        if (PAIRED_SECTIONS.has(category) && members.length === 2) {
                          const left = members[0]
                          const right = members[1]
                          return (
                            <>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={left} align="right" />
                              </div>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={right} align="left" />
                              </div>
                            </>
                          )
                        }
                        if (SINGLE_COLUMN_SECTIONS.has(category) || members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Default two-column sections: render row-by-row pairs to keep alignment on small screens
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
              
              {/* Display any other categories not in the ordered list */}
              {Object.keys(grouped).filter(cat => !ROLE_CATEGORY_ORDER.includes(cat) && cat !== "Other").map((category) => {
                const members = grouped[category]
                return (
                  <div key={category}>
                    <TwoColumnLayout singleTitle={category} centerContent={true}>
                      {(() => {
                        if (members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Pair row-by-row for other categories as well
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
            </div>
            )}
            </div>
          </div>
        </InvitationCard>
      </section>
    </div>
  )
}