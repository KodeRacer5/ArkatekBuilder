export default function PeptideJournalLogo({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 80"
      className={className}
      aria-label="Peptide Journal — Longevity Medicine & Protocols"
    >
      {/* Main title */}
      <text
        x="0"
        y="52"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="900"
        fontSize="52"
        fill="white"
        letterSpacing="-1"
      >
        Peptide Journal
      </text>
      {/* Rule line */}
      <line x1="0" y1="60" x2="400" y2="60" stroke="hsl(43,85%,52%)" strokeWidth="1.5" />
      {/* Subtitle */}
      <text
        x="2"
        y="76"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize="14"
        fill="hsl(43,85%,52%)"
        letterSpacing="1.5"
      >
        Longevity Medicine &amp; Protocols
      </text>
    </svg>
  )
}





