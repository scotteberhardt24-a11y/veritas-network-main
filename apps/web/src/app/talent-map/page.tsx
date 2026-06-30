
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Globe, Shield, Star, MapPin, Filter, Users } from "lucide-react";

const REGIONS = [
  {name:"North America",workers:4821,avgScore:87,avgRate:135,top:"Development",x:18,y:38},
  {name:"Europe",       workers:3902,avgScore:91,avgRate:120,top:"Design",      x:48,y:28},
  {name:"South America",workers:1340,avgScore:82,avgRate:75, top:"Writing",    x:28,y:62},
  {name:"Asia Pacific",  workers:2891,avgScore:84,avgRate:95, top:"Development",x:75,y:48},
  {name:"Middle East",   workers:687, avgScore:88,avgRate:110,top:"Consulting",x:58,y:42},
  {name:"Africa",        workers:1206,avgScore:85,avgRate:65, top:"Writing",    x:50,y:58},
];

export default function TalentMapPage() {
  const [selected, setSelected] = useState(REGIONS[0]);
  const totalWorkers = REGIONS.reduce((a,r)=>a+r.workers,0);

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}><Globe size={28} color="#00d4ff"/><h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Global Talent Map</h1></div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
            {[{l:"Total Verified Workers",v:totalWorkers.toLocaleString(),c:"#00d4ff"},{l:"Countries Represented",v:"94",c:"#4da6ff"},{l:"Avg Global Trust Score",v:"86.2",c:"#00e676"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}><div style={{fontSize:"1.8rem",fontWeight:900,color:s.c,marginBottom:4}}>{s.v}</div><div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.l}</div></div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
            {/* Map visualization */}
            <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:24,position:"relative",minHeight:420,overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.2) 1px,transparent 1px)",backgroundSize:"24px 24px",opacity:0.2}}/>
              <div style={{position:"relative",width:"100%",height:380}}>
                {REGIONS.map((r,i)=>(
                  <div key={i} onClick={()=>setSelected(r)} style={{
                    position:"absolute",left:`${r.x}%`,top:`${r.y}%`,transform:"translate(-50%,-50%)",
                    cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                  }}>
                    <div style={{
                      width:Math.max(28,Math.min(60,r.workers/100)),height:Math.max(28,Math.min(60,r.workers/100)),
                      borderRadius:"50%",
                      background:selected.name===r.name?"rgba(26,107,255,0.35)":"rgba(26,107,255,0.15)",
                      border:`2px solid ${selected.name===r.name?"rgba(26,107,255,0.7)":"rgba(26,107,255,0.35)"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      boxShadow:selected.name===r.name?"0 0 24px rgba(26,107,255,0.4)":"none",
                      transition:"all 0.2s",
                    }}>
                      <span style={{fontWeight:900,fontSize:"0.7rem",color:"#4da6ff"}}>{(r.workers/1000).toFixed(1)}K</span>
                    </div>
                    <span style={{fontSize:"0.65rem",fontWeight:700,color:selected.name===r.name?"white":"rgba(255,255,255,0.5)",whiteSpace:"nowrap"}}>{r.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:16,padding:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><MapPin size={18} color="#4da6ff"/><span style={{fontWeight:900,fontSize:"1.1rem"}}>{selected.name}</span></div>
                {[["Verified Workers",selected.workers.toLocaleString(),"#4da6ff"],["Avg Trust Score",String(selected.avgScore),"#00e676"],["Avg Hourly Rate","$"+selected.avgRate,"#f0c040"],["Top Category",selected.top,"#a78bfa"]].map(([l,v,c],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<3?"1px solid rgba(26,107,255,0.06)":"none"}}>
                    <span style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem"}}>{l}</span>
                    <span style={{fontWeight:800,color:c,fontSize:"0.92rem"}}>{v}</span>
                  </div>
                ))}
                <button style={{width:"100%",marginTop:14,padding:"10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:9,color:"#4da6ff",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"}}>Browse Talent in {selected.name} →</button>
              </div>

              {/* Region ranking */}
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:16}}>
                <div style={{fontWeight:800,marginBottom:10,fontSize:"0.85rem"}}>All Regions</div>
                {[...REGIONS].sort((a,b)=>b.workers-a.workers).map((r,i)=>(
                  <div key={i} onClick={()=>setSelected(r)} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",cursor:"pointer",borderBottom:i<REGIONS.length-1?"1px solid rgba(26,107,255,0.06)":"none"}}>
                    <span style={{fontSize:"0.8rem",color:selected.name===r.name?"#4da6ff":"rgba(255,255,255,0.6)",fontWeight:selected.name===r.name?700:400}}>{r.name}</span>
                    <span style={{fontSize:"0.78rem",fontWeight:700,color:"rgba(255,255,255,0.4)"}}>{r.workers.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
