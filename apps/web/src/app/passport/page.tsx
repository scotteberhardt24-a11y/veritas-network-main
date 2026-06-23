
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Shield, Star, Briefcase, Copy, CheckCheck, Globe, MapPin, CheckCircle2 } from "lucide-react";
import {
  VeritasVerifiedBadge, NewMemberBadge, Jobs50Badge, Jobs100Badge,
  FirstEscrowBadge, EscrowMasterBadge, YearVerifiedBadge, TopTrustScoreBadge,
  VeritasEmblem, ALL_BADGES,
} from "@/components/badges/VeritasBadges";

const SKILLS = [
  {name:"Next.js",level:99},{name:"TypeScript",level:96},{name:"PostgreSQL",level:91},
  {name:"Solidity",level:84},{name:"React",level:98},{name:"Node.js",level:93},
];

const REVIEWS = [
  {author:"Brian Walsh",company:"TechVentures Inc.",rating:5,date:"Jun 2026",text:"Exceptional work, delivered a week ahead of schedule. Communication was top-notch throughout. Will absolutely hire again."},
  {author:"Amy Chen",company:"GreenLeaf Studios",rating:5,date:"May 2026",text:"Best developer I've worked with on this platform. Understood our vision immediately and delivered beyond expectations."},
  {author:"David Price",company:"FinEdge Capital",rating:5,date:"Apr 2026",text:"Incredibly detail-oriented. The technical architecture was flawless."},
];

export default function PassportPage() {
  const [tab, setTab]     = useState("badges");
  const [copied, setCopied] = useState(false);
  const profileUrl = "https://veritas.network/u/scotteberhardt";

  function copyLink(){ navigator.clipboard.writeText(profileUrl); setCopied(true); setTimeout(()=>setCopied(false),2000); }

  const earned = ALL_BADGES.filter(b=>b.earned);
  const locked = ALL_BADGES.filter(b=>!b.earned);

  const BadgeComponents: Record<string, React.ComponentType<{size?:number}>> = {
    verified: VeritasVerifiedBadge, new_member: NewMemberBadge, jobs_50: Jobs50Badge,
    jobs_100: Jobs100Badge, first_escrow: FirstEscrowBadge, escrow_master: EscrowMasterBadge,
    year_verified: YearVerifiedBadge, top_trust: TopTrustScoreBadge,
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,padding:"24px",overflowY:"auto",color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <VeritasEmblem size={44}/>
              <div>
                <h1 style={{fontSize:"1.8rem",fontWeight:900,color:"white",margin:0}}>Trust Passport</h1>
                <div style={{fontSize:"0.65rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={copyLink} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",fontSize:"0.8rem",cursor:"pointer",fontWeight:600}}>
                {copied?<CheckCheck size={15}/>:<Copy size={15}/>} {copied?"Copied!":"Copy Link"}
              </button>
              <a href={profileUrl} target="_blank" style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontSize:"0.8rem",cursor:"pointer",fontWeight:700,textDecoration:"none"}}>
                <Globe size={15}/> View Public
              </a>
            </div>
          </div>

          {/* Profile Hero Card */}
          <div style={{background:"linear-gradient(135deg,rgba(2,13,31,0.99),rgba(4,18,42,0.98))",border:"1px solid rgba(26,107,255,0.22)",borderRadius:20,overflow:"hidden",marginBottom:24}}>
            <div style={{height:5,background:"linear-gradient(90deg,#1a6bff,#0033aa,#1a6bff)"}}/>
            <div style={{padding:"24px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:24,flexWrap:"wrap"}}>
                {/* Avatar + Score Ring */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <div style={{position:"relative"}}>
                    <div style={{width:90,height:90,borderRadius:16,border:"3px solid rgba(26,107,255,0.4)",background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.8rem"}}>👷</div>
                    <div style={{position:"absolute",-bottom:4,-right:-4,width:22,height:22,borderRadius:"50%",background:"#1a6bff",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #010812"}}>
                      <CheckCircle2 size={13} color="white" fill="white"/>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:"1.7rem",fontWeight:900}}>Scott Eberhardt</span>
                    <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 12px 3px 8px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:20,fontSize:"0.62rem",fontWeight:800,color:"#4da6ff",letterSpacing:"0.07em"}}>
                      <Shield size={10}/> VERITAS VERIFIED
                    </div>
                  </div>
                  <div style={{color:"rgba(255,255,255,0.55)",marginBottom:4}}>Full-Stack Developer & Web3 Builder</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:14}}>
                    <MapPin size={13}/> Seattle, WA · Member since Jan 2025
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,auto)",gap:12}}>
                    {[["94","Jobs Done"],["99%","On-Time"],["71%","Repeat Rate"],["5.0★","Avg Rating"]].map(([v,l],i)=>(
                      <div key={i} style={{textAlign:"center",padding:"10px 14px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:10}}>
                        <div style={{fontSize:"1.2rem",fontWeight:900,color:"#00e676",lineHeight:1}}>{v}</div>
                        <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.4)",marginTop:3,letterSpacing:"0.05em"}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Badge */}
                <div style={{flexShrink:0}}>
                  <VeritasVerifiedBadge score={845} size={170}/>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {[["badges","🏅 Badges"],["skills","⚡ Skills"],["reviews","★ Reviews"],["history","📋 History"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",
                background:"transparent",cursor:"pointer",
                color: tab===t ? "#4da6ff" : "rgba(255,255,255,0.4)",
                borderBottom: tab===t ? "2px solid #1a6bff" : "2px solid transparent",
                marginBottom:-1, transition:"all 0.15s",
              }}>{l}</button>
            ))}
          </div>

          {/* BADGES TAB */}
          {tab==="badges" && (
            <div>
              <h3 style={{fontWeight:800,marginBottom:16,color:"rgba(255,255,255,0.7)",fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Earned Badges ({earned.length})</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:28}}>
                {earned.map(b=>{
                  const Comp = BadgeComponents[b.id];
                  return(
                    <div key={b.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                      <Comp size={110}/>
                      <div style={{fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.7)",textAlign:"center",maxWidth:100}}>{b.label}</div>
                      <div style={{fontSize:"0.55rem",color:"rgba(255,255,255,0.35)",textAlign:"center",maxWidth:100}}>{b.desc}</div>
                    </div>
                  );
                })}
              </div>
              {locked.length>0&&(
                <>
                  <h3 style={{fontWeight:800,marginBottom:16,color:"rgba(255,255,255,0.35)",fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Locked ({locked.length})</h3>
                  <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
                    {locked.map(b=>{
                      const Comp = BadgeComponents[b.id];
                      return(
                        <div key={b.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.35,filter:"grayscale(0.6)"}}>
                          <Comp size={110}/>
                          <div style={{fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.5)",textAlign:"center",maxWidth:100}}>{b.label}</div>
                          <div style={{fontSize:"0.55rem",color:"rgba(255,255,255,0.25)",textAlign:"center",maxWidth:100}}>{b.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* SKILLS TAB */}
          {tab==="skills" && (
            <div style={{maxWidth:480}}>
              {SKILLS.map(s=>(
                <div key={s.name} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:"0.9rem"}}>
                    <span style={{fontWeight:600}}>{s.name}</span>
                    <span style={{color:"#f0c040",fontWeight:800}}>{s.level}/100</span>
                  </div>
                  <div style={{height:8,borderRadius:4,background:"rgba(26,107,255,0.1)",overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#1a6bff,#00d4ff)",width:`${s.level}%`,transition:"width 0.8s ease"}}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS TAB */}
          {tab==="reviews" && (
            <div style={{maxWidth:640,display:"flex",flexDirection:"column",gap:14}}>
              {REVIEWS.map((r,i)=>(
                <div key={i} style={{background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:700}}>{r.author}</div>
                      <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>{r.company} · {r.date}</div>
                    </div>
                    <div style={{color:"#ffd700",fontSize:"0.9rem"}}>{"★".repeat(r.rating)}</div>
                  </div>
                  <p style={{fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",fontStyle:"italic",lineHeight:1.6}}>"{r.text}"</p>
                </div>
              ))}
            </div>
          )}

          {/* HISTORY TAB */}
          {tab==="history" && (
            <div style={{maxWidth:600,background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:14,overflow:"hidden"}}>
              {[
                {t:"SaaS Dashboard Build",c:"TechVentures",a:"$10,000",d:"Jun 2026",r:5},
                {t:"Brand Identity Design",c:"GreenLeaf",a:"$4,500",d:"May 2026",r:5},
                {t:"Content Strategy Q2",c:"FinEdge",a:"$2,800",d:"Apr 2026",r:5},
                {t:"React Native App",c:"Bloom Health",a:"$18,000",d:"Mar 2026",r:5},
                {t:"SEO Blog Series",c:"RetailBoost",a:"$2,200",d:"Feb 2026",r:4},
              ].map((j,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid rgba(26,107,255,0.08)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Briefcase size={16} color="#1a6bff"/>
                    <div>
                      <div style={{fontWeight:600,fontSize:"0.88rem"}}>{j.t}</div>
                      <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{j.c} · {j.d}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:800,color:"#00e676",fontSize:"0.9rem"}}>{j.a}</div>
                    <div style={{color:"#ffd700",fontSize:"0.72rem"}}>{"★".repeat(j.r)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
