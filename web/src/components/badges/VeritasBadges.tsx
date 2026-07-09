
"use client";
import React from "react";

interface BadgeProps { size?: number; score?: number; }

// ── Core emblem (logo mark) ──
export function VeritasEmblem({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="veg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a6bff"/>
          <stop offset="100%" stopColor="#0040cc"/>
        </linearGradient>
        <linearGradient id="veg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37"/>
          <stop offset="100%" stopColor="#a07810"/>
        </linearGradient>
      </defs>
      <polygon points="50,4 96,28 96,72 50,96 4,72 4,28" fill="url(#veg1)" stroke="rgba(26,107,255,0.4)" strokeWidth="2"/>
      <polygon points="50,14 86,34 86,66 50,86 14,66 14,34" fill="none" stroke="url(#veg2)" strokeWidth="1.5" opacity="0.6"/>
      <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">V</text>
    </svg>
  );
}

// ── Score color helper ──
function scoreColor(score: number) {
  if (score >= 950) return { primary:"#d4af37", secondary:"#f0c040", glow:"rgba(212,175,55,0.4)" };
  if (score >= 850) return { primary:"#1a6bff", secondary:"#4da6ff", glow:"rgba(26,107,255,0.4)" };
  if (score >= 700) return { primary:"#7c3aed", secondary:"#a78bfa", glow:"rgba(124,58,237,0.4)" };
  return { primary:"#059669", secondary:"#00e676", glow:"rgba(5,150,105,0.4)" };
}

// ── Verified Badge (main trust badge with score) ──
export function VeritasVerifiedBadge({ size = 120, score = 750 }: BadgeProps) {
  const s = size;
  const { primary, secondary, glow } = scoreColor(score);
  const tier = score >= 950 ? "ELITE" : score >= 850 ? "EXPERT" : score >= 700 ? "PRO" : "VERIFIED";
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:`drop-shadow(0 0 ${s/8}px ${glow})`, flexShrink:0 }}>
      <defs>
        <linearGradient id={`vbg-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary}/>
          <stop offset="100%" stopColor={secondary}/>
        </linearGradient>
        <linearGradient id={`vbg2-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(4,15,36,0.98)"/>
          <stop offset="100%" stopColor="rgba(6,18,41,0.96)"/>
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <polygon points="60,4 116,33 116,87 60,116 4,87 4,33" fill={`url(#vbg-${score})`} opacity="0.2"/>
      <polygon points="60,4 116,33 116,87 60,116 4,87 4,33" fill="none" stroke={`url(#vbg-${score})`} strokeWidth="2.5"/>
      {/* Inner bg */}
      <polygon points="60,14 106,38 106,82 60,106 14,82 14,38" fill={`url(#vbg2-${score})`}/>
      {/* Inner ring */}
      <polygon points="60,14 106,38 106,82 60,106 14,82 14,38" fill="none" stroke={primary} strokeWidth="1" opacity="0.3"/>
      {/* V mark */}
      <text x="60" y="62" textAnchor="middle" fontSize="30" fontWeight="900" fill={primary} fontFamily="Arial,sans-serif">V</text>
      {/* Score */}
      <text x="60" y="80" textAnchor="middle" fontSize="13" fontWeight="800" fill="white" fontFamily="Arial,sans-serif">{score}</text>
      {/* Tier */}
      <text x="60" y="96" textAnchor="middle" fontSize="7" fontWeight="700" fill={secondary} fontFamily="Arial,sans-serif" letterSpacing="2">{tier}</text>
      {/* Check mark */}
      <circle cx="60" cy="32" r="10" fill={primary} opacity="0.15"/>
      <polyline points="55,32 59,36 67,27" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── New Member Badge ──
export function NewMemberBadge({ size = 100 }: BadgeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:"drop-shadow(0 0 8px rgba(0,200,83,0.4))", flexShrink:0 }}>
      <defs>
        <linearGradient id="nmg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c853"/><stop offset="100%" stopColor="#00e676"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="rgba(0,200,83,0.1)" stroke="url(#nmg1)" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="36" fill="rgba(4,15,36,0.95)" stroke="rgba(0,200,83,0.2)" strokeWidth="1"/>
      <text x="50" y="45" textAnchor="middle" fontSize="20" fill="#00e676" fontFamily="Arial,sans-serif">🌟</text>
      <text x="50" y="60" textAnchor="middle" fontSize="8" fontWeight="800" fill="white" fontFamily="Arial,sans-serif">NEW</text>
      <text x="50" y="70" textAnchor="middle" fontSize="6" fontWeight="600" fill="rgba(0,200,83,0.8)" fontFamily="Arial,sans-serif">MEMBER</text>
    </svg>
  );
}

// ── 50 Jobs Badge ──
export function Jobs50Badge({ size = 100 }: BadgeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:"drop-shadow(0 0 8px rgba(77,166,255,0.4))", flexShrink:0 }}>
      <defs>
        <linearGradient id="j50g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a6bff"/><stop offset="100%" stopColor="#4da6ff"/>
        </linearGradient>
      </defs>
      <polygon points="50,4 96,28 96,72 50,96 4,72 4,28" fill="rgba(26,107,255,0.1)" stroke="url(#j50g)" strokeWidth="2.5"/>
      <polygon points="50,14 86,34 86,66 50,86 14,66 14,34" fill="rgba(4,15,36,0.95)" stroke="rgba(26,107,255,0.2)" strokeWidth="1"/>
      <text x="50" y="52" textAnchor="middle" fontSize="18" fontWeight="900" fill="#4da6ff" fontFamily="Arial,sans-serif">50</text>
      <text x="50" y="65" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial,sans-serif">JOBS</text>
    </svg>
  );
}

// ── 100 Jobs Badge ──
export function Jobs100Badge({ size = 100 }: BadgeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:"drop-shadow(0 0 8px rgba(240,192,64,0.4))", flexShrink:0 }}>
      <defs>
        <linearGradient id="j100g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37"/><stop offset="100%" stopColor="#f0c040"/>
        </linearGradient>
      </defs>
      <polygon points="50,4 96,28 96,72 50,96 4,72 4,28" fill="rgba(212,175,55,0.1)" stroke="url(#j100g)" strokeWidth="2.5"/>
      <polygon points="50,14 86,34 86,66 50,86 14,66 14,34" fill="rgba(4,15,36,0.95)" stroke="rgba(212,175,55,0.2)" strokeWidth="1"/>
      <text x="50" y="52" textAnchor="middle" fontSize="15" fontWeight="900" fill="#f0c040" fontFamily="Arial,sans-serif">100</text>
      <text x="50" y="65" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial,sans-serif">JOBS</text>
    </svg>
  );
}

// ── First Escrow Badge ──
export function FirstEscrowBadge({ size = 100 }: BadgeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:"drop-shadow(0 0 8px rgba(167,139,250,0.4))", flexShrink:0 }}>
      <defs>
        <linearGradient id="feg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="rgba(124,58,237,0.1)" stroke="url(#feg)" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="36" fill="rgba(4,15,36,0.95)" stroke="rgba(124,58,237,0.2)" strokeWidth="1"/>
      <text x="50" y="46" textAnchor="middle" fontSize="20" fill="#a78bfa" fontFamily="Arial,sans-serif">🔒</text>
      <text x="50" y="62" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial,sans-serif">FIRST ESCROW</text>
    </svg>
  );
}

// ── Escrow Master Badge ──
export function EscrowMasterBadge({ size = 100 }: BadgeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:"drop-shadow(0 0 8px rgba(167,139,250,0.5))", flexShrink:0 }}>
      <defs>
        <linearGradient id="emg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>
      <polygon points="50,4 96,28 96,72 50,96 4,72 4,28" fill="rgba(109,40,217,0.12)" stroke="url(#emg)" strokeWidth="2.5"/>
      <polygon points="50,14 86,34 86,66 50,86 14,66 14,34" fill="rgba(4,15,36,0.95)" stroke="rgba(109,40,217,0.2)" strokeWidth="1"/>
      <text x="50" y="50" textAnchor="middle" fontSize="18" fill="#a78bfa" fontFamily="Arial,sans-serif">🏦</text>
      <text x="50" y="65" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial,sans-serif">ESCROW MASTER</text>
    </svg>
  );
}

// ── 1 Year Verified Badge ──
export function YearVerifiedBadge({ size = 100 }: BadgeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:"drop-shadow(0 0 8px rgba(0,212,255,0.4))", flexShrink:0 }}>
      <defs>
        <linearGradient id="yvg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00b4d8"/><stop offset="100%" stopColor="#00d4ff"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="rgba(0,212,255,0.08)" stroke="url(#yvg)" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="36" fill="rgba(4,15,36,0.95)" stroke="rgba(0,212,255,0.2)" strokeWidth="1"/>
      <text x="50" y="46" textAnchor="middle" fontSize="18" fill="#00d4ff" fontFamily="Arial,sans-serif">📅</text>
      <text x="50" y="62" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial,sans-serif">1 YEAR VERIFIED</text>
    </svg>
  );
}

// ── Top Trust Score Badge ──
export function TopTrustScoreBadge({ size = 100 }: BadgeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter:"drop-shadow(0 0 10px rgba(212,175,55,0.5))", flexShrink:0 }}>
      <defs>
        <linearGradient id="ttsg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37"/><stop offset="100%" stopColor="#f0c040"/>
        </linearGradient>
      </defs>
      <polygon points="50,4 96,28 96,72 50,96 4,72 4,28" fill="rgba(212,175,55,0.12)" stroke="url(#ttsg)" strokeWidth="3"/>
      <polygon points="50,14 86,34 86,66 50,86 14,66 14,34" fill="rgba(4,15,36,0.95)" stroke="rgba(212,175,55,0.25)" strokeWidth="1.5"/>
      <text x="50" y="48" textAnchor="middle" fontSize="20" fill="#f0c040" fontFamily="Arial,sans-serif">👑</text>
      <text x="50" y="63" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial,sans-serif">TOP TRUST SCORE</text>
    </svg>
  );
}
