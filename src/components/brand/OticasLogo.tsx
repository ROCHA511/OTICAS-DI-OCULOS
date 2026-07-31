import React from 'react';

interface OticasLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'light-text' | 'dark-text';
  showSubtext?: boolean;
}

export const OticasLogo: React.FC<OticasLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtext = false,
}) => {
  // Dimension scales based on size
  const heights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  const isLightText = variant === 'light-text';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${heights[size]} ${className}`}>
      <svg
        viewBox="0 0 520 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-full drop-shadow-sm"
        aria-label="Logo Óticas Dioculos"
      >
        <defs>
          {/* Gradient for "Óticas" text */}
          <linearGradient id="oticasCyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Gradient for the Pupil/Iris */}
          <radialGradient id="irisGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>

          {/* Metallic Silver Swoop Arc Gradient */}
          <linearGradient id="silverSwoopGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Subtle Glow filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. SILVER SWOOP ARC (Crescent crescent sweeping around top-left to bottom) */}
        <path
          d="M 125 10 C 35 15 -10 65 15 118 C 30 148 70 152 140 138 C 90 142 42 135 28 112 C 10 75 48 30 135 24 C 180 21 215 32 230 38 C 210 32 170 20 125 10 Z"
          fill="url(#silverSwoopGrad)"
        />

        {/* 2. "Óticas" TEXT GROUP */}
        <g transform="translate(60, 15)">
          {/* Letter 'Ó' with built-in Lens Eye */}
          <g transform="translate(0, 10)">
            {/* Accent mark above 'Ó' */}
            <path
              d="M 38 0 C 42 -8 48 -14 54 -18 C 57 -16 54 -8 48 -2 Z"
              fill="url(#oticasCyanBlueGrad)"
            />

            {/* Outer 'O' body */}
            <circle cx="45" cy="45" r="38" fill="url(#oticasCyanBlueGrad)" />

            {/* Inner Iris Eye Circle */}
            <circle cx="45" cy="45" r="24" fill="url(#irisGrad)" />

            {/* Pupil Center Dot */}
            <circle cx="45" cy="45" r="11" fill="#020617" />

            {/* Catchlight Reflection Glare */}
            <circle cx="52" cy="38" r="5" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Letter 't' */}
          <path
            d="M 98 22 L 112 22 L 112 34 L 124 34 L 124 46 L 112 46 L 112 75 C 112 80 115 82 120 82 L 125 82 L 125 93 L 110 93 C 98 93 98 84 98 75 L 98 46 L 90 46 L 90 34 L 98 34 Z"
            fill="url(#oticasCyanBlueGrad)"
          />

          {/* Letter 'i' */}
          <g>
            <circle cx="140" cy="22" r="7" fill="url(#oticasCyanBlueGrad)" />
            <rect x="133" y="34" width="14" height="59" rx="4" fill="url(#oticasCyanBlueGrad)" />
          </g>

          {/* Letter 'c' */}
          <path
            d="M 195 44 C 185 34 168 34 158 44 C 148 54 148 72 158 82 C 168 92 185 92 195 82 L 205 91 C 190 105 163 105 147 91 C 131 77 131 50 147 36 C 163 22 190 22 205 36 Z"
            fill="url(#oticasCyanBlueGrad)"
          />

          {/* Letter 'a' */}
          <path
            d="M 245 34 C 230 34 218 45 218 64 C 218 83 230 94 245 94 C 255 94 262 89 266 82 L 266 93 L 278 93 L 278 36 L 266 36 L 266 46 C 262 39 255 34 245 34 Z M 248 46 C 258 46 266 54 266 64 C 266 74 258 82 248 82 C 238 82 230 74 230 64 C 230 54 238 46 248 46 Z"
            fill="url(#oticasCyanBlueGrad)"
          />

          {/* Letter 's' */}
          <path
            d="M 322 46 C 315 36 300 34 290 40 C 282 45 282 54 290 59 L 305 64 C 322 70 322 85 308 92 C 292 98 278 92 272 82 L 282 73 C 288 80 298 84 306 81 C 312 78 312 71 305 68 L 290 63 C 274 58 274 42 288 36 C 302 30 316 34 324 41 Z"
            fill="url(#oticasCyanBlueGrad)"
          />
        </g>

        {/* 3. "Dioculos" / "Di Óculos" HEAVY TEXT GROUP */}
        {variant !== 'icon-only' && (
          <g transform="translate(10, 105)">
            <text
              x="0"
              y="55"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="900"
              fontSize="68"
              letterSpacing="-0.03em"
              fill={isLightText ? '#FFFFFF' : '#0F172A'}
              style={{ textTransform: 'none' }}
            >
              Dioculos
            </text>
          </g>
        )}
      </svg>

      {showSubtext && (
        <span
          className={`text-[10px] font-bold tracking-widest uppercase border-l pl-2 ${
            isLightText ? 'text-[#C9A96E] border-[#C9A96E]/40' : 'text-[#071D49] border-[#071D49]/30'
          }`}
        >
          Ituberá • BA
        </span>
      )}
    </div>
  );
};
