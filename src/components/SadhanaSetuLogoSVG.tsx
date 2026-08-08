import React from 'react';

export interface SadhanaSetuLogoProps {
  size?: number;
  variant?: 'primary' | 'monochrome' | 'goldOnBlack' | 'whiteOnIndigo' | 'transparent' | 'circular';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const SadhanaSetuLogoSVG: React.FC<SadhanaSetuLogoProps> = ({
  size = 320,
  variant = 'primary',
  showWordmark = true,
  showTagline = true,
  className = ''
}) => {
  // Determine color theme
  let isMono = variant === 'monochrome';
  let isGoldBlack = variant === 'goldOnBlack';

  // Generate 36 rich golden mala beads along circle centered at (200, 180) r=115
  const beadCount = 38;
  const cx = 200;
  const cy = 180;
  const r = 112;
  const beads = Array.from({ length: beadCount }, (_, i) => {
    const angle = (i * 360) / beadCount * (Math.PI / 180) - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, angle, id: i };
  });

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size * (showWordmark ? 1.15 : 1)}
        viewBox={showWordmark ? "0 0 400 460" : "0 0 400 400"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xl transition-transform hover:scale-[1.01]"
      >
        <defs>
          {/* Main Background Gradient */}
          <radialGradient id="logoBgGrad" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#3B154C" />
            <stop offset="60%" stopColor="#210D30" />
            <stop offset="100%" stopColor="#12061C" />
          </radialGradient>

          {/* Sun Halo Glow */}
          <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE082" stopOpacity="1" />
            <stop offset="35%" stopColor="#FFB300" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#FF6F00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
          </radialGradient>

          {/* Om Disc Gradient */}
          <linearGradient id="omDiscGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE57F" />
            <stop offset="50%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>

          {/* Metallic Gold Gradient */}
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="30%" stopColor="#FBC02D" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          {/* Secondary Gold Gradient */}
          <linearGradient id="goldSoft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>

          {/* Purple Lotus Petal Gradient */}
          <linearGradient id="lotusPurpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#AB47BC" />
            <stop offset="50%" stopColor="#7B1FA2" />
            <stop offset="100%" stopColor="#4A148C" />
          </linearGradient>

          {/* Golden Lotus Core Flame Gradient */}
          <linearGradient id="lotusFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="40%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          {/* Stairway Horizon Gradient */}
          <linearGradient id="stairGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="50%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Bead Sphere 3D Shading */}
          <radialGradient id="beadShade" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFD0" />
            <stop offset="40%" stopColor="#FFC107" />
            <stop offset="85%" stopColor="#B78103" />
            <stop offset="100%" stopColor="#5D3A00" />
          </radialGradient>
        </defs>

        {/* 1. App Icon Rounded Square Canvas */}
        {variant !== 'transparent' && (
          <rect
            width="400"
            height={showWordmark ? "460" : "400"}
            rx={variant === 'circular' ? "200" : "68"}
            fill={isMono ? "#FFFFFF" : isGoldBlack ? "#0A0A0C" : "url(#logoBgGrad)"}
            stroke={isMono ? "#111827" : "#5B21B6"}
            strokeWidth={isMono ? "2" : "1.5"}
          />
        )}

        {/* 2. Radiant Sun Rays from Om Center (200, 140) */}
        {!isMono && (
          <g opacity="0.35">
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * 15 * Math.PI) / 180;
              const x2 = 200 + 170 * Math.cos(a);
              const y2 = 140 + 170 * Math.sin(a);
              return (
                <line
                  key={i}
                  x1="200"
                  y1="140"
                  x2={x2}
                  y2={y2}
                  stroke="url(#goldMetallic)"
                  strokeWidth="1.5"
                />
              );
            })}
          </g>
        )}

        {/* 3. Outer Aura Glow */}
        {!isMono && (
          <circle cx="200" cy="140" r="105" fill="url(#sunGlowGrad)" />
        )}

        {/* 4. Golden Om Sun Disc at (200, 140) */}
        <circle
          cx="200"
          cy="140"
          r="45"
          fill={isMono ? "#111827" : "url(#omDiscGrad)"}
          stroke={isMono ? "#111827" : "#FFF59D"}
          strokeWidth="3"
        />
        <circle
          cx="200"
          cy="140"
          r="48"
          fill="none"
          stroke={isMono ? "#111827" : "#FFB300"}
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Devanagari Sacred Om Symbol (ॐ) */}
        <text
          x="200"
          y="142"
          textAnchor="middle"
          dominantBaseline="central"
          fill={isMono ? "#FFFFFF" : "#3E1C00"}
          fontSize="48"
          fontWeight="bold"
          fontFamily="Georgia, 'Times New Roman', serif"
        >
          🕉️
        </text>

        {/* 5. Ascending Golden Stairway Path under Bridge */}
        <g id="GoldenStairway">
          {/* Water/Reflective Surface Waves */}
          <path
            d="M 120,240 Q 200,230 280,240 L 260,280 Q 200,270 140,280 Z"
            fill={isMono ? "#E5E7EB" : "#2A0E42"}
            opacity="0.8"
          />

          {/* Stepped Pyramid Stairs leading up into the Om Sun */}
          <polygon points="188,185 212,185 215,193 185,193" fill={isMono ? "#111827" : "url(#stairGrad)"} />
          <polygon points="185,193 215,193 219,202 181,202" fill={isMono ? "#374151" : "url(#stairGrad)"} opacity="0.95" />
          <polygon points="181,202 219,202 224,212 176,212" fill={isMono ? "#111827" : "url(#stairGrad)"} opacity="0.9" />
          <polygon points="176,212 224,212 230,223 170,223" fill={isMono ? "#374151" : "url(#stairGrad)"} opacity="0.85" />
          <polygon points="170,223 230,223 237,235 163,235" fill={isMono ? "#111827" : "url(#stairGrad)"} opacity="0.8" />
          <polygon points="163,235 237,235 245,248 155,248" fill={isMono ? "#374151" : "url(#stairGrad)"} opacity="0.75" />
        </g>

        {/* 6. Arched Golden Wooden/Metallic Bridge ("Setu") */}
        <g id="BridgeStructure">
          {/* Under-Arch Shadow */}
          <path
            d="M 108,212 Q 200,165 292,212 Q 200,185 108,212 Z"
            fill={isMono ? "#111827" : "#1A092A"}
            opacity="0.9"
          />

          {/* Main Upper Arch Deck */}
          <path
            d="M 102,215 Q 200,162 298,215"
            fill="none"
            stroke={isMono ? "#111827" : "url(#goldMetallic)"}
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Lower Parallel Deck Rail */}
          <path
            d="M 110,223 Q 200,172 290,223"
            fill="none"
            stroke={isMono ? "#111827" : "url(#goldMetallic)"}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Bridge Balusters / Vertical Railing Posts */}
          {[125, 142, 160, 178, 200, 222, 240, 258, 275].map((xPos, idx) => {
            // Calculate height of deck curve at xPos
            const norm = (xPos - 200) / 100;
            const yTop = 162 + norm * norm * 50;
            const yBot = yTop + 10;
            return (
              <line
                key={idx}
                x1={xPos}
                y1={yTop}
                x2={xPos}
                y2={yBot}
                stroke={isMono ? "#111827" : "url(#goldSoft)"}
                strokeWidth="2.5"
              />
            );
          })}

          {/* Left Main Pillar Post */}
          <path
            d="M 112,200 L 112,230 M 108,198 L 116,198 M 108,232 L 116,232"
            stroke={isMono ? "#111827" : "url(#goldMetallic)"}
            strokeWidth="3"
          />
          <circle cx="112" cy="194" r="3.5" fill={isMono ? "#111827" : "url(#goldMetallic)"} />

          {/* Right Main Pillar Post */}
          <path
            d="M 288,200 L 288,230 M 284,198 L 292,198 M 284,232 L 292,232"
            stroke={isMono ? "#111827" : "url(#goldMetallic)"}
            strokeWidth="3"
          />
          <circle cx="288" cy="194" r="3.5" fill={isMono ? "#111827" : "url(#goldMetallic)"} />
        </g>

        {/* 7. 108 Mala Beads Circle & Hanging Tassel */}
        <g id="MalaCircle">
          {/* Connecting Mala String */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={isMono ? "#111827" : "#B78103"}
            strokeWidth="1.5"
          />

          {/* Bead Spheres */}
          {beads.map(b => (
            <circle
              key={b.id}
              cx={b.x}
              cy={b.y}
              r={b.id === 0 ? "7.5" : "5.5"}
              fill={isMono ? "#111827" : "url(#beadShade)"}
              stroke={isMono ? "#FFFFFF" : "#5D3A00"}
              strokeWidth="0.8"
            />
          ))}

          {/* Guru Bead Ornate Clasp at Top Center (12 o'clock) */}
          <g transform="translate(200, 68)">
            <path
              d="M -6,-2 L 0,-10 L 6,-2 L 0,6 Z"
              fill={isMono ? "#111827" : "url(#goldMetallic)"}
            />
            <circle cx="0" cy="-2" r="2" fill="#FFF9C4" />
          </g>

          {/* Sacred Tassel at ~7 o'clock (Position: ~122, 255) */}
          <g transform="translate(120, 252) rotate(-22)">
            {/* Tassel Binding Ring */}
            <rect x="-4" y="0" width="8" height="4" rx="1" fill={isMono ? "#111827" : "url(#goldMetallic)"} />
            {/* Tassel Head */}
            <path d="M -5,4 C -6,10 -8,16 -12,22 C -6,22 0,22 2,22 C -2,16 -3,10 -5,4 Z" fill={isMono ? "#111827" : "url(#goldMetallic)"} />
            {/* Dangling Fringe Threads */}
            <path d="M -11,22 L -15,38 M -9,22 L -11,40 M -7,22 L -7,41 M -5,22 L -3,40 M -3,22 L 2,37" stroke={isMono ? "#111827" : "url(#goldMetallic)"} strokeWidth="1.2" />
          </g>
        </g>

        {/* 8. Sacred Multi-Layered Lotus Base */}
        <g id="SacredLotus" transform="translate(200, 268)">
          {/* Outer Layer Deep Violet/Purple Petals */}
          <path d="M 0,15 C -25,2 -65,-2 -78,12 C -85,28 -55,38 -30,28 C -15,22 0,15 0,15 Z" fill={isMono ? "#111827" : "url(#lotusPurpleGrad)"} />
          <path d="M 0,15 C 25,2 65,-2 78,12 C 85,28 55,38 30,28 C 15,22 0,15 0,15 Z" fill={isMono ? "#111827" : "url(#lotusPurpleGrad)"} />

          <path d="M 0,12 C -20,-8 -50,-12 -62,2 C -68,18 -42,28 -20,20 C -10,16 0,12 0,12 Z" fill={isMono ? "#374151" : "#8E24AA"} />
          <path d="M 0,12 C 20,-8 50,-12 62,2 C 68,18 42,28 20,20 C 10,16 0,12 0,12 Z" fill={isMono ? "#374151" : "#8E24AA"} />

          {/* Middle Layer Magenta/Purple Petals */}
          <path d="M 0,8 C -18,-18 -38,-20 -48,-4 C -52,12 -30,20 -12,14 Z" fill={isMono ? "#111827" : "#AB47BC"} />
          <path d="M 0,8 C 18,-18 38,-20 48,-4 C 52,12 30,20 12,14 Z" fill={isMono ? "#111827" : "#AB47BC"} />

          {/* Inner Golden Saffron Flame Petals */}
          <path d="M 0,4 C -12,-22 -26,-22 -32,-8 C -35,6 -18,14 -8,8 Z" fill={isMono ? "#D1D5DB" : "url(#lotusFlameGrad)"} />
          <path d="M 0,4 C 12,-22 26,-22 32,-8 C 35,6 18,14 8,8 Z" fill={isMono ? "#D1D5DB" : "url(#lotusFlameGrad)"} />

          {/* Central Glowing Golden Flame Petal */}
          <path d="M 0,-32 C 10,-18 14,0 0,12 C -14,0 -10,-18 0,-32 Z" fill={isMono ? "#FFFFFF" : "url(#lotusFlameGrad)"} />
          <path d="M 0,-24 C 6,-12 8,0 0,8 C -8,0 -6,-12 0,-24 Z" fill="#FFF9C4" />
        </g>

        {/* 9. WORDMARK & TYPOGRAPHY (When showWordmark = true) */}
        {showWordmark && (
          <g id="WordmarkGroup" transform="translate(200, 368)">
            {/* App Name: "SadhanaSetu" */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontSize="38"
              fontWeight="bold"
              fontFamily="Georgia, 'Times New Roman', serif"
              letterSpacing="0.5"
            >
              <tspan fill={isMono ? "#111827" : "#FFFDF7"}>Sadhana</tspan>
              <tspan fill={isMono ? "#111827" : "url(#goldMetallic)"}>Setu</tspan>
            </text>

            {/* Elegant Horizontal Flourish Line with Central Lotus Leaf */}
            <g transform="translate(0, 18)">
              <line x1="-130" y1="0" x2="-12" y2="0" stroke={isMono ? "#111827" : "url(#goldMetallic)"} strokeWidth="1" />
              <path d="M -6,0 Q 0,-5 6,0 Q 0,5 -6,0 Z" fill={isMono ? "#111827" : "url(#goldMetallic)"} />
              <circle cx="0" cy="0" r="1.5" fill="#FFF9C4" />
              <line x1="12" y1="0" x2="130" y2="0" stroke={isMono ? "#111827" : "url(#goldMetallic)"} strokeWidth="1" />
            </g>

            {/* Tagline: "TRACK EVERY CHANT. HONOR EVERY PRACTICE." */}
            {showTagline && (
              <text
                x="0"
                y="38"
                textAnchor="middle"
                fill={isMono ? "#4B5563" : "#FFC107"}
                fontSize="10.5"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                letterSpacing="2"
                opacity="0.95"
              >
                TRACK EVERY CHANT. HONOR EVERY PRACTICE.
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
