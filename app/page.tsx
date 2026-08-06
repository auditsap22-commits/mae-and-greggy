"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Silk from "@/components/silk"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { Hero as InvitationGate } from "@/components/loader/Hero"
import { Hero as MainHero } from "@/components/sections/hero"
import { Welcome } from "@/components/sections/welcome"
import { Countdown } from "@/components/sections/countdown"
import { Gallery } from "@/components/sections/gallery"
import { Messages } from "@/components/sections/messages"
import { Details } from "@/components/sections/details"
import { Entourage } from "@/components/sections/entourage"
import { PrincipalSponsors } from "@/components/sections/principal-sponsors"
import { BookOfGuests } from "@/components/sections/book-of-guests"
import { Registry } from "@/components/sections/registry"
import { FAQ } from "@/components/sections/faq"
import { GuestInformation } from "@/components/sections/guest-information"
import { Footer } from "@/components/sections/footer"
import { LoveStory } from "@/components/sections/love-story"
import { WeddingPlaylist } from "@/components/sections/wedding-playlist"
import { Navbar } from "@/components/navbar"
import { SnapShare } from "@/components/sections/snap-share"
import { CoupleVideo } from "@/components/sections/couple-video"

const GuestList = dynamic(() => import("@/components/sections/guest-list").then(mod => ({ default: mod.GuestList })), { ssr: false })

type AppState = "loading" | "gate" | "open"

export default function Home() {
  const enableDecor = process.env.NEXT_PUBLIC_ENABLE_DECOR !== "false"
  const [appState, setAppState] = useState<AppState>("loading")

  // When returning from /gallery, skip the ceremony and scroll to the hash in the URL
  useEffect(() => {
    const returning = sessionStorage.getItem("returnFromGallery")
    if (returning === "true") {
      sessionStorage.removeItem("returnFromGallery")
      setAppState("open")
    }
    const hash = window.location.hash
    if (!hash) return
    const id = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => clearTimeout(id)
  }, [])

  const handleLoadingComplete = () => setAppState("gate")

  const handleOpen = () => setAppState("open")

  return (
      <div
        className={`relative min-h-screen overflow-x-hidden font-sans text-charcoal selection:bg-birch selection:text-nut ${
          enableDecor ? "bg-transparent" : "bg-[#E2CBAE]"
        }`}
      >
        {enableDecor && (
          <div className="pointer-events-none fixed inset-0 z-0">
            <Silk
              speed={5}
              scale={1.1}
              color="#E2CBAE"
              noiseIntensity={0.8}
              rotation={0.3}
            />
            <div className="site-vignette absolute inset-0" aria-hidden />
          </div>
        )}

        {appState === "loading" && <LoadingScreen onComplete={handleLoadingComplete} />}
        {appState !== "open" && <InvitationGate visible={appState === "gate"} onOpen={handleOpen} />}

        {appState === "open" && (
          <>
            <Navbar />
            <main className="relative w-full min-h-screen animate-in fade-in duration-700">
              <div className="relative z-10">
                {/* Spacer for fixed navbar + safe area */}
                <div
                  className="h-[calc(3rem+env(safe-area-inset-top,0px))] sm:h-[calc(3.5rem+env(safe-area-inset-top,0px))] md:h-[calc(4rem+env(safe-area-inset-top,0px))]"
                  aria-hidden
                />
                <MainHero />
              <Welcome />
              <Countdown />
              <Entourage />
              <Details />
              <GuestList />
              <BookOfGuests />
              <Messages />
              <FAQ />
              {/* <Registry /> */}
              <SnapShare />
              <Footer />
            </div>
          </main>
          </>
        )}
      </div>
  )
}
