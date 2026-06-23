
"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Clock, Play, Pause, StopCircle, Plus, DollarSign, Calendar, CheckCircle2, Briefcase } from "lucide-react";

const SESSIONS = [
  { id:"S001", job:"Full-Stack SaaS Platform", client:"TechVentures Inc.", duration:14400, date:"Today",     billed:true,  rate:150 },
  { id:"S002", job:"Full-Stack SaaS Platform", client:"TechVentures Inc.", duration:10800, date:"Yesterday", billed:true,  rate:150 },
  { id:"S003", job:"Brand Identity Design",    client:"GreenLeaf Studios", duration:7200,  date:"Jun 16",    billed:false, rate:120 },
  { id:"S004", job:"Full-Stack SaaS Platform", client:"TechVentures Inc.", duration:18000, date:"Jun 15",    billed:true,  rate:150 },
];

function fmt(secs:number){const h=Math.floor(secs/3600);const m=Math.floor((secs%3600)/60);const s=secs%60;return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;}

export default function TimeTrackerPage() {
  const [running,setRunning]   = useState(false);
  const [elapsed,setElapsed]   = useState(0);
  const [note,setNote]         = useState("");
  const [activeJob,setActiveJob] = useState("Full-Stack SaaS Platform");
  const [sessions,setSessions] = useState(SESSIONS);
  const timerRef               = useRef<NodeJS.Timeout|null>(null);

  useEffect(()=>{
    if(running){timerRef.current=setInterval(()=>setElapsed(e=>e+1),1000);}
    else if(timerRef.current){clearInterval(timerRef.current);}
    return ()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[running]);

  function stop(){
    setRunning(false);
    if(elapsed>0){
      const ns={id:"S"+Date.now(),job:activeJob,client:"TechVentures Inc.",duration:elapsed,date:"Today",billed:false,rate:150};
      setSessions(p=>[ns,...p]);
      setElapsed(0);
    }
  }

  const totalSecs   = sessions.reduce((a,s)=>a+s.duration,0);
  const totalBilled = sessions.reduce((a,s)=>a+(s.billed?s.duration/3600*s.rate:0),0);
  const unbilled    = sessions.filter(s=>!s.billed).reduce((a,s)=>a+s.duration/3600*s.rate,0);

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6"><Clock className="text-yellow-400" size={28}/><h1 className="text-3xl font-black gold-text">Time Tracker</h1></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {icon:Clock,      label:"Total Hours",   value:fmt(totalSecs).split(":")[0]+"h",color:"text-cyan-400"},
          {icon:DollarSign, label:"Total Billed",  value:"$"+totalBilled.toFixed(0),     color:"text-green-400"},
          {icon:CheckCircle2,label:"Unbilled",     value:"$"+unbilled.toFixed(0),         color:"text-yellow-400"},
          {icon:Calendar,   label:"Sessions",      value:sessions.length,                 color:"text-purple-400"},
        ].map((s,i)=>{const Icon=s.icon;return(
          <div key={i} className="glass-card rounded-2xl p-5"><Icon size={20} className={s.color}/>
          <div className="text-2xl font-black mt-3 mb-1">{s.value}</div>
          <div className="text-xs text-white/50">{s.label}</div></div>
        );})}
      </div>

      <div className="glass-card rounded-3xl p-8 mb-6 text-center">
        <div className="text-6xl font-black font-mono gold-text mb-6">{fmt(elapsed)}</div>
        <div className="mb-6">
          <select value={activeJob} onChange={e=>setActiveJob(e.target.value)} className="veritas-input max-w-xs mx-auto text-center text-sm">
            <option>Full-Stack SaaS Platform</option>
            <option>Brand Identity Design</option>
            <option>Product Demo Video</option>
          </select>
        </div>
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="What are you working on? (optional)" className="veritas-input max-w-md mx-auto mb-6 text-sm text-center"/>
        <div className="flex items-center justify-center gap-4">
          {!running?(
            <button onClick={()=>setRunning(true)} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-black text-lg transition">
              <Play size={24} fill="currentColor"/> Start Timer
            </button>
          ):(
            <>
              <button onClick={()=>setRunning(false)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-yellow-500/30 text-yellow-400 font-bold hover:bg-yellow-500/10 transition">
                <Pause size={20}/> Pause
              </button>
              <button onClick={stop} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/30 transition">
                <StopCircle size={20}/> Stop & Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 font-bold">Session History</div>
        {sessions.map((s,i)=>(
          <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition">
            <div className="flex items-center gap-4">
              <div className={"w-9 h-9 rounded-xl flex items-center justify-center "+(s.billed?"bg-green-500/10":"bg-yellow-500/10")}>
                <Clock size={16} className={s.billed?"text-green-400":"text-yellow-400"}/>
              </div>
              <div>
                <div className="font-medium text-sm">{s.job}</div>
                <div className="text-xs text-white/40">{s.client} · {s.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm font-mono text-white/70">{fmt(s.duration)}</div>
              <div className="text-sm font-bold text-green-400">${(s.duration/3600*s.rate).toFixed(2)}</div>
              <span className={"text-xs px-2 py-0.5 rounded-full border "+(s.billed?"bg-green-500/10 text-green-400 border-green-500/20":"bg-yellow-500/10 text-yellow-400 border-yellow-500/20")}>
                {s.billed?"Billed":"Unbilled"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main></div></div>
  );
}
