import Image from "next/image"
import type { ReactNode } from "react"

export type CornerDecoration = {
  src: string
  className: string
}

type InvitationCardProps = {
  children: ReactNode
  decorations?: readonly CornerDecoration[]
  className?: string
}

export function InvitationCard({
  children,
  decorations = [],
  className = "",
}: InvitationCardProps) {
  return (
    <div className={`hero-invitation relative ${className}`}>
      {decorations.map(({ src, className: cornerClass }) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={901}
          height={1186}
          aria-hidden
          className={`hero-invitation__corner pointer-events-none absolute z-[2] select-none ${cornerClass}`}
        />
      ))}

      <div className="hero-invitation__border-outer relative z-[1]">
        <div className="hero-invitation__border-inner">
          <div className="hero-invitation__content">{children}</div>
        </div>
      </div>
    </div>
  )
}
