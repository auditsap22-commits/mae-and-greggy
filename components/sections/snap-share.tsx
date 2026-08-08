"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import { InvitationCard } from "@/components/invitation-card"
import { NameConnector } from "@/components/couple-name-text"
import { QRCodeCanvas } from "qrcode.react"
import { useSiteConfig } from "@/hooks/use-site-config"
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
  "rounded-xl border border-[#BB8A3D]/25 bg-[#F5EDE0]/60 p-3 sm:rounded-2xl sm:p-5 md:p-7 lg:p-8"

const primaryBtnClass =
  "flex items-center justify-center gap-1.5 rounded-full border border-[#BB8A3D]/45 bg-[#BB8A3D] px-3 py-2 text-xs font-semibold uppercase text-[#FDFBF7] shadow-[0_4px_16px_rgba(139,111,71,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BB8A3D]/65 hover:bg-[#A67A35] hover:shadow-xl sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"

const outlineBtnClass =
  "flex items-center justify-center gap-1.5 rounded-full border border-[#BB8A3D]/35 bg-[#FDFBF7] px-3 py-2 text-xs font-semibold uppercase text-[#BB8A3D] shadow-sm transition-all duration-200 hover:border-[#BB8A3D]/55 hover:bg-[#F5EDE0]/80 hover:shadow-md sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"

const socialBtnClass =
  "group flex items-center justify-center gap-1.5 rounded-lg border border-[#BB8A3D]/25 bg-[#F5EDE0]/60 px-3 py-2.5 text-[#6B5335] shadow-md transition-all duration-200 hover:border-[#BB8A3D]/40 hover:bg-[#F5EDE0]/90 hover:shadow-lg sm:gap-2 sm:px-4 sm:py-3"

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

// QRCodeCanvas renders to <canvas> which cannot resolve CSS variables.
const MOTIF_DEEP_HEX = "#6B5335"

export function SnapShare() {
  const siteConfig = useSiteConfig()
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags] = useState(false)
  const [copiedDriveLink, setCopiedDriveLink] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const websiteUrl = typeof window !== "undefined" ? window.location.href : "https://example.com"
  const uploadLink = siteConfig.snapShare.googleDriveLink
  const hashtags = siteConfig.snapShare.hashtag
  const allHashtagsText = hashtags.join(" ")
  const groomNickname = siteConfig.couple.groomNickname
  const brideNickname = siteConfig.couple.brideNickname
  const sanitizedGroomName = groomNickname.replace(/\s+/g, "")
  const sanitizedBrideName = brideNickname.replace(/\s+/g, "")

  const shareText = `Celebrate ${groomNickname} & ${brideNickname}'s wedding! Explore the details and share your special memories: ${websiteUrl} ${allHashtagsText} ✨`

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const shareOnSocial = (platform: "instagram" | "facebook" | "twitter" | "tiktok") => {
    const encodedUrl = encodeURIComponent(websiteUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls: Record<string, string> = {
      instagram: `https://www.instagram.com/`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      tiktok: `https://www.tiktok.com/`,
    }

    const target = urls[platform]
    if (target) {
      window.open(target, "_blank", "width=600,height=400")
    }
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById("snapshare-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${sanitizedGroomName.toLowerCase()}-${sanitizedBrideName.toLowerCase()}-wedding-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadAlbumQRCode = () => {
    const canvas = document.getElementById("album-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "album-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtagIndex(index)
      setTimeout(() => setCopiedHashtagIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(allHashtagsText)
      setCopiedAllHashtags(true)
      setTimeout(() => setCopiedAllHashtags(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyUploadLink = async () => {
    if (uploadLink) {
      try {
        await navigator.clipboard.writeText(uploadLink)
        setCopiedDriveLink(true)
        setTimeout(() => setCopiedDriveLink(false), 2000)
      } catch (err) {
        console.error("Failed to copy: ", err)
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <section
      id="snap-share"
      className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12"
    >
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="w-full max-w-[440px] md:max-w-[500px] lg:max-w-[540px]"
      >
        <div className="space-y-6 sm:space-y-8">
          <motion.div
            className="flex flex-col items-center gap-3 text-center sm:gap-4 md:gap-5"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
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
              className={`flex flex-col items-center gap-2 px-2 font-[family-name:var(--font-safira-march)] text-[clamp(1.1rem,4.6vw,1.45rem)] leading-none tracking-[0.015em] sm:gap-2.5 sm:text-[1.5rem] sm:tracking-[0.01em] md:text-[2.1rem] lg:text-[2.65rem] ${invitationText.heading}`}
            >
              <span className="block">Capture</span>
              <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1.5">
                <NameConnector size="sm">and</NameConnector>
                <span className="mt-2">Share</span>
              </span>
              <span className="block">the Celebration</span>
            </h2>

            <p
              className={`${cormorant.className} mx-auto max-w-xl px-2 text-xs italic leading-relaxed sm:text-sm md:text-base ${invitationText.muted}`}
            >
              Help us remember the little moments of{" "}
              <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1 not-italic">
                <CoupleNameInline />
              </span>
              &apos;s day—every smile, embrace,{" "}
              <NameConnector size="sm">and</NameConnector>{" "}
              candid laugh. Your photos{" "}
              <NameConnector size="sm">and</NameConnector>{" "}
              clips complete our love story.
            </p>
          </motion.div>

          <motion.div
            className="space-y-3 sm:space-y-5 lg:space-y-6"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div className="flex flex-col space-y-3 sm:space-y-5 lg:space-y-6" variants={fadeInUp}>
              <div className="flex-1">
                <div className={`${INNER_PANEL_CLASS} flex h-full flex-col text-center`}>
                  <h4
                    className={`${cinzel.className} mb-2 text-base font-semibold uppercase sm:mb-3 sm:text-lg md:text-xl ${invitationText.heading}`}
                    style={{ letterSpacing: "0.08em" }}
                  >
                    Share Our Wedding Website
                  </h4>
                  <p
                    className={`${cormorant.className} mb-3 px-1 text-xs leading-relaxed sm:mb-4 sm:text-sm ${invitationText.body}`}
                  >
                    Spread the word about{" "}
                    <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1">
                      <CoupleNameInline />
                    </span>
                    &apos;s wedding celebration. Share this QR code with friends and family so they can join the celebration.
                  </p>
                  <div className="mx-auto mb-3 inline-flex flex-1 flex-col items-center justify-center rounded-xl border border-[#BB8A3D]/25 bg-white p-2.5 shadow-md sm:mb-4 sm:rounded-2xl sm:p-5 md:p-7">
                    <div className="mb-2 rounded-lg border border-[#BB8A3D]/15 bg-white p-1.5 sm:mb-3 sm:rounded-xl sm:p-3">
                      <div className="rounded-lg border border-[#BB8A3D]/10 bg-white p-1.5 shadow-sm sm:p-3">
                        <QRCodeCanvas
                          id="snapshare-qr"
                          value={websiteUrl}
                          size={isMobile ? 140 : 220}
                          includeMargin
                          className="bg-white"
                          fgColor={MOTIF_DEEP_HEX}
                        />
                      </div>
                    </div>
                    <button onClick={downloadQRCode} className={`${cormorant.className} ${primaryBtnClass} mx-auto`} style={{ letterSpacing: "0.15em" }}>
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Download QR
                    </button>
                  </div>
                  <p className={`${cormorant.className} mt-auto text-xs leading-relaxed sm:text-sm ${invitationText.muted}`}>
                    Scan with any camera app to open the full invitation and schedule.
                  </p>
                </div>
              </div>

              {hashtags.length > 0 && (
                <div className={`${INNER_PANEL_CLASS} text-center`}>
                  <div className="mb-2.5 flex items-center gap-2 text-center sm:mb-3">
                    <h5
                      className={`${cinzel.className} mx-auto text-center text-xs font-semibold uppercase sm:text-xs md:text-sm ${invitationText.heading}`}
                      style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      Wedding Hashtags
                    </h5>
                  </div>

                  <div className="mb-2.5 space-y-1.5 sm:mb-3">
                    {hashtags.map((hashtag, index) => (
                      <motion.button
                        key={index}
                        onClick={() => copyHashtag(hashtag, index)}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-all duration-200 active:scale-[0.98] sm:py-2.5 ${
                          copiedHashtagIndex === index
                            ? "border-[#BB8A3D]/45 bg-[#BB8A3D]/15"
                            : "border-[#BB8A3D]/20 bg-[#FDFBF7]/80 hover:border-[#BB8A3D]/35 hover:bg-[#F5EDE0]/80"
                        }`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <span
                          className={`${cormorant.className} flex-1 truncate text-left text-sm font-semibold sm:text-base ${
                            copiedHashtagIndex === index ? invitationText.heading : invitationText.body
                          }`}
                        >
                          {hashtag}
                        </span>
                        <span
                          className={`flex flex-shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider sm:text-xs ${
                            copiedHashtagIndex === index ? invitationText.accent : invitationText.muted
                          }`}
                        >
                          {copiedHashtagIndex === index ? (
                            <>
                              <Check className="h-3 w-3" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy
                            </>
                          )}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={copyAllHashtags}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 transition-all duration-200 active:scale-[0.98] sm:py-2.5 ${
                      copiedAllHashtags
                        ? "border-[#BB8A3D]/45 bg-[#BB8A3D]/15 text-[#6B5335]"
                        : "border-[#BB8A3D]/25 bg-[#FDFBF7]/80 text-[#7A6248] hover:border-[#BB8A3D]/40 hover:bg-[#F5EDE0]/80"
                    }`}
                  >
                    {copiedAllHashtags ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span
                      className={`${cormorant.className} text-xs font-semibold uppercase sm:text-sm`}
                      style={{ letterSpacing: "0.12em" }}
                    >
                      {copiedAllHashtags ? "All Copied!" : "Copy All"}
                    </span>
                  </button>
                </div>
              )}

              <div className={INNER_PANEL_CLASS}>
                <h5
                  className={`${cinzel.className} mb-2 text-center text-base font-semibold uppercase sm:mb-3 sm:text-lg md:text-xl ${invitationText.heading}`}
                  style={{ letterSpacing: "0.08em" }}
                >
                  Share on Social Media
                </h5>
                <p
                  className={`${cormorant.className} mb-3 text-center text-xs leading-relaxed sm:mb-4 sm:text-sm ${invitationText.body}`}
                >
                  Help spread the word about{" "}
                  <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1">
                    <CoupleNameInline />
                  </span>
                  &apos;s wedding celebration. Share the event across your favorite platforms.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <button onClick={() => shareOnSocial("instagram")} className={socialBtnClass}>
                    <Instagram className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                    <span className={`${cormorant.className} text-xs font-semibold uppercase sm:text-sm`} style={{ letterSpacing: "0.18em" }}>
                      Instagram
                    </span>
                  </button>
                  <button onClick={() => shareOnSocial("facebook")} className={socialBtnClass}>
                    <Facebook className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                    <span className={`${cormorant.className} text-xs font-semibold uppercase sm:text-sm`} style={{ letterSpacing: "0.18em" }}>
                      Facebook
                    </span>
                  </button>
                  <button onClick={() => shareOnSocial("tiktok")} className={socialBtnClass}>
                    <Share2 className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                    <span className={`${cormorant.className} text-xs font-semibold uppercase sm:text-sm`} style={{ letterSpacing: "0.18em" }}>
                      TikTok
                    </span>
                  </button>
                  <button onClick={() => shareOnSocial("twitter")} className={socialBtnClass}>
                    <Twitter className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                    <span className={`${cormorant.className} text-xs font-semibold uppercase sm:text-sm`} style={{ letterSpacing: "0.18em" }}>
                      Twitter
                    </span>
                  </button>
                </div>
              </div>

              {uploadLink && (
                <div>
                  <div className={`${INNER_PANEL_CLASS} text-center`}>
                    <div
                      className={`${cormorant.className} mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#BB8A3D]/25 bg-[#F5EDE0]/80 px-2.5 py-1 text-[10px] uppercase sm:mb-3 sm:gap-2 sm:text-xs ${invitationText.muted}`}
                      style={{ letterSpacing: "0.28em" }}
                    >
                      Upload Your Photos{" "}
                      <NameConnector size="sm">&</NameConnector>{" "}
                      Videos
                    </div>
                    <p
                      className={`${cormorant.className} mb-3 px-1 text-xs leading-relaxed sm:mb-4 sm:text-sm ${invitationText.body}`}
                    >
                      Help us capture our special day! Scan the QR or use the actions below to upload your photos{" "}
                      <NameConnector size="sm">and</NameConnector>{" "}
                      videos.
                    </p>
                    <div className="mx-auto mb-3 inline-flex flex-col items-center rounded-xl border border-[#BB8A3D]/25 bg-white p-2.5 shadow-md sm:mb-4 sm:rounded-2xl sm:p-5">
                      <div className="mb-2 rounded-lg border border-[#BB8A3D]/15 bg-white p-1.5 sm:mb-3 sm:rounded-xl sm:p-3">
                        <div className="rounded-lg border border-[#BB8A3D]/10 bg-white p-1.5 shadow-sm sm:p-3">
                          <QRCodeCanvas
                            id="album-qr"
                            value={uploadLink}
                            size={isMobile ? 150 : 220}
                            level="H"
                            includeMargin
                            className="bg-white"
                            fgColor={MOTIF_DEEP_HEX}
                          />
                        </div>
                      </div>
                      <p className={`${cormorant.className} text-xs sm:text-sm ${invitationText.accent}`}>Scan with your camera app</p>
                    </div>
                    <div className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-3">
                      <button
                        onClick={copyUploadLink}
                        className={`${cormorant.className} ${
                          copiedDriveLink
                            ? "border-[#BB8A3D]/45 bg-[#BB8A3D]/15 text-[#6B5335]"
                            : `${outlineBtnClass} text-[#BB8A3D]`
                        }`}
                        style={{ letterSpacing: "0.18em" }}
                      >
                        {copiedDriveLink ? (
                          <>
                            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Copy Link
                          </>
                        )}
                      </button>
                      <button onClick={downloadAlbumQRCode} className={`${cormorant.className} ${primaryBtnClass}`} style={{ letterSpacing: "0.18em" }}>
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Download QR
                      </button>
                      <a
                        href={uploadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${cormorant.className} ${socialBtnClass} rounded-full sm:rounded-lg`}
                        style={{ letterSpacing: "0.15em" }}
                      >
                        <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Upload Photos
                      </a>
                    </div>
                    <p className={`${cormorant.className} mt-2 text-xs leading-relaxed sm:mt-3 sm:text-sm ${invitationText.muted}`}>
                      or tap &quot;Upload Photos&quot; below.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          <motion.div className="text-center" variants={fadeInUp}>
            <div className={`${INNER_PANEL_CLASS} mx-auto`}>
              <p
                className={`${cormorant.className} mb-3 px-2 text-sm leading-relaxed sm:mb-4 sm:text-base md:text-lg ${invitationText.body}`}
              >
                Thank you for helping make{" "}
                <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1">
                  <CoupleNameInline />
                </span>
                &apos;s wedding celebration memorable. Your photos{" "}
                <NameConnector size="sm">and</NameConnector>{" "}
                messages create beautiful memories that we will treasure for a lifetime.
              </p>
              <div
                className={`${cormorant.className} flex items-center justify-center gap-2 text-xs uppercase sm:text-sm ${invitationText.muted}`}
                style={{ letterSpacing: "0.25em" }}
              >
                <span>Thank you for sharing the joy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </InvitationCard>
    </section>
  )
}
