export function Watermark({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" data-watermark>
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="absolute whitespace-nowrap text-[7cqi] font-medium tracking-[0.3em] text-[#6b1d2a]/20 uppercase"
          style={{
            top: `${(i % 7) * 16 + 6}%`,
            left: `${(i % 2) * 10 - 10}%`,
            transform: "rotate(-28deg)",
          }}
        >
          VIVAAH PREVIEW · VIVAAH PREVIEW · VIVAAH PREVIEW
        </span>
      ))}
    </div>
  );
}
