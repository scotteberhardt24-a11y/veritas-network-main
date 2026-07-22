"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { Trophy, Shield, TrendingUp, TrendingDown, Minus, Search, Crown } from "lucide-react";

const LEADERS = [
  { rank:1,  prev:1,  name:"Alex Chen",      username:"alexchen.dev",  score:990, cat:"Development", jobs:247, earnings:184500, verified:true,  streak:30 },
  { rank:2,  prev:3,  name:"Maya Rodriguez", username:"maya.designs",  score:980, cat:"Design",      jobs:189, earnings:142000, verified:true,  streak:22 },
  { rank:3,  prev:2,  name:"James Park",     username:"jpark.writes",  score:970, cat:"Writing",     jobs:312, earnings:98700,  verified:true,  streak:45 },
  { rank:4,  prev:6,  name:"Priya Sharma",   username:"priyadev",      score:960, cat:"Development", jobs:156, earnings:221000, verified:true,  streak:18 },
  { rank:5,  prev:4,  name:"David Okonkwo",  username:"david.mktg",    score:950, cat:"Marketing",   jobs:203, earnings:87400,  verified:true,  streak:29 },
  { rank:6,  prev:7,  name:"Lena Fischer",   username:"lena.ux",       score:940, cat:"Design",      jobs:178, earnings:156300, verified:true,  streak:12 },
  { rank:7,  prev:5,  name:"Rahul Mehta",    username:"rahulmehta",    score:930, cat:"Consulting",  jobs:94,  earnings:312000, verified:true,  streak:8  },
  { rank:8,  prev:9,  name:"Sofia Torres",   username:"sofia.vid",     score:920, cat:"Video",       jobs:267, earnings:124500, verified:false, streak:14 },
  { rank:9,  prev:8,  name:"Marcus Johnson", username:"mjohnson.dev",  score:910, cat:"Development", jobs:198, earnings:178900, verified:true,  streak:6  },
  { rank:10, prev:11, name:"Yuki Tanaka",    username:"yuki.writes",   score:900, cat:"Writing",     jobs:445, earnings:76300,  verified:true,  streak:21 },
];

function Delta({ r, p }: { r:number; p:number }) {
  const d = p - r;
  if (d > 0) return <span style={{ color:"#00e676", fontSize:"0.62rem", fontWeight:700, display:"flex", alignItems:"center", gap:2 }}><TrendingUp size={10}/>+{d}</span>;
  if (d < 0) return <span style={{ color:"#ff5555", fontSize:"0.62rem", fontWeight:700, display:"flex", alignItems:"center", gap:2 }}><TrendingDown size={10}/>{d}</span>;
  return <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.62rem" }}><Minus size={10}/></span>;
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("All Time");
  const filtered = LEADERS.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()));
  const top3 = filtered.slice(0,3);
  const rest = filtered.slice(3);
  const podiumOrder = [1,0,2]; // silver, gold, bronze

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#030d1e" }}>
      <Sidebar/>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <TopBar/>
        <main style={{ flex:1, overflowY:"auto", padding:24, color:"white" }}>

          {/* Header */}
          <div style={{ position:"relative", background:"linear-gradient(135deg,rgba(10,25,55,0.98),rgba(5,15,35,0.96))", border:"1px solid rgba(212,175,55,0.2)", borderRadius:20, padding:28, marginBottom:24, overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(212,175,55,0.08) 1px,transparent 1px)", backgroundSize:"24px 24px" }}/>
            <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <Trophy size={36} color="#f0c040"/>
                <div>
                  <h1 style={{ fontSize:"2rem", fontWeight:900, margin:0 }}>Trust Leaderboard</h1>
                  <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.45)", marginTop:2 }}>Top verified professionals ranked by Trust Score</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ position:"relative" }}>
                  <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}/>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ padding:"8px 12px 8px 30px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:9, color:"white", fontSize:"0.82rem", outline:"none", width:180 }}/>
                </div>
                {["All Time","Month","Week"].map(t=>(
                  <button key={t} onClick={()=>setPeriod(t)} style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${period===t?"rgba(212,175,55,0.4)":"rgba(255,255,255,0.1)"}`, background:period===t?"rgba(212,175,55,0.1)":"transparent", color:period===t?"#f0c040":"rgba(255,255,255,0.5)", fontSize:"0.75rem", cursor:"pointer", fontWeight:period===t?700:400 }}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Podium */}
          {top3.length >= 3 && (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:20, marginBottom:28 }}>
              {podiumOrder.map(idx => {
                const l = top3[idx];
                const isFirst = idx === 0;
                const heights = [90, 120, 70];
                const podiumH = heights[idx];
                const colors = ["#C0C0C0","#D4AF37","#CD7F32"];
                return (
                  <div key={l.rank} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, width:isFirst?170:150 }}>
                    {isFirst && <Crown size={28} color="#f0c040" style={{ marginBottom:4 }}/>}
                    <VeritasVerifiedBadge score={l.score} size={isFirst?90:72}/>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:900, fontSize:isFirst?"0.95rem":"0.85rem" }}>{l.name}</div>
                      <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.4)" }}>@{l.username}</div>
                      <div style={{ fontSize:isFirst?"1.5rem":"1.2rem", fontWeight:900, color:colors[idx], marginTop:3 }}>{l.score}</div>
                    </div>
                    <div style={{ width:"100%", height:podiumH, background:`linear-gradient(180deg,${colors[idx]}22,${colors[idx]}11)`, border:`1px solid ${colors[idx]}44`, borderRadius:"10px 10px 0 0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:isFirst?"2.5rem":"2rem" }}>
                      {["🥈","🏆","🥉"][idx]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table */}
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 90px 120px 80px 130px", padding:"10px 20px", fontSize:"0.6rem", fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div>Rank</div><div>Professional</div><div style={{textAlign:"center"}}>Score</div><div>Category</div><div style={{textAlign:"center"}}>Jobs</div><div style={{textAlign:"right"}}>Earnings</div>
            </div>
            {rest.map(l=>(
              <div key={l.rank} style={{ display:"grid", gridTemplateColumns:"70px 1fr 90px 120px 80px 130px", padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", alignItems:"center", transition:"background 0.15s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(255,255,255,0.02)"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="transparent"}>
                <div>
                  <div style={{ fontWeight:800, fontSize:"1rem", color:"rgba(255,255,255,0.7)" }}>#{l.rank}</div>
                  <Delta r={l.rank} p={l.prev}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.9rem", flexShrink:0 }}>{l.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"0.88rem", display:"flex", alignItems:"center", gap:5 }}>{l.name}{l.verified&&<Shield size={11} color="#1a6bff"/>}</div>
                    <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.35)" }}>@{l.username}{l.streak>=14&&<span style={{color:"#ff6600",marginLeft:6,fontSize:"0.58rem"}}>🔥 {l.streak}d streak</span>}</div>
                  </div>
                </div>
                <div style={{ textAlign:"center", fontWeight:900, fontSize:"1.1rem", color:"#00e676" }}>{l.score}</div>
                <div><span style={{ fontSize:"0.65rem", padding:"3px 8px", background:"rgba(26,107,255,0.07)", border:"1px solid rgba(26,107,255,0.14)", borderRadius:5, color:"rgba(255,255,255,0.55)" }}>{l.cat}</span></div>
                <div style={{ textAlign:"center", fontSize:"0.85rem", color:"rgba(255,255,255,0.6)" }}>{l.jobs}</div>
                <div style={{ textAlign:"right", fontWeight:700, color:"#00e676", fontSize:"0.85rem" }}>${l.earnings.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
