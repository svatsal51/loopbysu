const GRADIENTS = [
  'linear-gradient(135deg,#0a0a0a 0%,#3a3a3a 45%,#e5e5e5 100%)',
  'linear-gradient(135deg,#111111 0%,#555555 50%,#f5f5f5 100%)',
  'linear-gradient(160deg,#000000 0%,#2b2b2b 40%,#c9c9c9 100%)',
  'linear-gradient(200deg,#0d0d0d 0%,#4a4a4a 55%,#eaeaea 100%)',
  'linear-gradient(120deg,#050505 0%,#333333 50%,#dcdcdc 100%)',
]

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

type Props = {
  seed?: string
  alt: string
  className?: string
  label?: string
}

export function GradientTile({ seed = 'loop-by-su', alt, className = '', label }: Props) {
  const gradient = GRADIENTS[hashSeed(seed) % GRADIENTS.length]
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex items-end overflow-hidden ${className}`}
      style={{ backgroundImage: gradient }}
    >
      {label ? (
        <span className="relative z-10 p-4 text-[10px] uppercase tracking-widest2 text-paper/70">{label}</span>
      ) : null}
    </div>
  )
}
