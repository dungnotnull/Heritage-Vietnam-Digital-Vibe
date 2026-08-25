import React from 'react';

interface DongSonDrumProps {
  className?: string;
  size?: number | string;
  opacity?: number;
  animate?: boolean;
}

export const DongSonDrum: React.FC<DongSonDrumProps> = ({
  className = '',
  size = '100%',
  opacity = 0.25,
  animate = true,
}) => {
  // Generate 14-point Sun Star
  const numRays = 14;
  const starPoints = Array.from({ length: numRays * 2 }).map((_, i) => {
    const angle = (i * Math.PI) / numRays - Math.PI / 2;
    const r = i % 2 === 0 ? 95 : 42; // Outer vs inner radius of sun star
    const x = 500 + r * Math.cos(angle);
    const y = 500 + r * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  // Generate 14 Peacock/Feather triangles between sun rays
  const featherTriangles = Array.from({ length: numRays }).map((_, i) => {
    const midAngle = ((i * 2 + 1) * Math.PI) / numRays - Math.PI / 2;
    const baseR = 42;
    const peakR = 85;
    const leftAngle = (i * 2 * Math.PI) / numRays - Math.PI / 2;
    const rightAngle = ((i * 2 + 2) * Math.PI) / numRays - Math.PI / 2;

    const xBase1 = 500 + baseR * Math.cos(leftAngle);
    const yBase1 = 500 + baseR * Math.sin(leftAngle);
    const xPeak = 500 + peakR * Math.cos(midAngle);
    const yPeak = 500 + peakR * Math.sin(midAngle);
    const xBase2 = 500 + baseR * Math.cos(rightAngle);
    const yBase2 = 500 + baseR * Math.sin(rightAngle);

    return (
      <polygon
        key={`feather-${i}`}
        points={`${xBase1},${yBase1} ${xPeak},${yPeak} ${xBase2},${yBase2}`}
        fill="url(#bronzeGradient)"
        opacity="0.65"
      />
    );
  });

  // Generate 18 Flying Lac Birds (Chim Lạc bay ngược chiều kim đồng hồ)
  const numBirds = 18;
  const birdElements = Array.from({ length: numBirds }).map((_, i) => {
    const angleDeg = (i * 360) / numBirds;
    return (
      <g key={`bird-${i}`} transform={`rotate(${angleDeg} 500 500)`}>
        {/* Stylized Chim Lạc: Long beak, sweeping wings, extended tail feathers */}
        <g transform="translate(500, 245) scale(0.68)">
          {/* Body & Long Crest */}
          <path
            d="M-45,-2 C-30,-12 5,-14 40,-3 C55,2 75,12 85,6 C75,0 55,-6 35,-8 C10,-10 -25,-6 -45,-2 Z"
            fill="url(#goldGradient)"
          />
          {/* Long Beak (Mỏ dài đặc trưng chim Lạc) */}
          <path
            d="M40,-3 C60,-4 85,-2 105,4 C85,2 65,3 42,2 Z"
            fill="url(#goldGradient)"
          />
          {/* Sweeping Wing (Cánh xòe bay lượn) */}
          <path
            d="M5,-12 C-5,-35 -20,-50 -45,-58 C-35,-42 -22,-28 -8,-10 Z"
            fill="url(#bronzeGradient)"
          />
          <path
            d="M-5,-10 C-18,-30 -32,-42 -52,-48 C-42,-34 -30,-22 -16,-8 Z"
            fill="url(#goldGradient)"
            opacity="0.8"
          />
          {/* Tail Feathers (Đuôi dài chẽ quạt) */}
          <path
            d="M-45,-2 C-65,0 -85,8 -98,18 C-85,12 -70,6 -48,2 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M-45,-1 C-60,5 -75,15 -86,28 C-75,18 -62,10 -46,3 Z"
            fill="url(#bronzeGradient)"
            opacity="0.85"
          />
          {/* Eye */}
          <circle cx="35" cy="-2" r="2.2" fill="#FEF3C7" />
        </g>
      </g>
    );
  });

  // Generate 8 Ancient Au Lac Warriors / Sacred Deer (Người hóa trang lông chim múa & Hươu sao)
  const numWarriors = 8;
  const warriorElements = Array.from({ length: numWarriors }).map((_, i) => {
    const angleDeg = (i * 360) / numWarriors + 22.5;
    return (
      <g key={`warrior-${i}`} transform={`rotate(${angleDeg} 500 500)`}>
        <g transform="translate(500, 325) scale(0.6)">
          {/* Feather headdress (Mũ lông chim) */}
          <path
            d="M-15,-25 C-10,-40 0,-48 10,-52 C5,-38 0,-28 -5,-20 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M-8,-22 C-2,-35 8,-42 18,-45 C12,-32 6,-24 0,-18 Z"
            fill="url(#bronzeGradient)"
          />
          {/* Head & Torso */}
          <circle cx="-5" cy="-14" r="5" fill="url(#goldGradient)" />
          <path
            d="M-12,-8 C-12,5 -5,14 2,18 C-3,10 -4,0 -6,-8 Z"
            fill="url(#goldGradient)"
          />
          {/* Raised Weapon / Scepter (Tay cầm rìu giáo / khèn) */}
          <path
            d="M-6,-4 C5,-8 16,-12 28,-14 C20,-8 10,-3 2,-1 Z"
            fill="url(#goldGradient)"
          />
          {/* Feathers on back & loincloth */}
          <path
            d="M-12,2 C-22,8 -30,16 -36,26 C-28,18 -20,12 -10,6 Z"
            fill="url(#bronzeGradient)"
          />
          <path
            d="M-3,16 C-8,28 -14,38 -18,48 C-12,38 -6,28 0,18 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M4,16 C10,26 18,36 24,46 C16,36 10,26 3,17 Z"
            fill="url(#goldGradient)"
          />
        </g>
      </g>
    );
  });

  // Saw-tooth / Chevron band 1 (Răng cưa vòng 1)
  const numSawTeeth1 = 72;
  const sawTeeth1 = Array.from({ length: numSawTeeth1 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / numSawTeeth1;
    const nextAngle = ((i + 1) * 2 * Math.PI) / numSawTeeth1;
    const midAngle = ((i + 0.5) * 2 * Math.PI) / numSawTeeth1;
    const rIn = 145;
    const rOut = 158;

    const x1 = 500 + rIn * Math.cos(angle);
    const y1 = 500 + rIn * Math.sin(angle);
    const xMid = 500 + rOut * Math.cos(midAngle);
    const yMid = 500 + rOut * Math.sin(midAngle);
    const x2 = 500 + rIn * Math.cos(nextAngle);
    const y2 = 500 + rIn * Math.sin(nextAngle);

    return `${x1.toFixed(1)},${y1.toFixed(1)} ${xMid.toFixed(1)},${yMid.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }).join(' ');

  // Saw-tooth band 2 (Răng cưa vòng ngoài)
  const numSawTeeth2 = 120;
  const sawTeeth2 = Array.from({ length: numSawTeeth2 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / numSawTeeth2;
    const nextAngle = ((i + 1) * 2 * Math.PI) / numSawTeeth2;
    const midAngle = ((i + 0.5) * 2 * Math.PI) / numSawTeeth2;
    const rIn = 430;
    const rOut = 445;

    const x1 = 500 + rIn * Math.cos(angle);
    const y1 = 500 + rIn * Math.sin(angle);
    const xMid = 500 + rOut * Math.cos(midAngle);
    const yMid = 500 + rOut * Math.sin(midAngle);
    const x2 = 500 + rIn * Math.cos(nextAngle);
    const y2 = 500 + rIn * Math.sin(nextAngle);

    return `${x1.toFixed(1)},${y1.toFixed(1)} ${xMid.toFixed(1)},${yMid.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }).join(' ');

  // Concentric dots ring (Vòng chấm đồng tâm)
  const numDots = 84;
  const dotElements = Array.from({ length: numDots }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / numDots;
    const r = 182;
    const cx = 500 + r * Math.cos(angle);
    const cy = 500 + r * Math.sin(angle);
    return (
      <g key={`dot-${i}`}>
        <circle cx={cx} cy={cy} r="3" fill="url(#goldGradient)" />
        <circle cx={cx} cy={cy} r="1" fill="#FEF3C7" />
      </g>
    );
  });

  // Outer dots ring (Vòng chấm ngoài)
  const numOuterDots = 140;
  const outerDotElements = Array.from({ length: numOuterDots }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / numOuterDots;
    const r = 412;
    const cx = 500 + r * Math.cos(angle);
    const cy = 500 + r * Math.sin(angle);
    return (
      <g key={`outer-dot-${i}`}>
        <circle cx={cx} cy={cy} r="2.5" fill="url(#goldGradient)" />
      </g>
    );
  });

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 1000 1000"
        className={`w-full h-full ${animate ? 'animate-spin-very-slow' : ''}`}
        style={{ opacity }}
      >
        <defs>
          {/* Radial Antique Bronze Glow */}
          <radialGradient id="drumGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#D97706" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#B45309" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
          </radialGradient>

          {/* Golden Bronze Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Deep Antique Bronze Gradient */}
          <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Patina Stroke Pattern */}
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Ambient Glow Disk */}
        <circle cx="500" cy="500" r="490" fill="url(#drumGlow)" />

        {/* Concentric Circles Borders */}
        <circle cx="500" cy="500" r="485" fill="none" stroke="url(#strokeGradient)" strokeWidth="4" />
        <circle cx="500" cy="500" r="470" fill="none" stroke="url(#strokeGradient)" strokeWidth="2" />
        <circle cx="500" cy="500" r="455" fill="none" stroke="url(#strokeGradient)" strokeWidth="3" />
        <circle cx="500" cy="500" r="425" fill="none" stroke="url(#strokeGradient)" strokeWidth="2" />
        <circle cx="500" cy="500" r="400" fill="none" stroke="url(#strokeGradient)" strokeWidth="3" />
        
        {/* Warrior / Deer Zone Circles */}
        <circle cx="500" cy="500" r="365" fill="none" stroke="url(#strokeGradient)" strokeWidth="2" strokeDasharray="5 5" />
        <circle cx="500" cy="500" r="290" fill="none" stroke="url(#strokeGradient)" strokeWidth="3" />

        {/* Chim Lac Bird Zone Circles */}
        <circle cx="500" cy="500" r="280" fill="none" stroke="url(#strokeGradient)" strokeWidth="2" />
        <circle cx="500" cy="500" r="205" fill="none" stroke="url(#strokeGradient)" strokeWidth="3" />

        {/* Inner Geometric Circles */}
        <circle cx="500" cy="500" r="195" fill="none" stroke="url(#strokeGradient)" strokeWidth="2" />
        <circle cx="500" cy="500" r="170" fill="none" stroke="url(#strokeGradient)" strokeWidth="2" />
        <circle cx="500" cy="500" r="140" fill="none" stroke="url(#strokeGradient)" strokeWidth="2.5" />
        <circle cx="500" cy="500" r="105" fill="none" stroke="url(#strokeGradient)" strokeWidth="3" />

        {/* CENTER: 14-point Sun Star (Mặt trời 14 cánh Đông Sơn) */}
        <circle cx="500" cy="500" r="32" fill="url(#goldGradient)" opacity="0.9" />
        <circle cx="500" cy="500" r="12" fill="#FEF3C7" />
        
        {/* Star Polygon */}
        <polygon
          points={starPoints}
          fill="url(#goldGradient)"
          stroke="#FEF3C7"
          strokeWidth="1.5"
        />

        {/* Peacock feather rays between sun points */}
        {featherTriangles}

        {/* BAND 1: Inner Saw-tooth / Răng cưa */}
        <polygon
          points={sawTeeth1}
          fill="url(#bronzeGradient)"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* BAND 2: Concentric Dots / Vòng tròn có chấm tâm */}
        {dotElements}

        {/* BAND 3: 18 Flying Chim Lạc (Đàn chim Lạc bay ngược chiều kim đồng hồ) */}
        {birdElements}

        {/* BAND 4: Ancient Au Lac Warriors & Ritual Figures */}
        {warriorElements}

        {/* BAND 5: Outer Dots Ring */}
        {outerDotElements}

        {/* BAND 6: Outer Saw-tooth / Răng cưa viền ngoài */}
        <polygon
          points={sawTeeth2}
          fill="url(#goldGradient)"
          stroke="url(#bronzeGradient)"
          strokeWidth="1"
          opacity="0.85"
        />

        {/* Outer Rim S-Pattern / Meander Cord */}
        <circle
          cx="500"
          cy="500"
          r="462"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeDasharray="6 8"
          opacity="0.7"
        />
        <circle
          cx="500"
          cy="500"
          r="478"
          fill="none"
          stroke="url(#strokeGradient)"
          strokeWidth="4"
          strokeDasharray="4 6"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};
