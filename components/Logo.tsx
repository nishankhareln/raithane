/** Raithane wordmark — Devanagari "रैथान" in maroon. */
export default function Logo({ size = 30, withWord = true }: { size?: number; withWord?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="font-extrabold leading-none text-forest"
        style={{ fontSize: size, letterSpacing: '-0.01em', fontFamily: 'var(--font-deva), system-ui, sans-serif' }}>
        रैथाने
      </span>
      {withWord && (
        <span className="hidden leading-none sm:block">
          <span className="block text-[11px] font-bold tracking-[0.18em] text-clay/80">RAITHANE</span>
          <span className="block text-[9px] font-medium tracking-wide text-stone/40">DISCOVER NEPAL THROUGH ITS PEOPLE</span>
        </span>
      )}
    </span>
  )
}
