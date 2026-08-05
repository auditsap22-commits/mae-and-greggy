"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageCircle, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const invitationText = {
  accent: "text-[#BB8A3D]",
  heading: "text-[#6B5335]",
  body: "text-[#7A6248]",
  muted: "text-[#8B7355]",
}

const MESSAGE_CARD_CLASS =
  "relative group overflow-hidden rounded-xl border border-[#BB8A3D]/20 bg-[#F5EDE0]/60 transition-all duration-500 hover:border-[#BB8A3D]/35 hover:bg-[#F5EDE0]/80 hover:scale-[1.01] sm:rounded-2xl"

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageWallDisplayProps {
  messages: Message[]
  loading: boolean
}

export default function MessageWallDisplay({ messages, loading }: MessageWallDisplayProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (messages.length > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setVisibleMessages(messages)
        setIsAnimating(false)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setVisibleMessages([])
    }
  }, [messages])

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${MESSAGE_CARD_CLASS} p-3 sm:p-4 md:p-5`}>
            <div className="mb-2 flex items-start justify-between sm:mb-3 md:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                <Skeleton className="h-7 w-7 rounded-full bg-[#BB8A3D]/15 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-3 w-20 bg-[#BB8A3D]/15 sm:w-24 md:w-32" />
                  <Skeleton className="h-2.5 w-16 bg-[#BB8A3D]/10 sm:w-20 md:w-24" />
                </div>
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-lg bg-[#BB8A3D]/10 sm:h-14 md:h-16" />
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="px-2 py-6 text-center sm:px-4 sm:py-10 md:py-14 lg:py-16">
        <div className="relative mb-4 inline-block sm:mb-5 md:mb-6 lg:mb-8">
          <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#BB8A3D]/30 bg-[#F5EDE0]/80 shadow-lg sm:h-14 sm:w-14 md:h-16 md:w-16">
            <MessageCircle className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 ${invitationText.accent}`} />
          </div>
        </div>
        <h3
          className={`mb-2 flex flex-col items-center gap-2 font-[family-name:var(--font-safira-march)] text-[1.2rem] leading-none tracking-[0.01em] sm:mb-3 sm:gap-2.5 sm:text-[1.45rem] md:mb-4 md:text-[1.75rem] lg:text-[2rem] ${invitationText.heading}`}
        >
          <span className="block">No Messages</span>
          <span className="block">Yet</span>
        </h3>
        <p
          className={`${cormorant.className} mx-auto mb-4 max-w-md text-xs leading-relaxed sm:mb-5 sm:text-sm md:mb-6 md:text-base lg:text-lg ${invitationText.muted}`}
        >
          Be the first to share your heartfelt wishes for the happy couple!
        </p>
        <div className="mt-4 flex justify-center sm:mt-5 md:mt-6 lg:mt-8">
          <div className="flex items-center gap-2 rounded-full border border-[#BB8A3D]/25 bg-[#F5EDE0]/60 px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
            <Sparkles className={`h-3 w-3 animate-pulse sm:h-4 sm:w-4 ${invitationText.accent}`} />
            <span className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm ${invitationText.muted}`}>
              Your message will appear here
            </span>
            <Sparkles
              className={`h-3 w-3 animate-pulse sm:h-4 sm:w-4 ${invitationText.accent}`}
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5">
      {visibleMessages.map((msg, index) => (
        <div
          key={index}
          className={`${MESSAGE_CARD_CLASS} transform ${
            isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            animation: isAnimating ? "none" : "fadeInUp 0.6s ease-out forwards",
          }}
        >
          <div className="relative p-3 sm:p-4 md:p-5">
            <div className="mb-2 flex items-start justify-between sm:mb-2.5 md:mb-3">
              <div className="flex min-w-0 items-center space-x-2 sm:space-x-2.5 md:space-x-3">
                <div className="relative shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#BB8A3D]/30 bg-[#FDFBF7]/90 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 md:h-11 md:w-11">
                    <span className={`${cormorant.className} text-xs font-semibold sm:text-sm md:text-base ${invitationText.heading}`}>
                      {msg.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:gap-x-2">
                    <h4 className={`${cormorant.className} text-xs font-semibold sm:text-sm md:text-base ${invitationText.heading}`}>
                      {msg.name}
                    </h4>
                    <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs ${invitationText.muted}`}>
                      {new Date(msg.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <Heart className={`h-3 w-3 transition-all duration-300 group-hover:scale-110 sm:h-4 sm:w-4 md:h-5 md:w-5 ${invitationText.accent}`} />
                <Sparkles className={`h-2.5 w-2.5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-3 sm:w-3 md:h-4 md:w-4 ${invitationText.accent}`} />
              </div>
            </div>

            <p className={`${cormorant.className} pl-1 text-xs italic leading-relaxed sm:pl-2 sm:text-sm sm:leading-loose md:text-base lg:text-lg ${invitationText.body}`}>
              &ldquo;{msg.message}&rdquo;
            </p>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
