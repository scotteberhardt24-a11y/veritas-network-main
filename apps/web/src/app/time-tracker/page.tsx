
"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Clock, Play, Pause, StopCircle, DollarSign, CheckCircle2, Calendar, TrendingUp, Plus, Download, Trash2 } from "lucide-react";

const SESSIONS = [
  {id:"S1",job:"Full-Stack SaaS — TechVentures",cat:"Development",dur:14400,date:"Today",     billed:true, rate:150,note:"API integration & testing"},
  {id:"S2",job:"Full-Stack SaaS — TechVentures",cat:"Development",dur:10800,date:"Yesterday", billed:true, rate:150,note:"Dashboard components"},
  {id:"S3",job:"Brand Identity — GreenLeaf",    cat:"Design",     dur:7200, date:"Jun 16",    billed:false,rate:120,note:"Logo revisions"},
  {id:"S4",job:"Full-Stack SaaS — TechVentures",cat:"Development",dur:18000,date:"Jun 15",    billed:true, rate:150,note:"Database schema"},
  {id:"S5",job:"Product Demo Video",            cat:"Video",      dur:5400, date:"Jun 14",    billed:false,rate:95, note:"Script review"},
];

function fmt(s:number){const h=Math.floor(s/3600);const m=Math.floor((s%3600)/60);const sec=s%60;return`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;}

const CAT_COLOR:Record<string,string> = {Development:"#4da6ff",Design:"#a78bfa",Video:"#f0c040",Writing:"#00e676",Marketing:"#ff8c00"};

export default function TimeTrackerV2Page() {
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [note, setNote]         = useState("");
  const [activeJob, setActiveJob] = useState("Full-Stack SaaS — TechVentures");
  const [activeRate, setActiveRate] = useState(150);
  const [sessions, setSessions] = useState(SESSIONS);
  const timerRef                = useRef<NodeJS.Timeout|null>(null);
  const [weekView, setWeekView] = useState(false);

  useEffect(()=>{
    if(running){ timerRef.current=setInterval(()=>setElapsed(e=>e+1),1000); }
    else if(timerRef.current){ clearInterval(timerRef.current); }
    return()=>{ if(timerRef.current) clearInterval(timerRef.current); };
  },[running]);

  function stop(){
    setRunning(false);
    if(elapsed>0){
      setSessions(p=>[{id:"S"+Date.now(),job:activeJob,cat:"Development",dur:elapsed,date:"Today",billed:false,rate:activeRate,note:note||"Work session"},...p]);
      setElapsed(0); setNote("");
    }
  }

  const totalHours   = sessions.reduce((a,s)=>a+s.dur,0)/3600;
  const billedAmount = sessions.reduce((a,s)=>a+(s.billed?s.dur/3600*s.rate:0),0);
  const unbilledAmount = sessions.reduce((a,s)=>a+(!s.billed?s.dur/3600*s.rate:0),0);
  const todaySecs    = sessions.filter(s=>s.date==="Today").reduce((a,s)=>a+s.dur,0);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Clock size={28} color="#4da6ff"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Time Tracker</h1>
          </div>

          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {label:"Today",       value:fmt(todaySecs),           sub:"Tracked today",      color:"#4da6ff"},
              {label:"Total Hours", value:`${totalHours.toFixed(1)}h`, sub:"All sessions",    color:"#00d4ff"},
              {label:"Billed",      value:`$${billedAmount.toFixed(0)}`, sub:"Invoiced",      color:"#00e676"},
              {label:"Unbilled",    value:`$${unbilledAmount.toFixed(0)}`, sub:"Ready to invoice", color:"#f0c040"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.28)",marginTop:2}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Timer widget */}
          <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:28,marginBottom:20,textAlign:"center"}}>
            <div style={{fontSize:"5rem",fontWeight:900,fontFamily:"monospace",letterSpacing:"-0.02em",marginBottom:8,
              background:running?"linear-gradient(135deg,#00e676,#00c853)":"linear-gradient(135deg,#4da6ff,#1a6bff)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              {fmt(elapsed)}
            </div>
            {running&&<div style={{fontSize:"0.72rem",color:"#00e676",fontWeight:700,marginBottom:16,letterSpacing:"0.1em",textTransform:"uppercase"}}>● Recording</div>}
            <div style={{maxWidth:400,margin:"0 auto 20px"}}>
              <select value={activeJob} onChange={e=>setActiveJob(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none",marginBottom:8}}>
                <option>Full-Stack SaaS — TechVentures</option>
                <option>Brand Identity — GreenLeaf</option>
                <option>Product Demo Video</option>
              </select>
              <input value={note} onChange={e=>setNote(e.target.value)} placeholder="What are you working on? (optional)" style={{width:"100%",padding:"10px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",textAlign:"center"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:12}}>
              {!running?(
                <button onClick={()=>setRunning(true)} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 36px",background:"linear-gradient(135deg,#00c853,#007a30)",border:"none",borderRadius:14,color:"white",fontWeight:800,fontSize:"1.1rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,200,83,0.4)"}}>
                  <Play size={22} fill="white"/> Start Timer
                </button>
              ):(
                <>
                  <button onClick={()=>setRunning(false)} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,background:"rgba(240,192,64,0.12)",border:"1px solid rgba(240,192,64,0.3)",color:"#f0c040",fontWeight:700,cursor:"pointer",fontSize:"0.95rem"}}>
                    <Pause size={18}/> Pause
                  </button>
                  <button onClick={stop} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,background:"rgba(255,85,85,0.12)",border:"1px solid rgba(255,85,85,0.3)",color:"#ff5555",fontWeight:700,cursor:"pointer",fontSize:"0.95rem"}}>
                    <StopCircle size={18}/> Stop & Save
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sessions list */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(26,107,255,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:800}}>Session History</span>
              <button style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:7,color:"#4da6ff",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>
                <Download size={13}/> Export CSV
              </button>
            </div>
            {sessions.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:CAT_COLOR[s.cat]||"#4da6ff",flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:"0.87rem",marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.job}</div>
                  <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>{s.date} · {s.note}</div>
                </div>
                <div style={{fontSize:"0.88rem",fontFamily:"monospace",color:"rgba(255,255,255,0.6)",flexShrink:0}}>{fmt(s.dur)}</div>
                <div style={{fontWeight:800,color:"#00e676",fontSize:"0.9rem",flexShrink:0,minWidth:60,textAlign:"right"}}>${(s.dur/3600*s.rate).toFixed(2)}</div>
                <span style={{fontSize:"0.62rem",padding:"3px 7px",borderRadius:5,fontWeight:700,flexShrink:0,
                  background:s.billed?"rgba(0,200,83,0.1)":"rgba(240,192,64,0.1)",
                  border:`1px solid ${s.billed?"rgba(0,200,83,0.2)":"rgba(240,192,64,0.2)"}`,
                  color:s.billed?"#00e676":"#f0c040"}}>{s.billed?"Billed":"Unbilled"}</span>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.2)",padding:4}}><Trash2 size={13}/></button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
