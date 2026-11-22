import type { SVGProps } from "react";

type OrnamentProps = SVGProps<SVGSVGElement> & { title?: string };

export function FloralCorner({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden {...props}>
      <path
        d="M8 112C18 86 28 72 52 62C36 70 22 86 16 104"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 108C40 92 62 70 74 40"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M48 66C56 52 70 40 88 28C72 40 64 54 62 70"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M70 46C78 34 96 22 112 14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M36 80C32 72 24 66 14 62C24 64 34 68 42 76"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <ellipse cx="54" cy="58" rx="5" ry="8" transform="rotate(-30 54 58)" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="76" cy="38" rx="4.5" ry="7.5" transform="rotate(-18 76 38)" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="28" cy="86" rx="4" ry="7" transform="rotate(-50 28 86)" stroke="currentColor" strokeWidth="1" />
      <circle cx="22" cy="100" r="1.6" fill="currentColor" />
      <circle cx="96" cy="22" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function FloralSprig({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 80 20" fill="none" className={className} aria-hidden {...props}>
      <path d="M4 10H76" stroke="currentColor" strokeWidth="0.8" />
      <path d="M22 10C22 10 26 4 30 4C34 4 34 10 34 10C34 10 34 16 30 16C26 16 22 10 22 10Z" stroke="currentColor" strokeWidth="0.9" />
      <path d="M46 10C46 10 50 4 54 4C58 4 58 10 58 10C58 10 58 16 54 16C50 16 46 10 46 10Z" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="40" cy="10" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Mandala({ className, ...props }: OrnamentProps) {
  const rings = [16, 12, 8];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="0.7" transform="translate(100 100)">
        <circle r="18" />
        <circle r="28" />
        <circle r="46" />
        <circle r="62" />
        <circle r="78" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI * 2) / 16;
          return (
            <ellipse
              key={`p16-${i}`}
              cx={0}
              cy={-46}
              rx="7"
              ry="18"
              transform={`rotate(${(a * 180) / Math.PI})`}
            />
          );
        })}
        {Array.from({ length: 8 }, (_, i) => {
          const rot = i * 45;
          return (
            <path
              key={`star-${i}`}
              d="M0 -28 L6 -8 L0 0 L-6 -8 Z"
              transform={`rotate(${rot})`}
            />
          );
        })}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * Math.PI * 2) / 24;
          const x1 = Math.cos(a) * 62;
          const y1 = Math.sin(a) * 62;
          const x2 = Math.cos(a) * 78;
          const y2 = Math.sin(a) * 78;
          return <line key={`ray-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {rings.map((count, ring) =>
          Array.from({ length: count }, (_, i) => {
            const a = (i * Math.PI * 2) / count;
            const r = 34 + ring * 16;
            return <circle key={`dot-${ring}-${i}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="1.2" fill="currentColor" stroke="none" />;
          }),
        )}
        <circle r="6" fill="currentColor" stroke="none" />
        <circle r="10" />
      </g>
    </svg>
  );
}

export function Paisley({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 60 90" fill="none" className={className} aria-hidden {...props}>
      <path
        d="M30 86C14 86 8 68 12 50C16 32 28 22 36 12C42 4 50 6 50 16C50 34 46 46 40 58C36 68 38 86 30 86Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M30 72C20 70 16 58 20 46C24 34 32 28 36 20C38 16 42 18 42 24C42 36 38 46 34 54C32 60 34 72 30 72Z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="32" cy="44" r="4" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

export function Lotus({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 80 40" fill="none" className={className} aria-hidden {...props}>
      <path d="M40 36C40 36 24 28 20 14C28 18 36 16 40 8C44 16 52 18 60 14C56 28 40 36 40 36Z" stroke="currentColor" strokeWidth="1" />
      <path d="M40 36C40 36 32 22 40 10C48 22 40 36 40 36Z" stroke="currentColor" strokeWidth="1" />
      <path d="M16 28C10 22 10 14 16 10C20 18 28 26 16 28Z" stroke="currentColor" strokeWidth="1" />
      <path d="M64 28C70 22 70 14 64 10C60 18 52 26 64 28Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function DecoFan({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} aria-hidden {...props}>
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i - 4) / 4;
        const x = 60 + t * 54;
        return <line key={i} x1="60" y1="60" x2={x} y2="6" stroke="currentColor" strokeWidth="0.9" />;
      })}
      <path d="M8 60 A52 52 0 0 1 112 60" stroke="currentColor" strokeWidth="1.2" />
      <path d="M22 60 A38 38 0 0 1 98 60" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export function DecoCorner({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden {...props}>
      <path d="M8 8H44L36 16H16V36L8 44V8Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 16H32L28 20H20V28L16 32V16Z" stroke="currentColor" strokeWidth="1" />
      <rect x="8" y="52" width="8" height="8" stroke="currentColor" strokeWidth="0.8" />
      <rect x="52" y="8" width="8" height="8" stroke="currentColor" strokeWidth="0.8" />
      <path d="M28 8V0M8 28H0" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function OakLeaf({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 70 110" fill="none" className={className} aria-hidden {...props}>
      <path
        d="M34 104C34 104 36 70 36 54C20 62 8 58 10 44C12 32 24 34 28 40C22 22 28 10 38 8C48 10 52 22 46 40C52 34 64 32 66 44C68 58 54 62 40 54C40 70 42 104 42 104"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M38 20C38 36 38 88 38 104" stroke="currentColor" strokeWidth="1" />
      <path d="M38 48C28 44 22 44 16 46M38 62C50 58 58 56 62 58M38 36C48 32 54 28 58 24" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export function TwineBow({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 90 40" fill="none" className={className} aria-hidden {...props}>
      <path d="M45 18C28 4 12 10 16 20C20 30 36 24 45 18C54 24 70 30 74 20C78 10 62 4 45 18Z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="45" cy="20" r="4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M42 24C38 34 32 38 28 38M48 24C52 34 58 38 62 38" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function GothicArch({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 280" fill="none" className={className} aria-hidden {...props}>
      <path
        d="M20 270V110C20 110 20 40 100 14C180 40 180 110 180 110V270"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M28 270V114C28 114 28 48 100 24C172 48 172 114 172 114V270"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path d="M100 14V4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CrossFleur({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 40 48" fill="none" className={className} aria-hidden {...props}>
      <path d="M20 4V44M10 16H30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="20" cy="16" r="2" fill="currentColor" />
      <path d="M20 4L17 8H23L20 4ZM20 44L17 40H23L20 44ZM10 16L14 13V19L10 16ZM30 16L26 13V19L30 16Z" fill="currentColor" />
    </svg>
  );
}

export function LilyVine({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 40 160" fill="none" className={className} aria-hidden {...props}>
      <path d="M20 8C12 30 28 50 18 72C8 94 26 114 20 152" stroke="currentColor" strokeWidth="0.9" />
      <path d="M18 40C8 36 6 24 12 18C16 28 10 34 22 42" stroke="currentColor" strokeWidth="0.9" />
      <path d="M20 86C32 80 36 68 28 62C26 74 30 82 16 88" stroke="currentColor" strokeWidth="0.9" />
      <path d="M18 118C8 114 8 102 16 98C18 110 12 114 24 120" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

export function ArabesqueBorder({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden {...props}>
      <g stroke="currentColor" strokeWidth="0.8" transform="translate(100 100)">
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <path d="M0 -12 L10 -40 L0 -70 L-10 -40 Z" />
            <path d="M0 -28 C12 -36 16 -52 0 -62 C-16 -52 -12 -36 0 -28" />
          </g>
        ))}
        <circle r="12" />
        <circle r="6" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={`sq-${i}`} x="-4" y="-82" width="8" height="8" transform={`rotate(${i * 45})`} />
        ))}
      </g>
    </svg>
  );
}

export function Crescent({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden {...props}>
      <path
        d="M22 6C14 8 8 16 8 24C8 32 14 36 22 34C16 32 12 26 12 20C12 14 16 8 22 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Gopuram({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} aria-hidden {...props}>
      <path d="M20 150H140L128 118H32L20 150Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M32 118H128L118 90H42L32 118Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M42 90H118L108 66H52L42 90Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M52 66H108L100 46H60L52 66Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M60 46H100L92 30H68L60 46Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M72 30H88L80 16L72 30Z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="80" cy="12" r="4" stroke="currentColor" strokeWidth="1" />
      <path d="M80 8V4" stroke="currentColor" strokeWidth="1" />
      {[118, 90, 66, 46].map((y, i) => (
        <g key={y}>
          {Array.from({ length: 3 + (3 - i) }, (_, k) => {
            const count = 3 + (3 - i);
            const width = 96 - i * 16;
            const start = 80 - width / 2;
            const x = start + ((k + 0.5) * width) / count;
            return <path key={k} d={`M${x} ${y} Q${x} ${y - 8} ${x} ${y - 14}`} stroke="currentColor" strokeWidth="0.8" />;
          })}
        </g>
      ))}
    </svg>
  );
}

export function KolamCorner({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden {...props}>
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={12 + c * 16} cy={12 + r * 16} r="1.3" fill="currentColor" />
        )),
      )}
      <path
        d="M12 20C12 12 20 12 20 20C20 28 28 28 28 20C28 12 36 12 36 20C36 28 44 28 44 20C28 20 28 36 20 36C12 36 12 28 12 20Z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path d="M20 36C20 48 36 48 36 36" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

export function Vilakku({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 40 70" fill="none" className={className} aria-hidden {...props}>
      <path d="M20 18C16 12 20 4 20 4C20 4 24 12 20 18Z" fill="currentColor" opacity="0.9" />
      <path d="M12 22H28L24 28H16L12 22Z" stroke="currentColor" strokeWidth="1" />
      <path d="M20 28V46" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 46H30L26 52H14L10 46Z" stroke="currentColor" strokeWidth="1" />
      <path d="M8 58C8 52 32 52 32 58C32 64 8 64 8 58Z" stroke="currentColor" strokeWidth="1" />
      <path d="M12 66H28" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function WatercolorWash({ uid = "wc" }: { uid?: string }) {
  const id = `${uid}-blur`;
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 560" preserveAspectRatio="none" aria-hidden>
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} opacity="0.55">
        <ellipse cx="70" cy="80" rx="110" ry="90" fill="#E8B48A" />
        <ellipse cx="340" cy="120" rx="100" ry="80" fill="#C9D4A8" />
        <ellipse cx="80" cy="500" rx="120" ry="90" fill="#D9A441" opacity="0.7" />
        <ellipse cx="330" cy="480" rx="110" ry="100" fill="#C56A3A" opacity="0.55" />
        <ellipse cx="200" cy="300" rx="80" ry="60" fill="#E8D5C4" />
      </g>
    </svg>
  );
}

export function PaperGrain({ opacity = 0.18, uid = "grain" }: { opacity?: number; uid?: string }) {
  const id = `${uid}-noise`;
  const table = `0 ${opacity}`;
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="luminanceToAlpha" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues={table} />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
