
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge, VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Trophy, Shield, TrendingUp, TrendingDown, Minus, Crown, Search, Zap, Clock } from "lucide-react";

const LEADERS = [
  {rank:1, prev:1,  name:"Alex Chen",     username:"alexchen.dev",  score:990, cat:"Development", jobs:247, earnings:184500, verified:true,  streak:30, badge:"🥇"},
  {rank:2, prev:3,  name:"Maya Rodriguez",username:"maya.designs",  score:980, cat:"Design",       jobs:189, earnings:142000, verified:true,  streak:22, badge:"🥈"},
  {rank:3, prev:2,  name:"James Park",    username:"jpark.writes",  score:970, cat:"Writing",      jobs:312, earnings:98700,  verified:true,  streak:45, badge:"🥉"},
  {rank:4, prev:6,  name:"Priya Sharma",  username:"priyadev",      score:960, cat:"Development", jobs:156, earnings:221000, verified:true,  streak:18, badge:"⭐"},
  {rank:5, prev:4,  name:"David Okonkwo", username:"david.mktg",    score:950, cat:"Marketing",   jobs:203, earnings:87400,  verified:true,  streak:29, badge:"⭐"},
  {rank:6, prev:7,  name:"Lena Fischer",  username:"lena.ux",       score:940, cat:"Design",       jobs:178, earnings:156300, verified:true,  streak:12, badge:"⭐"},
  {rank:7, prev:5,  name:"Rahul Mehta",   username:"rahulmehta",    score:930, cat:"Consulting",   jobs:94,  earnings:312000, verified:true,  streak:8,  badge:"⭐"},
  {rank:8, prev:9,  name:"Sofia Torres",  username:"sofia.vid",     score:920, cat:"Video",        jobs:267, earnings:124500, verified:false, streak:14, badge:"⭐"},
  {rank:9, prev:8,  name:"Marcus Johnson",username:"mjohnson.dev",  score:910, cat:"Development", jobs:198, earnings:178900, verified:true,  streak:6,  badge:"⭐"},
  {rank:10,prev:11, name:"Yuki Tanaka",   username:"yuki.writes",   score:900, cat:"Writing",      jobs:445, earnings:76300,  verified:true,  streak:21, badge:"⭐"},
];

const CATS = ["All","Development","Design","Writing","Marketing","Video","Consulting"];

function Delta({r,p}:{r:number;p:number}){
  const d=p-r;
  if(d>0) return <div style={{display:"flex",alignItems:"center",gap:2,color:"#00e676",fontSize:"0.65rem",fontWeight:700}}><TrendingUp size={11}/>+{d}</div>;
  if(d<0) return <div style={{display:"flex",alignItems:"center",gap:2,color:"#ff5555",fontSize:"0.65rem",fontWeight:700}}><TrendingDown size={11}/>{d}</div>;
  return <div style={{display:"flex",alignItems:"center",color:"rgba(255,255,255,0.3)",fontSize:"0.65rem"}}><Minus size={11}/></div>;
}

export default function LeaderboardV2Page() {
  const [cat, setCat]     = useState("All");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("All Time");

  const filtered = LEADERS.filter(l=>{
    const matchCat    = cat==="All"||l.cat===cat;
    const matchSearch = !search||l.name.toLowerCase().includes(search.toLowerCase())||l.username.toLowerCase().includes(search.toLowerCase());
    return matchCat&&matchSearch;
  });

  const top3 = filtered.slice(0,3);
  const rest  = filtered.slice(3);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Trophy size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Trust Score Leaderboard</h1>
          </div>

          {/* Filters */}
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{position:"relative",flex:1,maxWidth:280}}>
              <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search professionals..." style={{width:"100%",padding:"10px 12px 10px 34px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"7px 12px",borderRadius:18,border:`1px solid ${cat===c?"rgba(240,192,64,0.4)":"rgba(26,107,255,0.12)"}`,background:cat===c?"rgba(240,192,64,0.1)":"transparent",color:cat===c?"#f0c040":"rgba(255,255,255,0.45)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"}}>{c}</button>)}
            </div>
            <div style={{display:"flex",gap:5}}>
              {["All Time","This Month","This Week"].map(t=><button key={t} onClick={()=>setPeriod(t)} style={{padding:"7px 11px",borderRadius:8,border:`1px solid ${period===t?"rgba(26,107,255,0.35)":"rgba(26,107,255,0.1)"}`,background:period===t?"rgba(26,107,255,0.1)":"transparent",color:period===t?"#4da6ff":"rgba(255,255,255,0.38)",fontSize:"0.72rem",cursor:"pointer"}}>{t}</button>)}
            </div>
          </div>

          {/* Podium */}
          {top3.length>=3&&(
            <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:16,marginBottom:24,padding:"0 20px"}}>
              {/* 2nd */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:140}}>
                <div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,#6b7280,#4b5563)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1.5rem",border:"3px solid rgba(255,255,255,0.2)"}}>{top3[1].name[0]}</div>
                <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:"0.88rem"}}>{top3[1].name}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>@{top3[1].username}</div><div style={{fontSize:"1.2rem",fontWeight:900,color:"#00e676",marginTop:3}}>{top3[1].score}</div></div>
                <div style={{width:"100%",height:80,background:"linear-gradient(180deg,rgba(107,114,128,0.3),rgba(75,85,99,0.2))",borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem"}}>🥈</div>
              </div>
              {/* 1st */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:160}}>
                <Crown size={26} color="#f0c040"/>
                <div style={{position:"relative"}}>
                  <div style={{width:86,height:86,borderRadius:20,background:"linear-gradient(135deg,#d4af37,#c9a227)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1.8rem",border:"3px solid #f0c040",boxShadow:"0 0 30px rgba(212,175,55,0.4)"}}>{top3[0].name[0]}</div>
                </div>
                <div style={{textAlign:"center"}}><div style={{fontWeight:900,fontSize:"0.95rem"}}>{top3[0].name}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>@{top3[0].username}</div><div style={{fontSize:"1.5rem",fontWeight:900,color:"#f0c040",marginTop:3}}>{top3[0].score}</div></div>
                <div style={{width:"100%",height:120,background:"linear-gradient(180deg,rgba(212,175,55,0.2),rgba(201,162,39,0.08))",borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem"}}>🏆</div>
              </div>
              {/* 3rd */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:140}}>
                <div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,#92400e,#78350f)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1.5rem",border:"3px solid rgba(180,120,40,0.4)"}}>{top3[2].name[0]}</div>
                <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:"0.88rem"}}>{top3[2].name}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>@{top3[2].username}</div><div style={{fontSize:"1.2rem",fontWeight:900,color:"#00e676",marginTop:3}}>{top3[2].score}</div></div>
                <div style={{width:"100%",height:56,background:"linear-gradient(180deg,rgba(146,64,14,0.3),rgba(120,53,15,0.15))",borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem"}}>🥉</div>
              </div>
            </div>
          )}

          {/* Table */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 1fr 80px 120px",padding:"10px 18px",fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
              <div>Rank</div><div>Professional</div><div style={{textAlign:"center"}}>Score</div><div>Category</div><div style={{textAlign:"center"}}>Jobs</div><div style={{textAlign:"right"}}>Earnings</div>
            </div>
            {rest.map(l=>(
              <div key={l.rank} style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 1fr 80px 120px",padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:"1rem",color:"rgba(255,255,255,0.7)"}}>#{l.rank}</div>
                  <Delta r={l.rank} p={l.prev}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.88rem",flexShrink:0}}>{l.name[0]}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:5}}>{l.name}{l.verified&&<Shield size={11} color="#1a6bff"/>}</div>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>@{l.username}</div>
                    {l.streak>=14&&<div style={{fontSize:"0.6rem",color:"#ff6600",display:"flex",alignItems:"center",gap:3}}><Zap size={9}/>{l.streak}d streak</div>}
                  </div>
                </div>
                <div style={{textAlign:"center",fontWeight:900,fontSize:"1.1rem",color:"#00e676"}}>{l.score}</div>
                <div><span style={{fontSize:"0.68rem",padding:"3px 8px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:5,color:"rgba(255,255,255,0.55)"}}>{l.cat}</span></div>
                <div style={{textAlign:"center",fontSize:"0.85rem",color:"rgba(255,255,255,0.6)"}}>{l.jobs}</div>
                <div style={{textAlign:"right",fontWeight:700,color:"#00e676",fontSize:"0.88rem"}}>${l.earnings.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
