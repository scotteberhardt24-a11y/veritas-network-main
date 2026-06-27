
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Vote, Plus, CheckCircle2, XCircle, Clock, Coins, Users, Shield, Loader2, X, AlertCircle, BarChart3 } from "lucide-react";

const PROPOSALS = [
  { id:"VIP-042", title:"Reduce Platform Fee to 1.5% for Trust Score 900+", category:"Economics", status:"active",   proposer:"Alex Chen",   for:8420,  against:2130, abstain:450,  quorum:75, deadline:"Jul 22", impact:"Est. $240K annual fee reduction", myVote:null   },
  { id:"VIP-041", title:"Expand Dispute Panel from 3 to 5 Arbitrators",     category:"Governance",status:"active",   proposer:"Priya Sharma",for:11200, against:890,  abstain:320,  quorum:85, deadline:"Jul 19", impact:"Affects all dispute resolutions", myVote:null   },
  { id:"VIP-040", title:"Launch Veritas Grants Program ($500K Treasury)",   category:"Treasury",  status:"passed",   proposer:"Maya Rodriguez",for:14800,against:1200,abstain:600, quorum:90, deadline:"Jul 10", impact:"$500K for 20+ projects",          myVote:"for"  },
  { id:"VIP-039", title:"Mandatory Video Verification for $10K+ Contracts", category:"Security",  status:"failed",   proposer:"James Park",  for:4200,  against:9100, abstain:800,  quorum:65, deadline:"Jul 5",  impact:"~15% of contracts affected",     myVote:"against"},
];

const STATUS_META:Record<string,{color:string;bg:string;label:string}> = {
  active: {color:"#f0c040",bg:"rgba(240,192,64,0.1)",label:"Voting Active"},
  passed: {color:"#00e676",bg:"rgba(0,200,83,0.1)",  label:"Passed"},
  failed: {color:"#ff5555",bg:"rgba(255,85,85,0.1)", label:"Failed"},
};

export default function DAOv2Page() {
  const [proposals, setProposals] = useState(PROPOSALS);
  const [filter, setFilter]       = useState<"all"|"active"|"passed"|"failed">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle]   = useState("");
  const [newDesc, setNewDesc]     = useState("");
  const [newCat, setNewCat]       = useState("Governance");
  const [voting, setVoting]       = useState<string|null>(null);
  const myPower = 94;

  function vote(id:string, choice:"for"|"against"|"abstain") {
    setVoting(id+choice);
    setTimeout(()=>{
      setProposals(p=>p.map(pr=>{
        if(pr.id!==id) return pr;
        const u={...pr,myVote:choice};
        if(choice==="for") u.for+=myPower;
        else if(choice==="against") u.against+=myPower;
        else u.abstain+=myPower;
        return u;
      }));
      setVoting(null);
    },800);
  }

  const filtered = filter==="all" ? proposals : proposals.filter(p=>p.status===filter);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Vote size={28} color="#1a6bff"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>DAO Governance</h1>
            </div>
            <button onClick={()=>setShowCreate(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
              <Plus size={17}/> Submit Proposal
            </button>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {icon:<Vote size={20}/>,   label:"Active Votes",    value:proposals.filter(p=>p.status==="active").length, color:"#f0c040"},
              {icon:<Shield size={20}/>, label:"Your Voting Power",value:`${myPower} VP`,   color:"#4da6ff"},
              {icon:<Coins size={20}/>,  label:"Treasury",        value:"$4.2M",            color:"#00e676"},
              {icon:<Users size={20}/>,  label:"DAO Members",     value:"8,241",            color:"#00d4ff"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div style={{display:"flex",gap:7,marginBottom:16}}>
            {(["all","active","passed","failed"] as const).map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${filter===f?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:filter===f?"rgba(26,107,255,0.12)":"transparent",color:filter===f?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{f}</button>
            ))}
          </div>

          {/* Proposals */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {filtered.map(p=>{
              const total = p.for+p.against+p.abstain;
              const forPct = total?Math.round((p.for/total)*100):0;
              const agtPct = total?Math.round((p.against/total)*100):0;
              const meta   = STATUS_META[p.status];
              return(
                <div key={p.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:18,padding:22}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:12}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:"0.62rem",fontFamily:"monospace",color:"rgba(255,255,255,0.3)"}}>{p.id}</span>
                        <span style={{fontSize:"0.62rem",padding:"2px 7px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:5,color:"#4da6ff"}}>{p.category}</span>
                        <span style={{fontSize:"0.65rem",padding:"3px 9px",borderRadius:7,fontWeight:700,background:meta.bg,color:meta.color,border:`1px solid ${meta.color}33`}}>{meta.label}</span>
                      </div>
                      <div style={{fontWeight:800,fontSize:"1rem",lineHeight:1.35,marginBottom:5}}>{p.title}</div>
                      <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.38)"}}>Proposed by {p.proposer}{p.status==="active"?` · Ends ${p.deadline}`:""}</div>
                      <div style={{fontSize:"0.7rem",color:"#f0c040",marginTop:3}}>⚡ {p.impact}</div>
                    </div>
                  </div>

                  {total>0&&(
                    <div style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.72rem",marginBottom:4}}>
                        <span style={{color:"#00e676",fontWeight:600}}>For: {forPct}% ({p.for.toLocaleString()} VP)</span>
                        <span style={{color:"rgba(255,255,255,0.35)"}}>Quorum: {p.quorum}%</span>
                        <span style={{color:"#ff5555",fontWeight:600}}>Against: {agtPct}% ({p.against.toLocaleString()} VP)</span>
                      </div>
                      <div style={{height:10,borderRadius:5,background:"rgba(26,107,255,0.08)",overflow:"hidden",display:"flex"}}>
                        <div style={{width:`${forPct}%`,background:"#00e676",transition:"width 0.6s"}}/>
                        <div style={{width:`${total?Math.round((p.abstain/total)*100):0}%`,background:"rgba(255,255,255,0.15)"}}/>
                        <div style={{width:`${agtPct}%`,background:"#ff5555",transition:"width 0.6s"}}/>
                      </div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",marginTop:4}}>{total.toLocaleString()} total votes</div>
                    </div>
                  )}

                  {p.status==="active"&&!p.myVote&&(
                    <div style={{display:"flex",gap:9}}>
                      {(["for","against","abstain"] as const).map(choice=>(
                        <button key={choice} onClick={()=>vote(p.id,choice)} disabled={!!voting} style={{
                          flex:1,padding:"10px",borderRadius:10,fontWeight:700,fontSize:"0.8rem",cursor:"pointer",textTransform:"capitalize",transition:"all 0.15s",
                          background:choice==="for"?"rgba(0,200,83,0.1)":choice==="against"?"rgba(255,85,85,0.1)":"rgba(255,255,255,0.04)",
                          border:`1px solid ${choice==="for"?"rgba(0,200,83,0.3)":choice==="against"?"rgba(255,85,85,0.3)":"rgba(255,255,255,0.1)"}`,
                          color:choice==="for"?"#00e676":choice==="against"?"#ff5555":"rgba(255,255,255,0.4)",
                          opacity:voting?0.5:1,
                        }}>
                          {voting===p.id+choice?<Loader2 size={14} style={{animation:"spin 1s linear infinite",display:"inline"}}/>:choice==="for"?"✓ For":choice==="against"?"✗ Against":"~ Abstain"}
                        </button>
                      ))}
                    </div>
                  )}
                  {p.myVote&&(
                    <div style={{display:"flex",alignItems:"center",gap:7,fontSize:"0.82rem",fontWeight:700,color:p.myVote==="for"?"#00e676":p.myVote==="against"?"#ff5555":"rgba(255,255,255,0.4)"}}>
                      <CheckCircle2 size={16}/>Voted {p.myVote} with {myPower} VP
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showCreate&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:500,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>Submit a Proposal</div>
                  <button onClick={()=>setShowCreate(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                <div style={{padding:11,background:"rgba(240,192,64,0.07)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:10,display:"flex",gap:8,marginBottom:16,fontSize:"0.78rem",color:"rgba(255,255,255,0.55)"}}>
                  <AlertCircle size={14} color="#f0c040" style={{flexShrink:0,marginTop:1}}/> Requires Trust Score 750+ and 30 days on platform. Proposals need 5% quorum to proceed to vote.
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:18}}>
                  <div>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Category</label>
                    <select value={newCat} onChange={e=>setNewCat(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}>
                      {["Governance","Economics","Security","Feature","Treasury","Community"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Proposal Title</label>
                    <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Clear, specific title describing the change..." style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Description & Impact</label>
                    <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} rows={4} placeholder="What it changes, why it's needed, and expected impact..." style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.55}}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setShowCreate(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                  <button onClick={()=>setShowCreate(false)} disabled={!newTitle||!newDesc} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!newTitle||!newDesc?0.4:1}}>Submit for Review</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
