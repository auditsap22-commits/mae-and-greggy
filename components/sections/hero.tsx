import Image from "next/image"
import { InvitationCard } from "@/components/invitation-card"

const CORNER_DECORATIONS = [
  {
    src: "/decoration/top-right-corner.png",
    className: "right-0 top-0",
  },
  {
    src: "/decoration/bottom-left-new.png",
    className: "bottom-0 left-0",
  },
] as const

export function Hero() {
  return (
    <section id="home" className="relative flex w-full justify-center px-4 sm:px-6">
      <InvitationCard
        decorations={CORNER_DECORATIONS}
        className="mt-4 w-full max-w-[440px] sm:mt-5 md:mt-6 md:max-w-[500px] lg:max-w-[540px]"
      >
        <Image
          src="/Details/heroPagenew.png"
          alt="Wedding invitation hero"
          width={409}
          height={566}
          className="h-auto w-full"
          priority
        />
      </InvitationCard>
    </section>
  )
}
