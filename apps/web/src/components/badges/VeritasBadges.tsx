
"use client";
import React from "react";

/* ─────────────────────────────────────────
   VERITAS BADGE SYSTEM
   Matches exact design from brand images:
   - Royal blue shield body
   - Ornate gold border & laurel wreath
   - Green checkmark / icon center
   - Green ribbon banner bottom
   ───────────────────────────────────────── */

/* Shared laurel wreath paths */
function Laurel({ side, scale=1 }: { side:"left"|"right"; scale?:number }) {
  const leaves = [0,1,2,3,4,5,6,7];
  const flip   = side === "right" ? -1 : 1;
  return (
    <g transform={`scale(${scale})`}>
      {leaves.map(i => (
        <ellipse
          key={i}
          cx={flip * (58 - i*5)} cy={95 + i*9}
          rx="10" ry="5.5"
          transform={`rotate(${flip*(−52 + i*13)} ${flip*(58 - i*5)} ${95 + i*9})`}
          fill="#c9a227"
          opacity={0.9 - i*0.06}
        />
      ))}
    </g>
  );
}

/* Gold ornate shield outline */
function ShieldBody({ children, size=160 }: { children: React.ReactNode; size?:number }) {
  const w=size, h=Math.round(size*1.15);
  return (
    <svg width={w} height={h} viewBox="0 0 200 230" fill="none" style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="sb_gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0c040"/>
          <stop offset="40%" stopColor="#c9a227"/>
          <stop offset="100%" stopColor="#7a5c00"/>
        </linearGradient>
        <linearGradient id="sb_blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a4acc"/>
          <stop offset="100%" stopColor="#0a2878"/>
        </linearGradient>
        <linearGradient id="sb_green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2eb82e"/>
          <stop offset="100%" stopColor="#1a7a1a"/>
        </linearGradient>
        <filter id="glow_gold">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="rb_inner" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#2255dd"/>
          <stop offset="100%" stopColor="#0a1f6b"/>
        </radialGradient>
      </defs>

      {/* Laurel left */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <ellipse key={"ll"+i}
          cx={32 - i*1.5} cy={75 + i*10}
          rx="13" ry="6"
          transform={`rotate(${-58+i*14} ${32-i*1.5} ${75+i*10})`}
          fill="url(#sb_gold)" opacity={0.92-i*0.07}/>
      ))}
      {/* Laurel right */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <ellipse key={"lr"+i}
          cx={168 + i*1.5} cy={75 + i*10}
          rx="13" ry="6"
          transform={`rotate(${58-i*14} ${168+i*1.5} ${75+i*10})`}
          fill="url(#sb_gold)" opacity={0.92-i*0.07}/>
      ))}

      {/* Gold outer shield border */}
      <path d="M100 8 L184 34 L184 105 Q184 165 100 198 Q16 165 16 105 L16 34 Z"
        fill="url(#sb_gold)" filter="url(#glow_gold)"/>
      {/* Blue inner shield */}
      <path d="M100 18 L174 40 L174 105 Q174 157 100 186 Q26 157 26 105 L26 40 Z"
        fill="url(#rb_inner)"/>
      {/* Inner blue shine */}
      <path d="M100 22 L168 43 L168 103 Q168 152 100 180 Q32 152 32 103 L32 43 Z"
        fill="none" stroke="rgba(100,160,255,0.15)" strokeWidth="1"/>

      {/* Children (badge icon content) */}
      {children}
    </svg>
  );
}

/* ── MAIN: Veritas Verified Trust Score Badge ── */
export function VeritasVerifiedBadge({ score=845, size=200 }:{ score?:number; size?:number }) {
  const scale = size/200;
  return (
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",
      width:size, height:Math.round(size*1.25)}}>
      {/* Outer gold glow */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse,rgba(201,162,39,0.25) 0%,transparent 70%)"}}/>
      <svg width={size} height={Math.round(size*1.25)} viewBox="0 0 200 250" fill="none" style={{overflow:"visible"}}>
        <defs>
          <linearGradient id="vvg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0c040"/><stop offset="50%" stopColor="#c9a227"/><stop offset="100%" stopColor="#7a5c00"/>
          </linearGradient>
          <linearGradient id="vvb1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a4acc"/><stop offset="100%" stopColor="#0a2878"/>
          </linearGradient>
          <radialGradient id="vvrb" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#2255dd"/><stop offset="100%" stopColor="#0a1f6b"/>
          </radialGradient>
          <linearGradient id="vvgreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3dd63d"/><stop offset="100%" stopColor="#1a8a1a"/>
          </linearGradient>
          <filter id="vvglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Laurel wreaths */}
        {[0,1,2,3,4,5,6,7,8].map(i=>(
          <ellipse key={"vl"+i} cx={24-i*1} cy={82+i*11} rx="14" ry="6.5"
            transform={`rotate(${-60+i*13} ${24-i} ${82+i*11})`} fill="url(#vvg1)" opacity={0.9-i*0.06}/>
        ))}
        {[0,1,2,3,4,5,6,7,8].map(i=>(
          <ellipse key={"vr"+i} cx={176+i} cy={82+i*11} rx="14" ry="6.5"
            transform={`rotate(${60-i*13} ${176+i} ${82+i*11})`} fill="url(#vvg1)" opacity={0.9-i*0.06}/>
        ))}

        {/* Outer pentagon-style shield */}
        <path d="M100 6 L186 32 L186 110 Q186 150 160 175 L100 198 L40 175 Q14 150 14 110 L14 32 Z"
          fill="url(#vvg1)" filter="url(#vvglow)"/>
        {/* Inner blue */}
        <path d="M100 16 L176 38 L176 110 Q176 146 152 168 L100 188 L48 168 Q24 146 24 110 L24 38 Z"
          fill="url(#vvrb)"/>
        {/* Blue radial shine */}
        <ellipse cx="100" cy="90" rx="60" ry="50" fill="rgba(60,120,255,0.08)"/>

        {/* Star top */}
        <polygon points="100,14 103,22 111,22 105,27 107,35 100,30 93,35 95,27 89,22 97,22"
          fill="#f0c040"/>

        {/* "VERITAS VERIFIED" text */}
        <text x="100" y="58" textAnchor="middle" fontSize="13" fontWeight="900"
          fill="url(#vvg1)" letterSpacing="1" fontFamily="Arial,sans-serif">VERITAS</text>
        <text x="100" y="73" textAnchor="middle" fontSize="13" fontWeight="900"
          fill="url(#vvg1)" letterSpacing="1" fontFamily="Arial,sans-serif">VERIFIED</text>

        {/* Green circle with gold checkmark */}
        <circle cx="100" cy="108" r="28" fill="url(#vvgreen)" filter="url(#vvglow)"/>
        <circle cx="100" cy="108" r="28" fill="none" stroke="url(#vvg1)" strokeWidth="2"/>
        <path d="M84 108 L96 120 L118 96" stroke="#f0c040" strokeWidth="5"
          strokeLinecap="round" strokeLinejoin="round" fill="none"/>

        {/* Laurel branches inside shield */}
        {[-1,1].map(side=>[0,1,2].map(i=>(
          <ellipse key={`il${side}${i}`}
            cx={100+side*(42+i*8)} cy={115+i*8}
            rx="8" ry="4"
            transform={`rotate(${side*(40+i*15)} ${100+side*(42+i*8)} ${115+i*8})`}
            fill="url(#vvg1)" opacity={0.65-i*0.1}/>
        )))}

        {/* Gold ribbon banner */}
        <path d="M28 148 Q100 140 172 148 L168 166 Q100 174 32 166 Z" fill="url(#vvg1)"/>
        <path d="M28 148 L14 155 L24 163 L32 166" fill="#a07810"/>
        <path d="M172 148 L186 155 L176 163 L168 166" fill="#a07810"/>
        <text x="100" y="161" textAnchor="middle" fontSize="11" fontWeight="900"
          fill="#0a2010" letterSpacing="2" fontFamily="Arial,sans-serif">TRUST SCORE</text>

        {/* Score on green circle below ribbon */}
        <circle cx="100" cy="188" r="22" fill="#1a7a1a" stroke="url(#vvg1)" strokeWidth="2"/>
        <text x="100" y="196" textAnchor="middle" fontSize="18" fontWeight="900"
          fill="#00e676" fontFamily="Arial,sans-serif"
          style={{textShadow:"0 0 8px rgba(0,230,118,0.8)"}}>{score}</text>

        {/* Stars bottom */}
        <polygon points="70,216 72,222 78,222 73,226 75,232 70,228 65,232 67,226 62,222 68,222" fill="#f0c040" opacity="0.7"/>
        <polygon points="130,216 132,222 138,222 133,226 135,232 130,228 125,232 127,226 122,222 128,222" fill="#f0c040" opacity="0.7"/>
      </svg>
    </div>
  );
}

/* ── Generic Badge Template ── */
function BadgeTemplate({ label, icon, color="blue", size=120 }:{ label:string; icon:React.ReactNode; color?:string; size?:number }) {
  const isGreen = color==="green";
  return (
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:Math.round(size*1.2)}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse,rgba(201,162,39,0.2) 0%,transparent 70%)"}}/>
      <svg width={size} height={Math.round(size*1.2)} viewBox="0 0 200 240" fill="none" style={{overflow:"visible"}}>
        <defs>
          <linearGradient id={`bg_${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0c040"/><stop offset="50%" stopColor="#c9a227"/><stop offset="100%" stopColor="#7a5c00"/>
          </linearGradient>
          <radialGradient id={`bb_${label}`} cx="50%" cy="40%">
            <stop offset="0%" stopColor={isGreen?"#1a6b1a":"#2255dd"}/>
            <stop offset="100%" stopColor={isGreen?"#0a3a0a":"#0a1f6b"}/>
          </radialGradient>
          <linearGradient id={`brib_${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2eb82e"/><stop offset="50%" stopColor="#3dd63d"/><stop offset="100%" stopColor="#1a8a1a"/>
          </linearGradient>
        </defs>

        {/* Laurels */}
        {[0,1,2,3,4,5,6].map(i=>(
          <ellipse key={"bl"+i} cx={28-i*1.5} cy={80+i*10} rx="12" ry="5.5"
            transform={`rotate(${-55+i*13} ${28-i*1.5} ${80+i*10})`} fill={`url(#bg_${label})`} opacity={0.9-i*0.08}/>
        ))}
        {[0,1,2,3,4,5,6].map(i=>(
          <ellipse key={"br"+i} cx={172+i*1.5} cy={80+i*10} rx="12" ry="5.5"
            transform={`rotate(${55-i*13} ${172+i*1.5} ${80+i*10})`} fill={`url(#bg_${label})`} opacity={0.9-i*0.08}/>
        ))}

        {/* Shield */}
        <path d="M100 10 L182 34 L182 108 Q182 162 100 192 Q18 162 18 108 L18 34 Z"
          fill={`url(#bg_${label})`}/>
        <path d="M100 19 L173 40 L173 108 Q173 157 100 184 Q27 157 27 108 L27 40 Z"
          fill={`url(#bb_${label})`}/>

        {/* Icon center */}
        <g transform="translate(65,45)">{icon}</g>

        {/* Stars */}
        {[-35,0,35].map((x,i)=>i===1&&(
          <polygon key={x} points={`100,195 102,201 108,201 103,205 105,211 100,207 95,211 97,205 92,201 98,201`}
            fill="#f0c040" opacity="0.9"/>
        ))}

        {/* Green ribbon */}
        <path d="M24 155 Q100 147 176 155 L172 171 Q100 179 28 171 Z" fill={`url(#brib_${label})`}/>
        <path d="M24 155 L10 162 L20 170 L28 171" fill="#1a6b1a"/>
        <path d="M176 155 L190 162 L180 170 L172 171" fill="#1a6b1a"/>
        <text x="100" y="167" textAnchor="middle" fontSize="11" fontWeight="900"
          fill="white" letterSpacing="1.5" fontFamily="Arial,sans-serif">{label}</text>
      </svg>
    </div>
  );
}

/* ── Individual Badges ── */

export function NewMemberBadge({ size=120 }:{ size?:number }) {
  return (
    <BadgeTemplate label="NEW MEMBER" size={size} icon={
      <svg width="70" height="70" viewBox="0 0 70 70">
        <line x1="20" y1="55" x2="50" y2="10" stroke="#f0c040" strokeWidth="6" strokeLinecap="round"/>
        <line x1="50" y1="55" x2="20" y2="10" stroke="#f0c040" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="20" cy="55" r="8" fill="#c9a227" stroke="#f0c040" strokeWidth="2"/>
        <circle cx="50" cy="10" r="8" fill="#c9a227" stroke="#f0c040" strokeWidth="2"/>
      </svg>
    }/>
  );
}

export function Jobs50Badge({ size=120 }:{ size?:number }) {
  return (
    <BadgeTemplate label="JOBS COMPLETED" size={size} icon={
      <svg width="70" height="70" viewBox="0 0 70 70">
        <text x="35" y="50" textAnchor="middle" fontSize="42" fontWeight="900"
          fill="#f0c040" fontFamily="Arial,sans-serif">50</text>
      </svg>
    }/>
  );
}

export function Jobs100Badge({ size=120 }:{ size?:number }) {
  return (
    <BadgeTemplate label="JOBS COMPLETED" size={size} icon={
      <svg width="70" height="70" viewBox="0 0 70 70">
        <polygon points="35,2 42,22 62,22 47,35 53,55 35,42 17,55 23,35 8,22 28,22" fill="#f0c040"/>
        <text x="35" y="52" textAnchor="middle" fontSize="28" fontWeight="900"
          fill="#f0c040" fontFamily="Arial,sans-serif">100</text>
      </svg>
    }/>
  );
}

export function FirstEscrowBadge({ size=120 }:{ size?:number }) {
  return (
    <BadgeTemplate label="FIRST ESCROW" size={size} icon={
      <svg width="70" height="70" viewBox="0 0 70 70">
        <ellipse cx="35" cy="38" rx="22" ry="20" fill="#2eb82e" stroke="#f0c040" strokeWidth="2"/>
        <text x="35" y="44" textAnchor="middle" fontSize="22" fontWeight="900" fill="#f0c040">$</text>
      </svg>
    }/>
  );
}

export function EscrowMasterBadge({ size=120 }:{ size?:number }) {
  return (
    <BadgeTemplate label="ESCROW MASTER" size={size} icon={
      <svg width="70" height="70" viewBox="0 0 70 70">
        {[0,1,2].map(i=>(
          <g key={i} transform={`translate(${i*18},${i===1?0:8})`}>
            <ellipse cx="16" cy="38" rx="13" ry="12" fill="#2eb82e" stroke="#f0c040" strokeWidth="1.5"/>
            <text x="16" y="43" textAnchor="middle" fontSize="13" fontWeight="900" fill="#f0c040">$</text>
          </g>
        ))}
      </svg>
    }/>
  );
}

export function YearVerifiedBadge({ size=120 }:{ size?:number }) {
  return (
    <BadgeTemplate label="1 YEAR VERIFIED" size={size} color="green" icon={
      <svg width="70" height="70" viewBox="0 0 70 70">
        <text x="35" y="48" textAnchor="middle" fontSize="44" fontWeight="900"
          fill="#f0c040" fontFamily="Arial,sans-serif">1</text>
      </svg>
    }/>
  );
}

export function TopTrustScoreBadge({ size=120 }:{ size?:number }) {
  return (
    <BadgeTemplate label="TOP TRUST SCORE" size={size} icon={
      <svg width="70" height="70" viewBox="0 0 70 70">
        <polygon points="35,4 42,24 63,24 47,37 53,57 35,44 17,57 23,37 7,24 28,24"
          fill="#f0c040" stroke="#c9a227" strokeWidth="1"/>
      </svg>
    }/>
  );
}

/* ── Veritas Network Logo Emblem ── */
export function VeritasEmblem({ size=80 }:{ size?:number }) {
  return (
    <svg width={size} height={Math.round(size*0.95)} viewBox="0 0 200 190" fill="none" style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="emg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0c040"/><stop offset="50%" stopColor="#c9a227"/><stop offset="100%" stopColor="#7a5c00"/>
        </linearGradient>
        <radialGradient id="emb1" cx="50%" cy="35%">
          <stop offset="0%" stopColor="#1a4acc"/><stop offset="100%" stopColor="#08155a"/>
        </radialGradient>
        <filter id="emglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Outer ornate gold shield */}
      <path d="M100 4 Q130 4 158 10 Q182 18 188 36 L188 100 Q188 155 100 183 Q12 155 12 100 L12 36 Q18 18 42 10 Q70 4 100 4 Z"
        fill="url(#emg1)" filter="url(#emglow)"/>

      {/* Inner blue field */}
      <path d="M100 14 Q128 14 152 20 Q172 26 177 40 L177 100 Q177 148 100 172 Q23 148 23 100 L23 40 Q28 26 48 20 Q72 14 100 14 Z"
        fill="url(#emb1)"/>

      {/* Blue radial shine */}
      <ellipse cx="100" cy="80" rx="55" ry="45" fill="rgba(40,100,255,0.12)"/>

      {/* Gold scroll/pillar left */}
      <rect x="22" y="25" width="10" height="70" rx="5" fill="url(#emg1)" opacity="0.9"/>
      <ellipse cx="27" cy="22" rx="9" ry="6" fill="url(#emg1)"/>
      <ellipse cx="27" cy="97" rx="9" ry="6" fill="url(#emg1)"/>
      {/* Pillar fluting */}
      {[0,1,2].map(i=><rect key={i} x={24+i*2.5} y="28" width="1.5" height="65" rx="0.5" fill="rgba(255,255,255,0.15)"/>)}

      {/* Gold scroll/pillar right */}
      <rect x="168" y="25" width="10" height="70" rx="5" fill="url(#emg1)" opacity="0.9"/>
      <ellipse cx="173" cy="22" rx="9" ry="6" fill="url(#emg1)"/>
      <ellipse cx="173" cy="97" rx="9" ry="6" fill="url(#emg1)"/>
      {[0,1,2].map(i=><rect key={i} x={170+i*2.5} y="28" width="1.5" height="65" rx="0.5" fill="rgba(255,255,255,0.15)"/>)}

      {/* Gold scroll ornament top */}
      <path d="M70 18 Q100 8 130 18" stroke="url(#emg1)" strokeWidth="3" fill="none"/>
      <circle cx="100" cy="8" r="5" fill="url(#emg1)"/>
      {/* Scroll flourishes */}
      <path d="M50 30 Q45 20 55 18" stroke="url(#emg1)" strokeWidth="2" fill="none"/>
      <path d="M150 30 Q155 20 145 18" stroke="url(#emg1)" strokeWidth="2" fill="none"/>

      {/* "Veritas" script text */}
      <text x="100" y="72" textAnchor="middle" fontSize="24" fontWeight="700"
        fill="url(#emg1)" fontFamily="Georgia,serif" fontStyle="italic" letterSpacing="1">Veritas</text>

      {/* Large "V" */}
      <text x="100" y="125" textAnchor="middle" fontSize="56" fontWeight="900"
        fill="url(#emg1)" fontFamily="Georgia,serif" letterSpacing="-2">V</text>

      {/* "Network" script text */}
      <text x="100" y="155" textAnchor="middle" fontSize="18" fontWeight="600"
        fill="url(#emg1)" fontFamily="Georgia,serif" fontStyle="italic" letterSpacing="2">Network</text>

      {/* Bottom scroll ornament */}
      <path d="M60 168 Q100 178 140 168" stroke="url(#emg1)" strokeWidth="2" fill="none"/>
    </svg>
  );
}

/* ── Badge Display Grid ── */
export const ALL_BADGES = [
  { id:"verified",      component: VeritasVerifiedBadge, label:"Veritas Verified",  desc:"Core platform verification",           earned:true  },
  { id:"new_member",    component: NewMemberBadge,       label:"New Member",        desc:"Joined the Veritas Network",           earned:true  },
  { id:"jobs_50",       component: Jobs50Badge,          label:"50 Jobs Done",      desc:"Completed 50 jobs successfully",       earned:true  },
  { id:"jobs_100",      component: Jobs100Badge,         label:"100 Jobs Done",     desc:"Completed 100 jobs with 100% rate",    earned:false },
  { id:"first_escrow",  component: FirstEscrowBadge,    label:"First Escrow",      desc:"First escrow contract completed",      earned:true  },
  { id:"escrow_master", component: EscrowMasterBadge,   label:"Escrow Master",     desc:"50+ escrow contracts completed",       earned:false },
  { id:"year_verified", component: YearVerifiedBadge,   label:"1 Year Verified",   desc:"Verified member for 1+ years",         earned:true  },
  { id:"top_trust",     component: TopTrustScoreBadge,  label:"Top Trust Score",   desc:"Achieved Top 10% Trust Score",         earned:false },
];

export default function BadgeGrid({ earned=false }:{ earned?:boolean }) {
  const badges = earned ? ALL_BADGES.filter(b=>b.earned) : ALL_BADGES;
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:20,alignItems:"center"}}>
      {badges.map(b=>{
        const Comp = b.component;
        return (
          <div key={b.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:b.earned?1:0.4}}>
            <Comp size={100}/>
            <div style={{fontSize:"0.65rem",fontWeight:700,color:b.earned?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)",
              textAlign:"center",maxWidth:90,letterSpacing:"0.03em"}}>{b.label}</div>
          </div>
        );
      })}
    </div>
  );
}
