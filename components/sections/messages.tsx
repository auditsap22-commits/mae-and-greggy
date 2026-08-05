"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import { InvitationCard } from "@/components/invitation-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { NameConnector } from "@/components/couple-name-text"
import { Cormorant_Garamond } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"

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

const INNER_CARD_CLASS =
  "relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#BB8A3D]/30 bg-[#FDFBF7]/80 shadow-[0_4px_20px_rgba(139,111,71,0.12)] transition-all duration-300 hover:border-[#BB8A3D]/45"

const primaryBtnClass =
  "cursor-pointer rounded-full border border-[#BB8A3D]/45 bg-[#BB8A3D] px-5 py-3 text-[9px] font-bold tracking-[0.16em] uppercase text-[#FDFBF7] shadow-[0_4px_16px_rgba(139,111,71,0.2)] transition-all duration-300 hover:bg-[#A67A35] hover:border-[#BB8A3D]/65 hover:shadow-xl hover:-translate-y-0.5 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.18em] md:px-8 md:py-4 md:text-[11px]"

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

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(
        siteConfig.googleAPI.messageForm,
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      )

      toast({
        title: "Message Sent! 💌",
        description: "Your heartfelt wishes have been delivered",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()
      
      // Reset submitted state after animation
      setTimeout(() => setIsSubmitted(false), 1000)
      
      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-md px-3 sm:px-0">
      <style>{`
        .message-form-input::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
        .message-form-textarea::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
      `}</style>

      <Card className={`${INNER_CARD_CLASS} w-full group ${isFocused ? "scale-[1.01] border-[#BB8A3D]/50" : ""} ${isSubmitted ? "animate-bounce" : ""}`}>
        {isSubmitted && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#BB8A3D]/80 backdrop-blur-sm pointer-events-none">
            <div className="flex animate-pulse flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#BB8A3D]/30 bg-[#FDFBF7] shadow-lg">
                <Sparkles className={`h-8 w-8 ${invitationText.accent}`} />
              </div>
              <p className={`text-lg font-semibold ${invitationText.heading}`}>Sent!</p>
            </div>
          </div>
        )}

        <CardContent className="relative z-10 p-4 sm:p-5 md:p-6">
          <div className="mb-3 text-center sm:mb-4 md:mb-5">
            <div className="relative mb-2 inline-block sm:mb-3">
              <div className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#BB8A3D]/30 bg-[#F5EDE0]/80 shadow-lg sm:h-11 sm:w-11 md:h-14 md:w-14">
                <MessageCircle className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ${invitationText.accent}`} />
              </div>
            </div>
            <h3 className={`mb-1.5 font-[family-name:var(--font-safira-march)] text-lg leading-none tracking-[0.01em] sm:mb-2 sm:text-xl md:text-[1.35rem] ${invitationText.heading}`}>
              Share Your Love
            </h3>
            <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm ${invitationText.muted}`}>
              Your words will be part of{" "}
              <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1">
                <CoupleNameInline />
              </span>
              &apos;s keepsake for years to come.
            </p>
          </div>

          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* Name Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <label className={`${cormorant.className} flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm md:text-base ${invitationText.body}`}>
                <div className={`flex h-4 w-4 items-center justify-center rounded-full bg-[#F5EDE0]/80 transition-all duration-300 sm:h-5 sm:w-5 md:h-6 md:w-6 ${focusedField === "name" ? "scale-110" : ""}`}>
                  <Heart className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 ${invitationText.accent}`} />
                </div>
                Your Name
              </label>
              <div className="relative">
                <Input
                  name="name"
                  required
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Full Name"
                  className={`${cormorant.className} message-form-input w-full rounded-xl border-2 px-3 py-2 text-xs text-black shadow-sm transition-all duration-300 placeholder:italic hover:shadow-md focus:shadow-lg sm:px-4 sm:py-2.5 sm:text-sm md:px-5 md:py-3 md:text-base ${
                    focusedField === "name"
                      ? "border-[#BB8A3D] focus:border-[#BB8A3D] focus:ring-4 focus:ring-[#BB8A3D]/15 shadow-lg"
                      : "border-[#BB8A3D]/35 hover:border-[#BB8A3D]/50"
                  }`}
                />
                {nameValue && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <label className={`${cormorant.className} flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm md:text-base ${invitationText.body}`}>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full bg-[#F5EDE0]/80 transition-all duration-300 sm:h-5 sm:w-5 md:h-6 md:w-6 ${focusedField === "message" ? "scale-110" : ""}`}>
                    <MessageCircle className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 ${invitationText.accent}`} />
                  </div>
                  Your Message
                </label>
                {messageValue && (
                  <span className={`${cormorant.className} text-[10px] transition-colors sm:text-xs ${messageValue.length > 500 ? "text-red-500" : invitationText.muted}`}>
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  name="message"
                  required
                  value={messageValue}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setMessageValue(e.target.value)
                    }
                  }}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={`Write a heartfelt message for ${groomNickname} and ${brideNickname}... share your wishes, memories, or words of love that will be treasured forever 💕`}
                  className={`${cormorant.className} message-form-textarea w-full resize-none rounded-xl border-2 bg-white px-3 py-2 text-xs text-black shadow-sm transition-all duration-300 placeholder:italic placeholder:leading-relaxed hover:shadow-md focus:shadow-lg sm:min-h-[100px] sm:px-4 sm:py-3 sm:text-sm md:min-h-[120px] md:px-5 md:py-4 md:text-base min-h-[80px] ${
                    focusedField === "message"
                      ? "border-[#BB8A3D] focus:border-[#BB8A3D] focus:ring-4 focus:ring-[#BB8A3D]/15 shadow-lg"
                      : "border-[#BB8A3D]/35 hover:border-[#BB8A3D]/50"
                  }`}
                />
                {messageValue && (
                  <div className="absolute right-3 top-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className={`${cormorant.className} ${primaryBtnClass} w-full rounded-xl py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-4 sm:px-5 md:px-6 lg:px-7 text-xs sm:text-sm md:text-base font-semibold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  Send Message
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Unexpected messages response; expected an array", data)
          setMessages([])
          setLoading(false)
          return
        }
        
        const parsed = data
          .filter((m) => m.name || m.message || m.timestamp)
          .reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <section
      id="messages"
      className="relative flex w-full justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12"
    >
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="w-full max-w-[440px] md:max-w-[500px] lg:max-w-[540px]"
      >
        <div className="space-y-6 sm:space-y-8">
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
            className={`font-[family-name:var(--font-safira-march)] flex flex-col items-center gap-2 px-2 text-[clamp(1.4rem,5.8vw,1.8rem)] leading-none tracking-[0.015em] sm:gap-2.5 sm:text-[2.25rem] sm:tracking-[0.01em] md:text-[2.85rem] lg:text-[3.35rem] ${invitationText.heading}`}
          >
            <span className="block">Love notes</span>
            <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1">
              <NameConnector size="sm">and</NameConnector>
              <span>prayers</span>
            </span>
          </h2>
          <p
            className={`${cormorant.className} mx-auto max-w-xl px-2 text-xs italic leading-relaxed sm:px-4 sm:text-sm md:text-base ${invitationText.muted}`}
          >
            Leave a short note for{" "}
            <span className="inline-flex flex-wrap items-baseline justify-center gap-y-1 not-italic">
              <CoupleNameInline />
            </span>
            . Every wish{" "}
            <NameConnector size="sm">and</NameConnector>{" "}
            prayer becomes part of their forever story.
          </p>
        </div>

        <MessageForm onMessageSent={fetchMessages} />

        <div className={INNER_CARD_CLASS}>
          <div className="p-4 sm:p-5 md:p-6">
          <div className="mb-4 text-center sm:mb-6 md:mb-8">
            <div className="relative mb-3 inline-block sm:mb-4 md:mb-6">
              <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-[#BB8A3D]/30 bg-[#F5EDE0]/80 shadow-lg transition-transform duration-300 hover:scale-110 sm:h-10 sm:w-10 md:h-14 md:w-14">
                <MessageCircle className={`h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 ${invitationText.accent}`} />
              </div>
            </div>
            <h3
              className={`mb-1.5 flex flex-col items-center gap-2 font-[family-name:var(--font-safira-march)] text-[1.2rem] leading-none tracking-[0.01em] sm:mb-2 sm:gap-2.5 sm:text-[1.45rem] md:mb-3 md:text-[1.65rem] ${invitationText.heading}`}
            >
              <span className="block">Messages from</span>
              <span className="block">Loved Ones</span>
            </h3>
            <p
              className={`${cormorant.className} mx-auto max-w-2xl px-2 text-xs sm:px-4 sm:text-sm md:text-base ${invitationText.muted}`}
            >
              Read the beautiful messages shared by family{" "}
              <NameConnector size="sm">and</NameConnector>{" "}
              friends
            </p>
          </div>

          <MessageWallDisplay messages={messages} loading={loading} />
          </div>
        </div>
        </div>
      </InvitationCard>
    </section>
  )
}
