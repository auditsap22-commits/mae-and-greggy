import type { ReactNode } from "react"

const connectorSizeClass = {
  sm: "text-[0.85em] mx-[0.5em] sm:mx-[0.65em] opacity-80",
  md: "text-[0.8em] mx-[0.65em] sm:mx-[0.9em] md:mx-[1.1em] opacity-75",
} as const

const connectorStackedClass = "text-[0.55em] sm:text-[0.6em] opacity-75"

export const coupleNameTextClass =
  "font-[family-name:var(--font-safira-march)] text-[0.75rem] sm:text-[0.8rem] md:text-[0.85rem] lg:text-[0.9rem] leading-none tracking-[0.04em] sm:tracking-[0.05em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.2)]"

export function StyledName({ name }: { name: string }) {
  const trimmed = name.trim()
  if (!trimmed) return null

  return <span className="inline-block leading-none">{trimmed}</span>
}

export function NameConnector({
  children,
  size = "md",
  stacked = false,
  className = "",
}: {
  children: ReactNode
  size?: keyof typeof connectorSizeClass
  stacked?: boolean
  className?: string
}) {
  return (
    <span
      className={`inline-block leading-none align-baseline ${
        stacked ? connectorStackedClass : connectorSizeClass[size]
      } ${className}`}
    >
      {children}
    </span>
  )
}

export function CoupleNames({
  groomName,
  brideName,
  connector = "&",
  className = coupleNameTextClass,
  connectorClassName = "",
  layout = "inline",
}: {
  groomName: string
  brideName: string
  connector?: string
  className?: string
  connectorClassName?: string
  layout?: "inline" | "stacked"
}) {
  if (layout === "stacked") {
    return (
      <div
        className={`flex flex-col items-center gap-y-2 px-2 sm:gap-y-2.5 sm:px-3 md:gap-y-3 ${className}`}
      >
        <StyledName name={groomName} />
        <NameConnector stacked className={connectorClassName}>
          {connector}
        </NameConnector>
        <StyledName name={brideName} />
      </div>
    )
  }

  return (
    <p className={`inline-flex flex-wrap items-baseline justify-center gap-y-1 px-2 sm:px-3 ${className}`}>
      <StyledName name={groomName} />
      <NameConnector className={connectorClassName}>{connector}</NameConnector>
      <StyledName name={brideName} />
    </p>
  )
}
