import styles from './BeerIllustration.module.css'

// Decorative hero art for the home page: a frothy mug with rising bubbles, a bottle and two hop cones.
// Pure SVG + CSS animation, so it themes with our tokens and needs no image files.
const BUBBLES = [
  { x: 185, r: 3, delay: '0s', duration: '3.2s' },
  { x: 205, r: 2, delay: '1.1s', duration: '2.6s' },
  { x: 222, r: 4, delay: '0.5s', duration: '3.8s' },
  { x: 240, r: 2.5, delay: '1.8s', duration: '2.9s' },
  { x: 258, r: 3, delay: '0.9s', duration: '3.4s' },
  { x: 196, r: 2, delay: '2.3s', duration: '3s' },
  { x: 250, r: 2, delay: '2.8s', duration: '2.7s' },
]

function Hop({ x, y, rotate, className }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className={className}>
        <path d="M0 -26 C10 -18 12 -6 0 4 C-12 -6 -10 -18 0 -26Z" className={styles.hopDark} />
        <path d="M-9 -12 C2 -8 4 6 -6 14 C-16 6 -16 -6 -9 -12Z" className={styles.hopLight} />
        <path d="M9 -12 C16 -6 16 6 6 14 C-4 6 -2 -8 9 -12Z" className={styles.hopLight} />
        <path d="M0 0 C8 6 8 18 0 26 C-8 18 -8 6 0 0Z" className={styles.hopDark} />
        <path d="M0 -26 Q-2 -34 4 -38" className={styles.hopStem} />
      </g>
    </g>
  )
}

export default function BeerIllustration() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.glow} />
      <svg className={styles.art} viewBox="0 0 360 330">
        <defs>
          <linearGradient id="beer-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fcd34d" />
            <stop offset="0.55" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="bottle-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5b2a0c" />
            <stop offset="0.45" stopColor="#8a4614" />
            <stop offset="1" stopColor="#3d1c07" />
          </linearGradient>
          <clipPath id="beer-clip">
            <rect x="168" y="136" width="104" height="156" rx="8" />
          </clipPath>
        </defs>

        <ellipse cx="185" cy="306" rx="150" ry="12" className={styles.shadow} />

        <Hop x={318} y={70} rotate={18} className={styles.floatSlow} />
        <Hop x={36} y={118} rotate={-24} className={styles.floatFast} />

        {/* Bottle */}
        <g className={styles.bottle}>
          <path d="M60 292 V172 C60 142 84 128 84 102 V56 H108 V102 C108 128 132 142 132 172 V292 Q132 302 122 302 H70 Q60 302 60 292Z" fill="url(#bottle-fill)" />
          <rect x="80" y="40" width="32" height="18" rx="4" className={styles.cap} />
          <path d="M80 44 h32 M80 50 h32" className={styles.capRidges} />
          <rect x="64" y="196" width="64" height="62" rx="7" className={styles.label} />
          <text x="96" y="223" textAnchor="middle" className={styles.labelTitle}>BREW</text>
          <text x="96" y="242" textAnchor="middle" className={styles.labelSub}>SCOPE · IPA</text>
          <rect x="69" y="160" width="6" height="124" rx="3" className={styles.shine} />
        </g>

        {/* Mug */}
        <g className={styles.mug}>
          <path d="M280 162 h18 a24 24 0 0 1 24 24 v48 a24 24 0 0 1 -24 24 h-18" className={styles.handle} />
          <rect x="160" y="112" width="120" height="190" rx="14" className={styles.glass} />
          <rect x="168" y="136" width="104" height="156" rx="8" fill="url(#beer-fill)" />
          <g clipPath="url(#beer-clip)">
            {BUBBLES.map((b, i) => (
              <circle key={i} cx={b.x} cy={286} r={b.r} className={styles.bubble}
                style={{ animationDelay: b.delay, animationDuration: b.duration }} />
            ))}
          </g>
          <path d="M190 150 V280 M220 150 V280 M250 150 V280" className={styles.ribs} />
          <rect x="172" y="150" width="7" height="128" rx="3.5" className={styles.shine} />
          <g className={styles.foam}>
            <rect x="160" y="118" width="120" height="26" rx="10" />
            <circle cx="176" cy="122" r="17" />
            <circle cx="202" cy="110" r="22" />
            <circle cx="232" cy="108" r="21" />
            <circle cx="259" cy="116" r="19" />
            <circle cx="276" cy="128" r="12" />
            <path d="M170 140 q-2 18 4 24 q6 -6 4 -24Z" />
          </g>
        </g>

        {/* Sparkles */}
        <path d="M150 52 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4Z" className={styles.sparkle} />
        <path d="M300 250 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3Z" className={`${styles.sparkle} ${styles.sparkleLate}`} />
      </svg>
    </div>
  )
}
