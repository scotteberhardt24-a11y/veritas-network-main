"use client";
import React from "react";

interface BadgeProps { size?: number; score?: number; }

// ── Shared laurel wreath SVG path helper ──
function LaurelWreath({ cx, cy, r, color = "#D4AF37" }: { cx: number; cy: number; r: number; color?: string }) {
  const leaves = 12;
  const items = [];
  for (let i = 0; i < leaves; i++) {
    const angle = (i / leaves) * Math.PI - Math.PI / 2;
    const side = i < leaves / 2 ? -1 : 1;
    const lx = cx + side * (r + 6) * Math.cos(angle) * (side === -1 ? -1 : 1);
    const ly = cy + r * Math.sin(angle);
    const rot = (angle * 180 / Math.PI) + (side === -1 ? -30 : 30);
    items.push(
      <ellipse key={i} cx={lx} cy={ly} rx={6} ry={3}
        fill={color} opacity={0.9}
        transform={`rotate(${rot}, ${lx}, ${ly})`}
      />
    );
  }
  return <>{items}</>;
}

// ── Gold shield shape ──
function Shield({ size, children, glowColor = "#D4AF37" }: { size: number; children: React.ReactNode; glowColor?: string }) {
  const s = size;
  const w = s, h = s;
  // Shield path: classic heraldic shield
  const path = `M ${w*0.5} ${h*0.08}
    L ${w*0.92} ${h*0.22}
    L ${w*0.92} ${h*0.58}
    Q ${w*0.92} ${h*0.82} ${w*0.5} ${h*0.96}
    Q ${w*0.08} ${h*0.82} ${w*0.08} ${h*0.58}
    L ${w*0.08} ${h*0.22}
    Z`;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 4px 12px rgba(212,175,55,0.5)) drop-shadow(0 0 20px rgba(212,175,55,0.2))`, flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg-outer-${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D97A"/>
          <stop offset="40%" stopColor="#D4AF37"/>
          <stop offset="100%" stopColor="#8B6914"/>
        </linearGradient>
        <linearGradient id={`sg-inner-${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a4a9e"/>
          <stop offset="100%" stopColor="#0d2d6b"/>
        </linearGradient>
        <linearGradient id={`sg-green-${s}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3dba5e"/>
          <stop offset="100%" stopColor="#1a7a3a"/>
        </linearGradient>
        <linearGradient id={`sg-ribbon-${s}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2eb850"/>
          <stop offset="100%" stopColor="#1a6b30"/>
        </linearGradient>
        <radialGradient id={`sg-glow-${s}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#3a6acc" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#0d2d6b" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Outer gold shield */}
      <path d={path} fill={`url(#sg-outer-${s})`}/>

      {/* Inner blue shield (inset) */}
      {(() => {
        const inset = s * 0.06;
        const iw = w - inset*2, ih = h - inset*2;
        const innerPath = `M ${w*0.5} ${h*0.13}
          L ${w*0.88} ${h*0.25}
          L ${w*0.88} ${h*0.58}
          Q ${w*0.88} ${h*0.80} ${w*0.5} ${h*0.93}
          Q ${w*0.12} ${h*0.80} ${w*0.12} ${h*0.58}
          L ${w*0.12} ${h*0.25}
          Z`;
        return <path d={innerPath} fill={`url(#sg-inner-${s})`}/>;
      })()}

      {/* Blue glow overlay */}
      {(() => {
        const innerPath = `M ${w*0.5} ${h*0.13}
          L ${w*0.88} ${h*0.25}
          L ${w*0.88} ${h*0.58}
          Q ${w*0.88} ${h*0.80} ${w*0.5} ${h*0.93}
          Q ${w*0.12} ${h*0.80} ${w*0.12} ${h*0.58}
          L ${w*0.12} ${h*0.25}
          Z`;
        return <path d={innerPath} fill={`url(#sg-glow-${s})`}/>;
      })()}

      {/* Stars */}
      {[0.25, 0.5, 0.75].map((x, i) => (
        <text key={i} x={w*x} y={h*0.32} textAnchor="middle" fontSize={s*0.08} fill="#D4AF37" opacity={0.7}>★</text>
      ))}

      {children}
    </svg>
  );
}

// ── Ribbon banner ──
function Ribbon({ y, width, text, fontSize, color = "#2eb850" }: { y: number; width: number; text: string; fontSize: number; color?: string }) {
  const rw = width * 0.86;
  const rh = width * 0.14;
  const rx = width * 0.07;
  return (
    <g>
      {/* Left tail */}
      <polygon points={`${rx},${y} ${rx+rw*0.08},${y-rh*0.3} ${rx},${y+rh} ${rx-rh*0.4},${y+rh*0.5}`} fill="#1a5c28"/>
      {/* Right tail */}
      <polygon points={`${rx+rw},${y} ${rx+rw-rw*0.08},${y-rh*0.3} ${rx+rw},${y+rh} ${rx+rw+rh*0.4},${y+rh*0.5}`} fill="#1a5c28"/>
      {/* Main ribbon */}
      <rect x={rx} y={y} width={rw} height={rh} rx={rh*0.2} fill={color}/>
      {/* Ribbon shine */}
      <rect x={rx} y={y} width={rw} height={rh*0.4} rx={rh*0.2} fill="rgba(255,255,255,0.15)"/>
      <text x={width*0.5} y={y + rh*0.72} textAnchor="middle" fontSize={fontSize}
        fontWeight="900" fill="white" fontFamily="Arial,sans-serif"
        style={{textShadow:"0 1px 2px rgba(0,0,0,0.5)", letterSpacing:"0.05em"}}>
        {text}
      </text>
    </g>
  );
}

// ── Laurel branches (left and right) ──
function Laurels({ size, yCenter }: { size: number; yCenter: number }) {
  const s = size;
  const leafColor = "#D4AF37";
  const darkLeaf = "#8B6914";

  function Branch({ side }: { side: 1 | -1 }) {
    const cx = side === -1 ? s * 0.18 : s * 0.82;
    const leaves = [];
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const angle = side === -1
        ? (-0.3 + t * 0.9) * Math.PI
        : (0.3 - t * 0.9) * Math.PI + Math.PI;
      const r = s * 0.28;
      const lx = s * 0.5 + Math.cos(angle) * r * (side === -1 ? -1 : 1);
      const ly = yCenter + Math.sin(angle) * r * 0.7 - s * 0.05;
      const rot = angle * 180 / Math.PI + (side === -1 ? 90 : -90);
      const leafW = s * 0.06 + (i === 3 ? s * 0.01 : 0);
      const leafH = s * 0.12;
      leaves.push(
        <g key={i} transform={`translate(${lx},${ly}) rotate(${rot})`}>
          <ellipse cx={0} cy={0} rx={leafW} ry={leafH}
            fill={i % 2 === 0 ? leafColor : darkLeaf} opacity={0.95}/>
          <ellipse cx={0} cy={-leafH*0.2} rx={leafW*0.4} ry={leafH*0.35}
            fill="rgba(255,255,255,0.2)"/>
        </g>
      );
    }
    return <>{leaves}</>;
  }

  return (
    <>
      <Branch side={-1}/>
      <Branch side={1}/>
      {/* Bottom connection */}
      <ellipse cx={s*0.5} cy={yCenter + s*0.25} rx={s*0.05} ry={s*0.03} fill={leafColor}/>
    </>
  );
}

// ══════════════════════════════════════════
// VERIFIED BADGE (main badge with score)
// ══════════════════════════════════════════
export function VeritasVerifiedBadge({ size = 120, score = 845 }: BadgeProps) {
  const s = size;
  const tier = score >= 950 ? "ELITE" : score >= 850 ? "EXPERT" : score >= 700 ? "PRO" : "VERIFIED";
  return (
    <Shield size={s}>
      {/* Laurels */}
      <Laurels size={s} yCenter={s*0.55}/>

      {/* Green circle for checkmark */}
      <circle cx={s*0.5} cy={s*0.46} r={s*0.18}
        fill="url(#sg-green-x)" stroke="#D4AF37" strokeWidth={s*0.015}/>
      <defs>
        <radialGradient id="sg-green-x" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#4dcc6a"/>
          <stop offset="100%" stopColor="#1a7a3a"/>
        </radialGradient>
      </defs>
      {/* Checkmark */}
      <polyline
        points={`${s*0.37},${s*0.46} ${s*0.46},${s*0.55} ${s*0.63},${s*0.37}`}
        stroke="#D4AF37" strokeWidth={s*0.05} strokeLinecap="round" strokeLinejoin="round" fill="none"/>

      {/* VERITAS VERIFIED text at top */}
      <text x={s*0.5} y={s*0.22} textAnchor="middle" fontSize={s*0.1}
        fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif" letterSpacing="0.05em">VERITAS</text>
      <text x={s*0.5} y={s*0.31} textAnchor="middle" fontSize={s*0.085}
        fontWeight="900" fill="white" fontFamily="Arial,sans-serif" letterSpacing="0.03em">VERIFIED</text>

      {/* TRUST SCORE ribbon */}
      <Ribbon y={s*0.67} width={s} text="TRUST SCORE" fontSize={s*0.085} color="#2eb850"/>

      {/* Score number */}
      <text x={s*0.5} y={s*0.87} textAnchor="middle" fontSize={s*0.16}
        fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif"
        stroke="#8B6914" strokeWidth={s*0.008}>{score}</text>
    </Shield>
  );
}

// ══════════════════════════════════════════
// VERITAS EMBLEM (logo mark)
// ══════════════════════════════════════════
export function VeritasEmblem({ size = 40 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 6px rgba(212,175,55,0.4))", flexShrink: 0 }}>
      <defs>
        <linearGradient id="vem-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D97A"/>
          <stop offset="100%" stopColor="#8B6914"/>
        </linearGradient>
        <linearGradient id="vem-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a4a9e"/>
          <stop offset="100%" stopColor="#0d2d6b"/>
        </linearGradient>
      </defs>
      <path d="M50 4 L93 23 L93 60 Q93 84 50 96 Q7 84 7 60 L7 23 Z" fill="url(#vem-gold)"/>
      <path d="M50 11 L86 27 L86 60 Q86 80 50 91 Q14 80 14 60 L14 27 Z" fill="url(#vem-blue)"/>
      <text x="50" y="67" textAnchor="middle" fontSize="36" fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif">V</text>
    </svg>
  );
}

// ══════════════════════════════════════════
// SMALL BADGE TEMPLATE
// ══════════════════════════════════════════
function SmallBadge({ size, icon, label, color = "#2eb850" }: { size: number; icon: React.ReactNode; label: string; color?: string }) {
  const s = size;
  return (
    <Shield size={s}>
      <Laurels size={s} yCenter={s*0.52}/>
      <g transform={`translate(${s*0.5}, ${s*0.48})`}>
        {icon}
      </g>
      <Ribbon y={s*0.70} width={s} text={label} fontSize={s*0.09} color={color}/>
    </Shield>
  );
}

// ══════════════════════════════════════════
// NEW MEMBER
// ══════════════════════════════════════════
export function NewMemberBadge({ size = 100 }: BadgeProps) {
  const s = size;
  return (
    <SmallBadge size={s} label="NEW MEMBER" icon={
      <g>
        {/* Crossed hammer and key */}
        <rect x={-s*0.05} y={-s*0.2} width={s*0.07} height={s*0.32} rx={s*0.02} fill="#D4AF37" transform="rotate(35)"/>
        <rect x={-s*0.05} y={-s*0.2} width={s*0.07} height={s*0.32} rx={s*0.02} fill="#D4AF37" transform="rotate(-35)"/>
        <circle cx={-s*0.12} cy={-s*0.12} r={s*0.06} fill="none" stroke="#D4AF37" strokeWidth={s*0.025}/>
      </g>
    }/>
  );
}

// ══════════════════════════════════════════
// 50 JOBS
// ══════════════════════════════════════════
export function Jobs50Badge({ size = 100 }: BadgeProps) {
  const s = size;
  return (
    <Shield size={s}>
      <Laurels size={s} yCenter={s*0.52}/>
      <text x={s*0.5} y={s*0.58} textAnchor="middle" fontSize={s*0.26}
        fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif"
        stroke="#8B6914" strokeWidth={s*0.008}>50</text>
      <text x={s*0.5} y={s*0.68} textAnchor="middle" fontSize={s*0.08}
        fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial,sans-serif" letterSpacing="0.05em">JOBS</text>
      <Ribbon y={s*0.72} width={s} text="JOBS COMPLETED" fontSize={s*0.082}/>
    </Shield>
  );
}

// ══════════════════════════════════════════
// 100 JOBS
// ══════════════════════════════════════════
export function Jobs100Badge({ size = 100 }: BadgeProps) {
  const s = size;
  return (
    <Shield size={s}>
      <Laurels size={s} yCenter={s*0.52}/>
      {/* Trophy cup */}
      <g transform={`translate(${s*0.5}, ${s*0.38})`}>
        <rect x={-s*0.06} y={s*0.06} width={s*0.12} height={s*0.04} rx={s*0.01} fill="#D4AF37"/>
        <rect x={-s*0.04} y={s*0.1} width={s*0.08} height={s*0.03} rx={s*0.01} fill="#D4AF37"/>
        <path d={`M ${-s*0.1} ${-s*0.14} Q ${-s*0.14} ${s*0.02} ${-s*0.04} ${s*0.06} L ${s*0.04} ${s*0.06} Q ${s*0.14} ${s*0.02} ${s*0.1} ${-s*0.14} Z`} fill="#D4AF37"/>
        <path d={`M ${-s*0.1} ${-s*0.14} Q ${-s*0.14} ${s*0.02} ${-s*0.04} ${s*0.06}`} fill="none" stroke="#8B6914" strokeWidth={s*0.01}/>
        <circle cx={0} cy={-s*0.06} r={s*0.04} fill="#F5D97A"/>
      </g>
      <text x={s*0.5} y={s*0.62} textAnchor="middle" fontSize={s*0.2}
        fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif"
        stroke="#8B6914" strokeWidth={s*0.006}>100</text>
      <Ribbon y={s*0.72} width={s} text="JOBS COMPLETED" fontSize={s*0.082}/>
    </Shield>
  );
}

// ══════════════════════════════════════════
// FIRST ESCROW
// ══════════════════════════════════════════
export function FirstEscrowBadge({ size = 100 }: BadgeProps) {
  const s = size;
  return (
    <SmallBadge size={s} label="FIRST ESCROW" icon={
      <g>
        {/* Money bag */}
        <ellipse cx={0} cy={s*0.04} rx={s*0.13} ry={s*0.16} fill="#3dba5e"/>
        <ellipse cx={0} cy={s*0.04} rx={s*0.09} ry={s*0.12} fill="#4dcc6a"/>
        <text x={0} y={s*0.09} textAnchor="middle" fontSize={s*0.14} fill="#D4AF37" fontWeight="900">$</text>
        {/* Bag neck */}
        <rect x={-s*0.04} y={-s*0.14} width={s*0.08} height={s*0.06} rx={s*0.02} fill="#2a8a40"/>
        <ellipse cx={0} cy={-s*0.14} rx={s*0.06} ry={s*0.03} fill="#1a5c28"/>
      </g>
    }/>
  );
}

// ══════════════════════════════════════════
// ESCROW MASTER
// ══════════════════════════════════════════
export function EscrowMasterBadge({ size = 100 }: BadgeProps) {
  const s = size;
  return (
    <Shield size={s}>
      <Laurels size={s} yCenter={s*0.52}/>
      {/* Three money bags */}
      {[-s*0.14, 0, s*0.14].map((dx, i) => (
        <g key={i} transform={`translate(${s*0.5 + dx}, ${s*0.46 - (i===1?s*0.04:0)})`}>
          <ellipse cx={0} cy={s*0.04} rx={s*0.09} ry={s*0.11} fill="#3dba5e"/>
          <ellipse cx={0} cy={s*0.04} rx={s*0.06} ry={s*0.08} fill="#4dcc6a"/>
          <text x={0} y={s*0.08} textAnchor="middle" fontSize={s*0.09} fill="#D4AF37" fontWeight="900">$</text>
          <rect x={-s*0.025} y={-s*0.09} width={s*0.05} height={s*0.04} rx={s*0.01} fill="#2a8a40"/>
        </g>
      ))}
      <Ribbon y={s*0.70} width={s} text="ESCROW MASTER" fontSize={s*0.083}/>
    </Shield>
  );
}

// ══════════════════════════════════════════
// 1 YEAR VERIFIED
// ══════════════════════════════════════════
export function YearVerifiedBadge({ size = 100 }: BadgeProps) {
  const s = size;
  return (
    <Shield size={s}>
      <Laurels size={s} yCenter={s*0.52}/>
      {/* Globe */}
      <circle cx={s*0.5} cy={s*0.47} r={s*0.14} fill="#3dba5e" stroke="#D4AF37" strokeWidth={s*0.012}/>
      <ellipse cx={s*0.5} cy={s*0.47} rx={s*0.07} ry={s*0.14} fill="none" stroke="#1a5c28" strokeWidth={s*0.01}/>
      <line x1={s*0.36} y1={s*0.47} x2={s*0.64} y2={s*0.47} stroke="#1a5c28" strokeWidth={s*0.01}/>
      {/* Number 1 */}
      <text x={s*0.5} y={s*0.52} textAnchor="middle" fontSize={s*0.16}
        fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif" stroke="#8B6914" strokeWidth={s*0.005}>1</text>
      <Ribbon y={s*0.70} width={s} text="1 YEAR VERIFIED" fontSize={s*0.083}/>
    </Shield>
  );
}

// ══════════════════════════════════════════
// TOP TRUST SCORE
// ══════════════════════════════════════════
export function TopTrustScoreBadge({ size = 100 }: BadgeProps) {
  const s = size;
  return (
    <Shield size={s}>
      <Laurels size={s} yCenter={s*0.52}/>
      {/* Big gold star */}
      <text x={s*0.5} y={s*0.6} textAnchor="middle" fontSize={s*0.32}
        fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif"
        stroke="#8B6914" strokeWidth={s*0.01}>★</text>
      <Ribbon y={s*0.70} width={s} text="TOP TRUST SCORE" fontSize={s*0.077}/>
    </Shield>
  );
}
