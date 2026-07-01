
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Trophy, Shield, TrendingUp, TrendingDown, Minus, Search, Zap, Crown } from "lucide-react";

const LEADERS=[
  {rank:1,prev:1, name:"Alex Chen",     username:"alexchen.dev",  score:990,cat:"Development",jobs:247,earnings:184500,verified:true, streak:30},
  {rank:2,prev:3, name:"Maya Rodriguez",username:"maya.designs",  score:980,cat:"Design",      jobs:189,earnings:142000,verified:true, streak:22},
  {rank:3,prev:2, name:"James Park",    username:"jpark.writes",  score:970,cat:"Writing",     jobs:312,earnings:98700, verified:true, streak:45},
  {rank:4,prev:6, name:"Priya Sharma",  username:"priyadev",      score:960,cat:"Development", jobs:156,earnings:221000,verified:true, streak:18},
  {rank:5,prev:4, name:"David Okonkwo", username:"david.mktg",    score:950,cat:"Marketing",   jobs:203,earnings:87400, verified:true, streak:29},
  {rank:6,prev:7, name:"Lena Fischer",  username:"lena.ux",       score:940,cat:"Design",      jobs:178,earnings:156300,verified:true, streak:12},
  {rank:7,prev:5, name:"Rahul Mehta",   username:"rahulmehta",    score:930,cat:"Consulting",  jobs:94, earnings:312000,verified:true, streak:8},
  {rank:8,prev:9, name:"Sofia Torres",  username:"sofia.vid",     score:920,cat:"Video",       jobs:267,earnings:124500,verified:false,streak:14},
  {rank:9,prev:8, name:"Marcus Johnson",username:"mjohnson.dev",  score:910,cat:"Development", jobs:198,earnings:178900,verified:true, streak:6},
  {rank:10,prev:11,name:"Yuki Tanaka",  username:"yuki.writes",   score:900,cat:"Writing",     jobs:445,earnings:76300, verified:true, streak:21},
];
const CATS=["All","Development","Design","Writing","Marketing","Video","Consulting"];

function Delta({r,p}:{r:number;p:number}){
  const d=p-r;
  if(d>0)return<span style={{display:"inline-flex",alignItems:"center",gap:2,color:"#00e676",fontSize:"0.62rem",fontWeight:700}}><TrendingUp size={10}/>+{d}</span>;
  if(d<0)return<span style={{display:"inline-flex",alignItems:"center",gap:2,color:"#ff5555",fontSize:"0.62rem",fontWeight:700}}><TrendingDown size={10}/>{d}</span>;
  return<span style={{color:"rgba(255,255,255,0.3)",fontSize:"0.62rem"}}><Minus size={10}/></span>;
}

export default function TrustLeaderboardV2Page(){
  const [cat,setCat]=useState("All");
  const [search,setSearch]=useState("");
  const [period,setPeriod]=useState("All Time");
  const filtered=LEADERS.filter(l=>(cat==="All"||l.cat===cat)&&(!search||l.name.toLowerCase().includes(search.toLowerCase())));
  const top3=filtered.slice(0,3);
  const rest=filtered.slice(3);

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Trophy size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Trust Leaderboard</h1>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{position:"relative",flex:1,maxWidth:260}}>
              <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"9px 12px 9px 33px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"6px 12px",borderRadius:18,border:`1px solid ${cat===c?"rgba(240,192,64,0.4)":"rgba(26,107,255,0.12)"}`,background:cat===c?"rgba(240,192,64,0.1)":"transparent",color:cat===c?"#f0c040":"rgba(255,255,255,0.45)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"}}>{c}</button>)}
            </div>
            <div style={{display:"flex",gap:5}}>
              {["All Time","Month","Week"].map(t=><button key={t} onClick={()=>setPeriod(t)} style={{padding:"6px 11px",borderRadius:8,border:`1px solid ${period===t?"rgba(26,107,255,0.35)":"rgba(26,107,255,0.1)"}`,background:period===t?"rgba(26,107,255,0.1)":"transparent",color:period===t?"#4da6ff":"rgba(255,255,255,0.38)",fontSize:"0.72rem",cursor:"pointer"}}>{t}</button>)}
            </div>
          </div>

          {top3.length>=3&&(
            <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:16,marginBottom:24}}>
              {[1,0,2].map(idx=>{
                const l=top3[idx];
                const isFirst=idx===0;
                return(
                  <div key={l.rank} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:isFirst?160:140}}>
                    {isFirst&&<Crown size={24} color="#f0c040"/>}
                    <div style={{width:isFirst?80:68,height:isFirst?80:68,borderRadius:isFirst?20:16,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:isFirst?"1.6rem":"1.3rem",border:`3px solid ${isFirst?"#f0c040":"rgba(255,255,255,0.2)"}`,boxShadow:isFirst?"0 0 28px rgba(212,175,55,0.4)":"none"}}>
                      {l.name[0]}
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontWeight:isFirst?900:700,fontSize:isFirst?"0.92rem":"0.85rem"}}>{l.name}</div>
                      <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.4)"}}>@{l.username}</div>
                      <div style={{fontSize:isFirst?"1.4rem":"1.1rem",fontWeight:900,color:"#00e676",marginTop:2}}>{l.score}</div>
                    </div>
                    <div style={{width:"100%",height:isFirst?110:75,background:"rgba(26,107,255,0.08)",borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:isFirst?"2.2rem":"1.8rem"}}>
                      {["🥈","🏆","🥉"][idx]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 1fr 80px 120px",padding:"10px 18px",fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
              <div>Rank</div><div>Professional</div><div style={{textAlign:"center"}}>Score</div><div>Category</div><div style={{textAlign:"center"}}>Jobs</div><div style={{textAlign:"right"}}>Earnings</div>
            </div>
            {rest.map(l=>(
              <div key={l.rank} style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 1fr 80px 120px",padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)",alignItems:"center",color:"white"}}>
                <div><div style={{fontWeight:800,fontSize:"0.95rem",color:"rgba(255,255,255,0.7)"}}>#{l.rank}</div><Delta r={l.rank} p={l.prev}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.85rem",flexShrink:0}}>{l.name[0]}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:"0.85rem",display:"flex",alignItems:"center",gap:5}}>{l.name}{l.verified&&<Shield size={11} color="#1a6bff"/>}</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>@{l.username}{l.streak>=14&&<span style={{color:"#ff6600",marginLeft:5,fontSize:"0.6rem"}}>{l.streak}d streak</span>}</div>
                  </div>
                </div>
                <div style={{textAlign:"center",fontWeight:900,fontSize:"1.05rem",color:"#00e676"}}>{l.score}</div>
                <div><span style={{fontSize:"0.65rem",padding:"2px 7px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:5,color:"rgba(255,255,255,0.55)"}}>{l.cat}</span></div>
                <div style={{textAlign:"center",fontSize:"0.85rem",color:"rgba(255,255,255,0.6)"}}>{l.jobs}</div>
                <div style={{textAlign:"right",fontWeight:700,color:"#00e676",fontSize:"0.85rem"}}>${l.earnings.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
