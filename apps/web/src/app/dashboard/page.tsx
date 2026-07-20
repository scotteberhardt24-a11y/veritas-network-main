"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { useAuth } from "@/context/AuthContext";
import { VeritasVerifiedBadge, NewMemberBadge } from "@/components/badges/VeritasBadges";
import { Shield, Briefcase, DollarSign, TrendingUp, Clock, ChevronRight, Bell, Star, Lock, CheckCircle, Zap, ArrowRight, Users } from "lucide-react";

const JOBS = [
  { id:1, title:"Full-Stack SaaS Dashboard", client:"TechVentures Inc.", budget:"$10,000", status:"active",  match:99, due:"Jul 20" },
  { id:2, title:"Brand Identity Design",     client:"GreenLeaf Studio", budget:"$4,500",  status:"pending", match:96, due:"Jul 28" },
  { id:3, title:"AI Chatbot Integration",    client:"CloudSync AI",     budget:"$8,200",  status:"active",  match:94, due:"Aug 5"  },
];

const ACTIVITY = [
  { ic:"💰", t:"Escrow released — TechVentures",  sub:"$3,500 sent to wallet",  time:"2h ago",  c:"#00e676" },
  { ic:"⭐", t:"5-star review received",           sub:"From Brian Walsh",        time:"5h ago",  c:"#f0c040" },
  { ic:"🤝", t:"New job match — 99% score",        sub:"React/Node.js project",   time:"1d ago",  c:"#4da6ff" },
  { ic:"🛡️", t:"Trust Score increased +3",         sub:"Now at 845",              time:"2d ago",  c:"#00e676" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const trustScore = user?.trustScore || 845;
  const tier = trustScore >= 950 ? "ELITE" : trustScore >= 850 ? "EXPERT" : trustScore >= 700 ? "PRO" : "VERIFIED";
  const tierColor = trustScore >= 950 ? "#f0c040" : trustScore >= 850 ? "#4da6ff" : trustScore >= 700 ? "#a78bfa" : "#00e676";
  const nextMilestone = trustScore >= 950 ? 1000 : trustScore >= 850 ? 950 : trustScore >= 700 ? 850 : 700;
  const progress = ((trustScore - (nextMilestone - 150)) / 150) * 100;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#030d1e" }}>
      <Sidebar/>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <TopBar/>
        <main style={{ flex:1, overflowY:"auto", padding:24, color:"white" }}>

          {/* ── HERO WELCOME BANNER ── */}
          <div style={{ position:"relative", background:"linear-gradient(135deg,rgba(10,25,55,0.98),rgba(5,15,35,0.96))", border:"1px solid rgba(26,107,255,0.2)", borderRadius:20, padding:28, marginBottom:20, overflow:"hidden", opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(16px)", transition:"all 0.6s ease" }}>
            {/* Network dot bg */}
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.15) 1px,transparent 1px)", backgroundSize:"24px 24px", opacity:0.2 }}/>
            <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"40%", background:"radial-gradient(ellipse at right,rgba(26,107,255,0.12),transparent 70%)" }}/>

            <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
              {/* Badge */}
              <div style={{ flexShrink:0 }}>
                <VeritasVerifiedBadge score={trustScore} size={130}/>
              </div>

              {/* Welcome text */}
              <div style={{ flex:1, minWidth:220 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:"0.62rem", padding:"3px 10px", background:`${tierColor}18`, border:`1px solid ${tierColor}44`, borderRadius:20, color:tierColor, fontWeight:800, letterSpacing:"0.1em" }}>{tier} MEMBER</span>
                  <span style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.35)" }}>Since Jan 2026</span>
                </div>
                <h1 style={{ fontSize:"1.9rem", fontWeight:900, margin:"0 0 6px", lineHeight:1.2 }}>
                  Welcome back, {user?.username || "Scott"} 👋
                </h1>
                <p style={{ color:"rgba(255,255,255,0.5)", margin:"0 0 16px", fontSize:"0.88rem", lineHeight:1.6 }}>
                  Your Trust Score is in the top 6% globally. You have 3 active jobs and 2 pending matches.
                </p>
                {/* Score progress */}
                <div style={{ maxWidth:380 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:"0.72rem" }}>
                    <span style={{ color:"rgba(255,255,255,0.5)" }}>Progress to <strong style={{ color:tierColor }}>{nextMilestone}</strong></span>
                    <span style={{ color:tierColor, fontWeight:700 }}>{trustScore} / {nextMilestone}</span>
                  </div>
                  <div style={{ height:6, background:"rgba(26,107,255,0.1)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(progress,100)}%`, height:"100%", background:`linear-gradient(90deg,#1a6bff,${tierColor})`, borderRadius:3, transition:"width 1s ease" }}/>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flexShrink:0 }}>
                {[
                  ["Trust Score", trustScore, "#00e676", <Shield size={14}/>],
                  ["Jobs Done",   94,         "#4da6ff", <Briefcase size={14}/>],
                  ["Earned",      "$182K",    "#f0c040", <DollarSign size={14}/>],
                  ["Rating",      "5.0 ★",    "#f0c040", <Star size={14}/>],
                ].map(([l,v,c,ic],i) => (
                  <div key={i} style={{ padding:"12px 16px", background:"rgba(26,107,255,0.07)", border:"1px solid rgba(26,107,255,0.15)", borderRadius:12, minWidth:110 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, color:c as string }}>{ic as React.ReactNode}<span style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.4)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l as string}</span></div>
                    <div style={{ fontSize:"1.3rem", fontWeight:900, color:c as string, lineHeight:1 }}>{v as any}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── STATS ROW ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
            {[
              { ic:<Briefcase size={20}/>, l:"Active Jobs",    v:"3",     c:"#4da6ff", sub:"2 milestones due" },
              { ic:<DollarSign size={20}/>,l:"In Escrow",      v:"$23.5K",c:"#f0c040", sub:"Across 3 contracts" },
              { ic:<TrendingUp size={20}/>,l:"This Month",     v:"$8,400",c:"#00e676", sub:"+24% vs last month" },
              { ic:<Clock size={20}/>,     l:"Avg Response",   v:"< 2hr", c:"#a78bfa", sub:"Top 5% speed" },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"18px 16px", opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(12px)", transition:`all 0.5s ease ${0.1+i*0.08}s` }}>
                <div style={{ color:s.c, marginBottom:10 }}>{s.ic}</div>
                <div style={{ fontSize:"1.6rem", fontWeight:900, color:s.c, lineHeight:1, marginBottom:4 }}>{s.v}</div>
                <div style={{ fontSize:"0.75rem", fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:2 }}>{s.l}</div>
                <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.35)" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── MAIN GRID ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>

            {/* LEFT — Active Jobs */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <h2 style={{ fontSize:"1.1rem", fontWeight:800, margin:0, display:"flex", alignItems:"center", gap:8 }}><Briefcase size={18} color="#4da6ff"/>Active & Matched Jobs</h2>
                <button onClick={()=>router.push("/job-board")} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", background:"rgba(26,107,255,0.08)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:8, color:"#4da6ff", fontSize:"0.75rem", cursor:"pointer", fontWeight:600 }}>
                  View All <ChevronRight size={13}/>
                </button>
              </div>

              {JOBS.map((j,i) => (
                <div key={j.id} onClick={()=>router.push("/contracts")} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:18, cursor:"pointer", opacity:mounted?1:0, transform:mounted?"translateX(0)":"translateX(-16px)", transition:`all 0.5s ease ${0.2+i*0.1}s` }}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(26,107,255,0.3)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.07)"}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                        <span style={{ fontWeight:800, fontSize:"0.95rem" }}>{j.title}</span>
                        <span style={{ fontSize:"0.62rem", padding:"2px 8px", borderRadius:10, fontWeight:700,
                          background:j.status==="active"?"rgba(0,200,83,0.1)":"rgba(240,192,64,0.1)",
                          color:j.status==="active"?"#00e676":"#f0c040" }}>
                          {j.status==="active"?"● ACTIVE":"◉ PENDING"}
                        </span>
                      </div>
                      <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.45)", marginBottom:8 }}>{j.client} · Due {j.due}</div>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <div style={{ height:4, flex:1, background:"rgba(26,107,255,0.1)", borderRadius:2, overflow:"hidden" }}>
                          <div style={{ width:`${j.match}%`, height:"100%", background:"linear-gradient(90deg,#1a6bff,#00e676)", borderRadius:2 }}/>
                        </div>
                        <span style={{ fontSize:"0.68rem", color:"#00e676", fontWeight:700, flexShrink:0 }}>{j.match}% match</span>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#00e676" }}>{j.budget}</div>
                      <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.35)", marginTop:2 }}>Fixed Price</div>
                      <ChevronRight size={14} color="rgba(255,255,255,0.2)" style={{ marginTop:8 }}/>
                    </div>
                  </div>
                </div>
              ))}

              {/* AI Match CTA */}
              <div onClick={()=>router.push("/ai-match")} style={{ background:"linear-gradient(135deg,rgba(26,107,255,0.08),rgba(212,175,55,0.05))", border:"1px solid rgba(26,107,255,0.2)", borderRadius:14, padding:18, cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(212,175,55,0.3)"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(26,107,255,0.2)"}>
                <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,rgba(212,175,55,0.15),rgba(26,107,255,0.1))", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Zap size={22} color="#f0c040"/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, marginBottom:3 }}>AI Match Engine</div>
                  <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.5)" }}>14 new matches found for your skills. AI selected top 3.</div>
                </div>
                <ArrowRight size={16} color="#f0c040"/>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Verification status */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:18 }}>
                <div style={{ fontWeight:800, marginBottom:12, fontSize:"0.88rem", display:"flex", alignItems:"center", gap:7 }}><Shield size={15} color="#4da6ff"/>Verification Status</div>
                {[
                  ["✅","Email","Verified",true],
                  ["🪪","Identity","Verified",true],
                  ["⚙️","Skills","3 verified",true],
                  ["📱","Phone","Add for +10 pts",false],
                ].map(([ic,l,v,done],i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<3?"1px solid rgba(255,255,255,0.04)":"none" }}>
                    <span style={{ fontSize:"1rem" }}>{ic}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.82rem", fontWeight:600 }}>{l as string}</div>
                      <div style={{ fontSize:"0.65rem", color:done?"#00e676":"rgba(255,255,255,0.4)" }}>{v as string}</div>
                    </div>
                    {done?<CheckCircle size={14} color="#00e676"/>:<button style={{ fontSize:"0.62rem", padding:"3px 8px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:5, color:"#4da6ff", cursor:"pointer" }}>Add</button>}
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:18 }}>
                <div style={{ fontWeight:800, marginBottom:12, fontSize:"0.88rem", display:"flex", alignItems:"center", gap:7 }}><Bell size={15} color="#f0c040"/>Recent Activity</div>
                {ACTIVITY.map((a,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:i<ACTIVITY.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:"rgba(26,107,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{a.ic}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"0.8rem", fontWeight:600, marginBottom:2 }}>{a.t}</div>
                      <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)" }}>{a.sub}</div>
                    </div>
                    <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", flexShrink:0 }}>{a.time}</div>
                  </div>
                ))}
              </div>

              {/* Governance CTA */}
              <div onClick={()=>router.push("/governance")} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:16, cursor:"pointer" }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(240,192,64,0.25)"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.07)"}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:"1.1rem" }}>🗳️</span>
                  <div style={{ fontWeight:800, fontSize:"0.85rem" }}>2 Active Proposals</div>
                  <span style={{ marginLeft:"auto", fontSize:"0.6rem", padding:"2px 7px", background:"rgba(240,192,64,0.1)", border:"1px solid rgba(240,192,64,0.25)", borderRadius:8, color:"#f0c040", fontWeight:700 }}>VOTE</span>
                </div>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>Your vote carries 1.69x weight with Trust Score 845. Voting closes in 3 days.</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
