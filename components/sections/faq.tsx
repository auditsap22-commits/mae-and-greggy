"use client"

import { useMemo, useState, type ReactNode } from "react"
import type { SiteConfig } from "@/lib/site-config"
import { ChevronDown } from "lucide-react"
import { InvitationCard } from "@/components/invitation-card"
import { NameConnector } from "@/components/couple-name-text"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"

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

const FAQ_ITEM_CLASS =
  "rounded-xl border border-[#BB8A3D]/20 bg-[#F5EDE0]/60 transition-all duration-300 hover:border-[#BB8A3D]/35 hover:bg-[#F5EDE0]/80 sm:rounded-2xl"

const LINK_CLASS =
  "font-semibold text-[#BB8A3D] underline transition-colors hover:text-[#A67A35]"

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

interface FAQItem {
  question: string
  answer: string | ReactNode
}

function getFaqItems(siteConfig: SiteConfig): FAQItem[] {
  return [
    {
      question: "When is the wedding?",
      answer: `Our wedding will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day})`,
    },
    {
      question: "What time should I arrive for the ceremony.?",
      answer: `Our ceremony will begin promptly at ${siteConfig.ceremony.time}. We kindly ask guests to arrive 30–45 minutes earlier to allow enough time for parking, walking to the ceremony area, and finding your seats so we can begin on time.`,
    },
    {
      question: "Where will the ceremony and reception take place?",
      answer: `Ceremony: ${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}.\n\nReception: ${siteConfig.reception.location}, ${siteConfig.reception.venue}.\n\nYou can find detailed directions, addresses, and maps in the Details section above.`,
    },
    {
      question: "How do I RSVP?",
      answer: (
        <>
          Please RSVP using the{" "}
          <a
            href="#guest-list"
            className={LINK_CLASS}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            guest list
          </a>{" "}
          on this invitation: search for your name and confirm your attendance.
          {"\n"}
          Please respond by {siteConfig.details.rsvp.deadline.replace(/\.\s*$/, "")}.
          {"\n"}
          If you have questions, message{" "}
          <a
            href={`https://www.facebook.com/${siteConfig.couple.groom}`}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
             {siteConfig.couple.bride}
          </a>{" "}
          or{" "}
          <a
            href={`https://www.facebook.com/${siteConfig.couple.groom}`}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {siteConfig.couple.groom}
          </a>{" "}
          on Messenger.
        </>
      ),
    },
    {
      question: "Can I bring children or tag along someone?",
      answer:
        "Unfortunately, due to space and seating constraints, we kindly ask for your understanding that we cannot accommodate our lovely guest to bring a guest of their own.\n\nTherefore, we request our guest not to bring plus one, unless they are specifically named on the invitation.\n\nWe adore your little ones — truly. However, we have lovingly planned this as an adults-only celebration so that every guest, including you, can fully relax, enjoy the program, and be present in the moment. We kindly ask that you make childcare arrangements for the day.\n\nThank you so much for understanding!",
    },
    {
      question: "Can I sit anywhere at the reception?",
      answer:
        "Please don't. We kindly ask our guests to follow the seating arrangement prepared for the reception.\n\nA great deal of thought and care went into planning the seating so that everyone will feel comfortable and be seated with friends, family, or guests who share similar connections. Each seat was thoughtfully arranged with every guest in mind. Our reception team will gladly assist you in finding your assigned table.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, parking is available at the venue, and parking attendants, along with our coordinators, will assist you on the day",
    },
    {
      question: "Unplugged Ceremony",
      answer:
        "We warmly invite you to capture special moments of our wedding. As the ceremony begins, we kindly ask that phones and cameras remain out of the aisle. Feel free to take photos discreetly from your seat, allowing our photographers to capture each moment without obstruction.",
    },
    {
      question: "Can I take photos or videos during the reception?",
      answer:
        "Yes! While our I DO's will be unplugged, our reception will not be. As a couple who loves photos and memories, we would love for you to capture the fun moments throughout the evening. We prepared this celebration wholeheartedly and we want everyone to enjoy it fully.",
    },
    {
      question: "What should I do if I can't make it?",
      answer:
        "Your presence will truly be missed, but we completely understand.\n\nPlease kindly let us know through RSVP as soon as possible so we may adjust arrangements accordingly.",
    },
    {
      question: 'I said "No" to RSVP but my plans changed. Can I still attend?',
      answer:
        "Please check with us first before making arrangements. Due to limited seating and a carefully planned guest list, attendance cannot be guaranteed without prior confirmation.",
    },
    {
      question: "When is the appropriate time to leave?",
      answer:
        "It took us some time to plan for a heartfelt wedding that everyone would hopefully enjoy. We humbly request that you celebrate with us until the program ends. Let's laugh, take pictures, sing, and have fun!",
    },
    {
      question: "How can I help the couple have a great time during their wedding?",
      answer:
        "• Pray with us for favorable weather and the continuous blessings of our Lord as we enter this new chapter of our lives as husband and wife.\n\n• RSVP as soon as your schedule is cleared.\n\n• Dress appropriately and follow our wedding motif.\n\n• Be on time.\n\n• Follow the seating arrangement in the reception.\n\n• Stay until the end of the program.\n\n• Join the activities and enjoy!",
    },
  ]
}

function FAQAnswer({ answer }: { answer: string | ReactNode }) {
  if (typeof answer === "string" && answer.includes("[RSVP_LINK]")) {
    return (
      <p className={`${cormorant.className} text-sm leading-relaxed whitespace-pre-line sm:text-base sm:leading-loose ${invitationText.body}`}>
        {answer.split("[RSVP_LINK]")[0]}
        <a
          href="#guest-list"
          className={LINK_CLASS}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          {answer.match(/\[RSVP_LINK\](.*?)\[\/RSVP_LINK\]/)?.[1]}
        </a>
        {answer.split("[/RSVP_LINK]")[1]}
      </p>
    )
  }

  if (typeof answer === "string") {
    return (
      <p className={`${cormorant.className} text-sm leading-relaxed whitespace-pre-line sm:text-base sm:leading-loose ${invitationText.body}`}>
        {answer}
      </p>
    )
  }

  return (
    <div className={`${cormorant.className} text-sm leading-relaxed whitespace-pre-line sm:text-base sm:leading-loose ${invitationText.body}`}>
      {answer}
    </div>
  )
}

export function FAQ() {
  const siteConfig = useSiteConfig()
  const faqItems = useMemo(() => getFaqItems(siteConfig), [siteConfig])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
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
              className={`flex flex-col items-center gap-2 px-2 font-[family-name:var(--font-safira-march)] text-[clamp(1.4rem,5.8vw,1.8rem)] leading-none tracking-[0.015em] sm:gap-2.5 sm:text-[2.25rem] sm:tracking-[0.01em] md:text-[2.85rem] lg:text-[3.35rem] ${invitationText.heading}`}
            >
              <span className="block">Frequently</span>
              <span className="block">Asked</span>
              <span className="block">Questions</span>
            </h2>

            <p
              className={`${cormorant.className} mx-auto max-w-xl px-2 text-xs italic leading-relaxed sm:px-4 sm:text-sm md:text-base ${invitationText.muted}`}
            >
              Helpful notes so you can simply arrive, celebrate,{" "}
              <NameConnector size="sm">and</NameConnector>{" "}
              enjoy this new chapter with us.
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index
              const contentId = `faq-item-${index}`

              return (
                <div
                  key={index}
                  className={`${FAQ_ITEM_CLASS} ${isOpen ? "border-[#BB8A3D]/45 bg-[#F5EDE0]/90" : ""}`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="group flex w-full items-center justify-between px-3 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#BB8A3D]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] sm:px-4 sm:py-3.5 md:px-5 md:py-4"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                  >
                    <span
                      className={`${cinzel.className} pr-3 text-xs font-semibold leading-snug transition-colors duration-200 sm:pr-4 sm:text-sm sm:leading-relaxed md:text-base lg:text-lg ${
                        isOpen ? invitationText.heading : `${invitationText.body} group-hover:text-[#6B5335]`
                      }`}
                    >
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 sm:h-5 sm:w-5 ${invitationText.accent} ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>

                  <div
                    id={contentId}
                    role="region"
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#BB8A3D]/20 px-3 pb-3 pt-0 sm:px-4 sm:pb-4 md:px-5 md:pb-5">
                        <FAQAnswer answer={item.answer} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </InvitationCard>
    </section>
  )
}
