/**
 * Decorative full-bleed globe for the home hero — dotted meridians & parallels.
 */
export function HeroGlobeBg() {
  const cx = 200
  const cy = 200
  const R = 188
  const dot = "2 5"

  // Latitude ellipses (orthographic-style; hand-tuned for a balanced look)
  const parallelRy = [58, 44, 30, 16]
  const parallels = parallelRy.flatMap((ry, i) => [
    <ellipse
      key={`lat-n-${i}`}
      cx={cx}
      cy={cy}
      rx={R}
      ry={ry}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.65"
      strokeOpacity={0.11 + i * 0.02}
      strokeDasharray={dot}
    />,
  ])

  const meridians = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg, i) => (
    <ellipse
      key={`mer-${i}`}
      cx={cx}
      cy={cy}
      rx={Math.abs(Math.cos((deg * Math.PI) / 180)) * R + 0.5}
      ry={R}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.65"
      strokeOpacity="0.13"
      strokeDasharray={dot}
      transform={`rotate(${deg} ${cx} ${cy})`}
    />
  ))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden>
      <svg
        className="absolute left-1/2 top-1/2 h-[min(140%,120vh)] w-[min(140%,140vw)] min-h-[120%] min-w-[120%] -translate-x-1/2 -translate-y-1/2 text-(--color-link)"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hero-globe-fade" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.11" />
            <stop offset="55%" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R} fill="url(#hero-globe-fade)" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.1" />
        {parallels}
        {meridians}
      </svg>
    </div>
  )
}
