"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Users, CheckCircle, Star, ArrowRight, Globe, Zap, Award } from "lucide-react";

const NETWORK_NODES = [
  {x:15,y:20},{x:35,y:8},{x:55,y:15},{x:75,y:10},{x:90,y:25},
  {x:10,y:45},{x:28,y:38},{x:50,y:35},{x:70,y:30},{x:85,y:48},
  {x:20,y:65},{x:42,y:58},{x:62,y:62},{x:80,y:68},{x:95,y:55},
  {x:8,y:80},{x:30,y:78},{x:55,y:85},{x:72,y:82},{x:88,y:78},
];

const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,7],[3,8],[4,9],
  [5,6],[6,7],[7,8],[8,9],[5,10],[6,11],[7,12],[8,13],[9,14],
  [10,11],[11,12],[12,13],[13,14],[10,15],[11,16],[12,17],[13,18],[14,19],
  [15,16],[16,17],[17,18],[18,19],
];

export default function HomePage() {
  const router = useRouter();
  const [pulse, setPulse] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setPulse(p => (p + 1) % NETWORK_NODES.length), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#030d1e", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, background: "rgba(3,13,30,0.97)", backdropFilter: "blur(20px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Shield logo */}
          <svg width={44} height={50} viewBox="0 0 44 50">
            <defs>
              <linearGradient id="nav-gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5D97A"/><stop offset="100%" stopColor="#8B6914"/></linearGradient>
              <linearGradient id="nav-blue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1a4a9e"/><stop offset="100%" stopColor="#0d2d6b"/></linearGradient>
            </defs>
            <path d="M22 2 L42 10 L42 30 Q42 44 22 50 Q2 44 2 30 L2 10 Z" fill="url(#nav-gold)"/>
            <path d="M22 7 L37 13 L37 30 Q37 41 22 46 Q7 41 7 30 L7 13 Z" fill="url(#nav-blue)"/>
            <polyline points="13,26 19,33 31,18" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <line x1="26" y1="12" x2="32" y2="8" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="33" cy="7" r="3" fill="none" stroke="#C0C0C0" strokeWidth="1.5"/>
          </svg>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, letterSpacing: "0.15em", color: "white" }}>VERITAS</div>
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.25em", color: "#4da6ff", textTransform: "uppercase", marginTop: -2 }}>TRUTH BECOMES TRUST</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {["How It Works","Pricing","For Workers","Enterprise"].map(l => (
            <span key={l} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLSpanElement).style.color = "white"}
              onMouseLeave={e => (e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.65)"}>{l}</span>
          ))}
          <button onClick={() => router.push("/login")} style={{ padding: "8px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, color: "white", fontSize: "0.82rem", cursor: "pointer" }}>Sign In</button>
          <button onClick={() => router.push("/signup")} style={{ padding: "9px 22px", background: "linear-gradient(135deg,#1a6bff,#0040cc)", border: "none", borderRadius: 6, color: "white", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(26,107,255,0.4)" }}>Get Verified Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: 480, display: "flex", alignItems: "center", overflow: "hidden", padding: "60px 48px" }}>

        {/* Network map background */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {CONNECTIONS.map(([a,b],i) => (
            <line key={i} x1={NETWORK_NODES[a].x} y1={NETWORK_NODES[a].y} x2={NETWORK_NODES[b].x} y2={NETWORK_NODES[b].y}
              stroke="#4da6ff" strokeWidth="0.15" opacity="0.5"/>
          ))}
          {NETWORK_NODES.map((n,i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={i===pulse?0.8:0.4} fill="#4da6ff" opacity={i===pulse?1:0.5}/>
              {i===pulse && <circle cx={n.x} cy={n.y} r={2} fill="none" stroke="#4da6ff" strokeWidth="0.2" opacity="0.4"/>}
            </g>
          ))}
        </svg>

        {/* Blue radial glow */}
        <div style={{ position: "absolute", right: "25%", top: "50%", transform: "translateY(-50%)", width: 400, height: 400, background: "radial-gradient(circle,rgba(26,107,255,0.2) 0%,transparent 70%)", pointerEvents: "none" }}/>

        {/* Left content */}
        <div style={{ position: "relative", zIndex: 2, flex: 1, maxWidth: 600 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(26,107,255,0.15)", border: "1px solid rgba(26,107,255,0.35)", borderRadius: 20, fontSize: "0.72rem", color: "#4da6ff", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            🛡️ Blockchain-Verified Trust Platform
          </div>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 900, lineHeight: 1.1, marginBottom: 12, letterSpacing: "-0.02em" }}>
            PORTABLE TRUTH BADGES<br/>
            <span style={{ color: "#4da6ff" }}>FOR GIG WORKERS</span>
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 28, maxWidth: 500 }}>
            One verified badge follows you everywhere. Clients see your real Trust Score — blockchain-verified, impossible to fake.
          </p>

          {/* 4 trust pillars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { ic: <Shield size={16}/>, t: "VERIFIED WORKERS" },
              { ic: <Lock size={16}/>, t: "ESCROW PROTECTION" },
              { ic: <Users size={16}/>, t: "SAFER HIRING" },
              { ic: <Globe size={16}/>, t: "PROTECTED EVERYWHERE" },
            ].map((p,i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>
                <div style={{ color: "#4da6ff" }}>{p.ic}</div>
                <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em", textAlign: "center", color: "rgba(255,255,255,0.8)" }}>{p.t}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <button onClick={() => router.push("/signup")} style={{ padding: "14px 32px", background: "linear-gradient(135deg,#1a6bff,#0040cc)", border: "none", borderRadius: 8, color: "white", fontSize: "1rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 24px rgba(26,107,255,0.45)", display: "flex", alignItems: "center", gap: 8 }}>
              Get Verified Free <ArrowRight size={18}/>
            </button>
            <button onClick={() => router.push("/how-matching-works")} style={{ padding: "14px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, color: "white", fontSize: "0.9rem", cursor: "pointer" }}>
              See How It Works
            </button>
          </div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>ONE BADGE. ANY JOB. EVERYWHERE.</div>
        </div>

        {/* Right — Hero Badge */}
        <div style={{ position: "relative", zIndex: 2, flexShrink: 0, marginLeft: 60 }}>
          <div style={{ position: "relative", width: 260, height: 300 }}>
            {/* Glow ring */}
            <div style={{ position: "absolute", inset: -20, background: "radial-gradient(circle,rgba(212,175,55,0.25) 0%,transparent 70%)", borderRadius: "50%" }}/>
            {/* Badge SVG */}
            <HeroBadge score={845}/>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(26,107,255,0.3),transparent)", margin: "0 48px" }}/>

      {/* ── HOW VERITAS PROTECTS ── */}
      <section style={{ padding: "64px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

          {/* Left — 4 steps */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 36 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textAlign: "center", marginBottom: 32, letterSpacing: "0.04em" }}>HOW VERITAS PROTECTS EVERYONE</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {[
                { n:"1", t:"WORKER VERIFIED", d:"Identity, skills, and background verified.", ic:"👤" },
                { n:"2", t:"BADGE EARNED", d:"Portable truth badge earned and secured.", ic:"🛡️" },
                { n:"3", t:"CUSTOMER PROTECTED", d:"Customers see verified trust before they hire.", ic:"👥" },
                { n:"4", t:"ESCROW RELEASED", d:"Job completed. Escrow released safely.", ic:"🔓" },
              ].map((s,i) => (
                <div key={i} style={{ textAlign: "center", padding: "20px 12px", background: "rgba(26,107,255,0.05)", border: "1px solid rgba(26,107,255,0.12)", borderRadius: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(26,107,255,0.15)", border: "2px solid #1a6bff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: "1.3rem" }}>{s.ic}</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#4da6ff", letterSpacing: "0.06em", marginBottom: 4 }}>{s.n}. {s.t}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.d}</div>
                </div>
              ))}
            </div>
            {/* Bottom badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, borderTop: "1px solid rgba(26,107,255,0.1)", paddingTop: 16 }}>
              {[{ic:<Shield size={14}/>,t:"VERIFICATION"},{ic:<Lock size={14}/>,t:"ESCROW"},{ic:<CheckCircle size={14}/>,t:"INSURANCE"},{ic:<Users size={14}/>,t:"DISPUTE PROTECTION"}].map((b,i)=>(
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontSize:"0.58rem", fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:"0.05em", textAlign:"center" }}>
                  <div style={{ color:"#4da6ff" }}>{b.ic}</div>{b.t}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: "0.65rem", color: "#4da6ff", letterSpacing: "0.15em", marginTop: 12, fontWeight: 700 }}>TRUST. TRANSPARENCY. PROTECTION.</div>
          </div>

          {/* Right — Worker profile card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <svg width={28} height={32} viewBox="0 0 44 50">
                <path d="M22 2 L42 10 L42 30 Q42 44 22 50 Q2 44 2 30 L2 10 Z" fill="#D4AF37"/>
                <path d="M22 7 L37 13 L37 30 Q37 41 22 46 Q7 41 7 30 L7 13 Z" fill="#1a4a9e"/>
                <polyline points="13,26 19,33 31,18" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.08em" }}>VERITAS</div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>TRUST YOU CAN SEE. CONFIDENCE YOU CAN FEEL.</div>
              </div>
            </div>

            {/* Worker card */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, background: "linear-gradient(135deg,#2a4a8a,#1a2d5a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>👷</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
                    James Wilson
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#1a6bff", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={11} color="white"/></div>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>Plumbing Specialist</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}>📍 Austin, TX</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4, padding: "2px 9px", background: "rgba(26,107,255,0.1)", border: "1px solid rgba(26,107,255,0.25)", borderRadius: 10, fontSize: "0.62rem", color: "#4da6ff", fontWeight: 700 }}>
                    <Shield size={10}/> VERITAS VERIFIED
                  </div>
                </div>
                {/* Mini badge */}
                <MiniHeroBadge score={845}/>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                {[["TRUST SCORE","845","#00e676","Excellent"],["JOBS COMPLETED","247","white","100% Success Rate"],["MEMBER SINCE","1 Year","white","Verified"]].map(([l,v,c,s],i)=>(
                  <div key={i} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"0.58rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.06em", marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:"1.4rem", fontWeight:900, color:c, lineHeight:1 }}>{v}</div>
                    <div style={{ fontSize:"0.6rem", color:c==="#00e676"?c:"rgba(255,255,255,0.45)", marginTop:1 }}>{s}</div>
                  </div>
                ))}
              </div>

              {/* Verification badges */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, padding:"12px 0", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:14 }}>
                {[["🪪","IDENTITY VERIFIED","ID & Background Check"],["⚙️","SKILLS VERIFIED","Certifications Verified"],["🛡️","INSURED","$1M Coverage"],["🔒","ESCROW PROTECTED","Payments Secured"]].map(([ic,t,s],i)=>(
                  <div key={i} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"1rem", marginBottom:2 }}>{ic}</div>
                    <div style={{ fontSize:"0.55rem", fontWeight:700, color:"#4da6ff", lineHeight:1.3 }}>{t}</div>
                    <div style={{ fontSize:"0.5rem", color:"rgba(255,255,255,0.35)", marginTop:1 }}>{s}</div>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div>
                <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", marginBottom:4 }}>CUSTOMER REVIEWS</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <span style={{ fontSize:"1.1rem", fontWeight:900, color:"white" }}>5.0</span>
                  <span style={{ color:"#f0c040", fontSize:"0.9rem" }}>★★★★★</span>
                  <span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.4)" }}>(128)</span>
                </div>
                <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", fontStyle:"italic" }}>"Excellent work, on time and very professional."</div>
              </div>
            </div>

            {/* Mobile booking preview */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:16, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:90, background:"rgba(3,13,30,0.8)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"10px 8px", flexShrink:0 }}>
                <div style={{ height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, width:40, margin:"0 auto 8px" }}/>
                <div style={{ fontSize:"0.52rem", fontWeight:700, color:"white", textAlign:"center", marginBottom:6 }}>Book with Confidence</div>
                <div style={{ fontSize:"0.42rem", color:"#4da6ff", textAlign:"center", fontWeight:700, marginBottom:8 }}>VERITAS VERIFIED WORKER</div>
                {[["Trust Score","845","#00e676"],["Escrow Protection","Active","#00e676"],["Insurance","$1,000,000","white"],["Dispute Protection","Included","#4da6ff"]].map(([l,v,c],i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:"0.4rem" }}>
                    <span style={{ color:"rgba(255,255,255,0.5)" }}>{l}</span>
                    <span style={{ color:c, fontWeight:700 }}>{v}</span>
                  </div>
                ))}
                <button style={{ width:"100%", marginTop:8, padding:"6px 0", background:"#1a6bff", border:"none", borderRadius:6, color:"white", fontSize:"0.48rem", fontWeight:800, cursor:"pointer" }}>🔒 Book Now Securely</button>
                <div style={{ fontSize:"0.38rem", color:"rgba(255,255,255,0.3)", textAlign:"center", marginTop:4 }}>You're protected with Veritas</div>
              </div>
              <div>
                <div style={{ fontSize:"0.8rem", fontWeight:700, marginBottom:4 }}>Book Securely on Mobile</div>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>Every job protected by Veritas escrow. Funds release only when you approve.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding:"48px 48px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
          {[["12,847","Verified Professionals","#4da6ff"],["$42.1M","Total Paid Out","#00e676"],["99.2%","Dispute Resolution","#00e676"],["94","Countries Active","#f0c040"]].map(([v,l,c],i)=>(
            <div key={i} style={{ textAlign:"center", padding:"24px 20px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14 }}>
              <div style={{ fontSize:"2.4rem", fontWeight:900, color:c, lineHeight:1, marginBottom:6 }}>{v}</div>
              <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.5)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"24px 48px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.3)" }}>© 2026 Veritas Network · Truth Becomes Trust</div>
        <button onClick={()=>router.push("/signup")} style={{ padding:"10px 24px", background:"linear-gradient(135deg,#1a6bff,#0040cc)", border:"none", borderRadius:8, color:"white", fontSize:"0.85rem", fontWeight:700, cursor:"pointer" }}>
          Get Verified Free →
        </button>
      </footer>
    </div>
  );
}

// Hero badge component
function HeroBadge({ score }: { score: number }) {
  return (
    <svg width={250} height={290} viewBox="0 0 250 290" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hb-gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5D97A"/><stop offset="50%" stopColor="#D4AF37"/><stop offset="100%" stopColor="#8B6914"/></linearGradient>
        <linearGradient id="hb-blue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1a4a9e"/><stop offset="100%" stopColor="#0d2d6b"/></linearGradient>
        <linearGradient id="hb-green" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4dcc6a"/><stop offset="100%" stopColor="#1a7a3a"/></linearGradient>
        <linearGradient id="hb-ribbon" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#3dba5e"/><stop offset="100%" stopColor="#1a6b30"/></linearGradient>
        <radialGradient id="hb-glow" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#3a6acc" stopOpacity="0.5"/><stop offset="100%" stopColor="#0d2d6b" stopOpacity="0"/></radialGradient>
      </defs>

      {/* Outer laurel leaves - left */}
      {Array.from({length:10},(_,i)=>{
        const t=i/9; const angle=(-0.1+t*1.1)*Math.PI; const r=115;
        const lx=125-r*Math.cos(angle)*0.85; const ly=140+r*Math.sin(angle)*0.6;
        return <ellipse key={`ll${i}`} cx={lx} cy={ly} rx={14} ry={6} fill={i%2===0?"#D4AF37":"#8B6914"} opacity={0.9} transform={`rotate(${angle*180/Math.PI-90},${lx},${ly})`}/>
      })}
      {/* Right */}
      {Array.from({length:10},(_,i)=>{
        const t=i/9; const angle=(0.1-t*1.1)*Math.PI+Math.PI; const r=115;
        const lx=125+r*Math.cos(angle-Math.PI)*0.85; const ly=140+r*Math.sin(angle)*0.6;
        return <ellipse key={`lr${i}`} cx={lx} cy={ly} rx={14} ry={6} fill={i%2===0?"#D4AF37":"#8B6914"} opacity={0.9} transform={`rotate(${(angle-Math.PI)*180/Math.PI+90},${lx},${ly})`}/>
      })}

      {/* Main shield */}
      <path d="M125 18 L222 55 L222 155 Q222 230 125 270 Q28 230 28 155 L28 55 Z" fill="url(#hb-gold)"/>
      <path d="M125 30 L210 63 L210 155 Q210 220 125 258 Q40 220 40 155 L40 63 Z" fill="url(#hb-blue)"/>
      <path d="M125 30 L210 63 L210 155 Q210 220 125 258 Q40 220 40 155 L40 63 Z" fill="url(#hb-glow)"/>

      {/* Stars */}
      {[0.28,0.5,0.72].map((x,i)=><text key={i} x={250*x} y={82} textAnchor="middle" fontSize={14} fill="#D4AF37" opacity={0.8}>★</text>)}

      {/* VERITAS text */}
      <text x={125} y={100} textAnchor="middle" fontSize={22} fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif" letterSpacing="3">VERITAS</text>
      <text x={125} y={120} textAnchor="middle" fontSize={16} fontWeight="900" fill="white" fontFamily="Arial,sans-serif" letterSpacing="2">VERIFIED</text>

      {/* Green circle + checkmark */}
      <circle cx={125} cy={158} r={38} fill="url(#hb-green)" stroke="#D4AF37" strokeWidth={3}/>
      <circle cx={125} cy={158} r={38} fill="url(#hb-glow)"/>
      <polyline points="107,158 120,172 145,140" stroke="#D4AF37" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none"/>

      {/* TRUST SCORE ribbon */}
      <polygon points="30,200 30,218 220,218 220,200 220,200" fill="none"/>
      <rect x={28} y={200} width={194} height={22} rx={5} fill="url(#hb-ribbon)"/>
      <polygon points="28,200 12,209 28,222" fill="#1a5c28"/>
      <polygon points="222,200 238,209 222,222" fill="#1a5c28"/>
      <text x={125} y={216} textAnchor="middle" fontSize={13} fontWeight="900" fill="white" fontFamily="Arial,sans-serif" letterSpacing="2">TRUST SCORE</text>

      {/* Score number */}
      <text x={125} y={258} textAnchor="middle" fontSize={36} fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif" stroke="#8B6914" strokeWidth={1.5}>{score}</text>
    </svg>
  );
}

function MiniHeroBadge({ score }: { score: number }) {
  return (
    <svg width={70} height={82} viewBox="0 0 250 290" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5D97A"/><stop offset="100%" stopColor="#8B6914"/></linearGradient>
        <linearGradient id="mb-blue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1a4a9e"/><stop offset="100%" stopColor="#0d2d6b"/></linearGradient>
        <linearGradient id="mb-green" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4dcc6a"/><stop offset="100%" stopColor="#1a7a3a"/></linearGradient>
      </defs>
      {Array.from({length:8},(_,i)=>{const t=i/7;const angle=(-0.1+t*1.1)*Math.PI;const r=105;const lx=125-r*Math.cos(angle)*0.85;const ly=140+r*Math.sin(angle)*0.6;return<ellipse key={i} cx={lx} cy={ly} rx={12} ry={5} fill="#D4AF37" opacity={0.8} transform={`rotate(${angle*180/Math.PI-90},${lx},${ly})`}/>})}
      {Array.from({length:8},(_,i)=>{const t=i/7;const angle=(0.1-t*1.1)*Math.PI+Math.PI;const r=105;const lx=125+r*Math.cos(angle-Math.PI)*0.85;const ly=140+r*Math.sin(angle)*0.6;return<ellipse key={i} cx={lx} cy={ly} rx={12} ry={5} fill="#D4AF37" opacity={0.8} transform={`rotate(${(angle-Math.PI)*180/Math.PI+90},${lx},${ly})`}/>})}
      <path d="M125 18 L222 55 L222 155 Q222 230 125 270 Q28 230 28 155 L28 55 Z" fill="url(#mb-gold)"/>
      <path d="M125 30 L210 63 L210 155 Q210 220 125 258 Q40 220 40 155 L40 63 Z" fill="url(#mb-blue)"/>
      <text x={125} y={105} textAnchor="middle" fontSize={18} fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif" letterSpacing="2">VERITAS</text>
      <text x={125} y={122} textAnchor="middle" fontSize={13} fontWeight="900" fill="white" fontFamily="Arial,sans-serif">VERIFIED</text>
      <circle cx={125} cy={158} r={36} fill="url(#mb-green)" stroke="#D4AF37" strokeWidth={3}/>
      <polyline points="108,158 120,172 144,140" stroke="#D4AF37" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x={35} y={200} width={180} height={20} rx={4} fill="#2eb850"/>
      <text x={125} y={215} textAnchor="middle" fontSize={11} fontWeight="900" fill="white" fontFamily="Arial,sans-serif" letterSpacing="1">TRUST SCORE</text>
      <text x={125} y={252} textAnchor="middle" fontSize={32} fontWeight="900" fill="#D4AF37" fontFamily="Arial,sans-serif">{score}</text>
    </svg>
  );
}
