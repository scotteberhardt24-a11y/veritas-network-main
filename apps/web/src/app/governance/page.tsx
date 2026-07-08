
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Vote, Shield, Scale, Clock, CheckCircle2, AlertTriangle, Loader2, Lock, Users, Award, TrendingUp } from "lucide-react";

const PROPOSALS = [
  {id:"VIP-012",title:"Reduce platform fee to 1.5% for workers with Trust Score 900+",category:"Fees",status:"active",votesFor:1847,votesAgainst:342,quorum:2000,ends:"3d 14h",description:"High-trust workers drive the most value. Rewarding them with a lower fee tier incentivizes quality and retention.",impact:"Reduces fee income ~$42K/mo but projected to increase worker retention by 23%"},
  {id:"VIP-011",title:"Add 5-judge panels for disputes over $10,000",category:"Disputes",status:"active",votesFor:2103,votesAgainst:187,quorum:2000,ends:"5d 2h",description:"High-value disputes deserve more oversight. 5-judge panels reduce bias and increase confidence in outcomes.",impact:"Affects ~3% of disputes. Longer resolution (+2 days avg) but higher satisfaction scores."},
  {id:"VIP-010",title:"Launch Veritas Retirement Pool — 1% of platform fees",category:"Benefits",status:"passed",votesFor:3241,votesAgainst:198,quorum:2000,ends:"Ended",description:"Allocate 1% of all platform fees to a community retirement pool distributed quarterly.",impact:"Estimated $18,000 distributed in Q1 2027 based on current volume."},
  {id:"VIP-009",title:"Mandatory 24-hour response guarantee — auto-decline penalty",category:"Standards",status:"passed",votesFor:2891,votesAgainst:441,quorum:2000,ends:"Ended",description:"Workers who don't respond within 24 hours get auto-declined and a -5 Trust Score penalty.",impact:"Response rates improved from 71% to 94% in pilot group."},
];

const JUDGES = [
  {name:"Alex Chen",     score:990,cases:47,accuracy:"96%",specialty:"Development"},
  {name:"Maya Rodriguez",score:980,cases:38,accuracy:"94%",specialty:"Design"},
  {name:"James Park",    score:970,cases:61,accuracy:"98%",specialty:"Writing"},
  {name:"Priya Sharma",  score:960,cases:29,accuracy:"93%",specialty:"Development"},
];

export default function GovernancePage() {
  const [tab,setTab]       = useState("proposals");
  const [selected,setSel]  = useState(PROPOSALS[0]);
  const [voting,setVoting] = useState<string|null>(null);
  const [voted,setVoted]   = useState<Record<string,string>>({});
  const [applying,setApp]  = useState(false);
  const [applied,setApplied] = useState(false);
  const trustScore = 845;
  const canJudge = trustScore >= 800;

  function vote(id:string,choice:string){
    setVoting(id+choice);
    setTimeout(()=>{setVoted(p=>({...p,[id]:choice}));setVoting(null);},900);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.15) 1px,transparent 1px)",backgroundSize:"24px 24px",opacity:0.15}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><Vote size={32} color="#1a6bff"/><h1 style={{fontSize:"2rem",fontWeight:900,margin:0}}>Veritas Governance</h1></div>
              <p style={{color:"rgba(255,255,255,0.5)",margin:"0 0 16px",fontSize:"0.92rem",lineHeight:1.65,maxWidth:600}}>Platform decisions are made by the community. Every verified member votes. High Trust Score members can become dispute judges and earn $USDC rewards.</p>
              <div style={{display:"flex",gap:12}}>
                {[["Active Votes","2","#f0c040"],["Total Voters","12,847","#4da6ff"],["Proposals Passed","2","#00e676"]].map(([l,v,c],i)=>(
                  <div key={i} style={{padding:"10px 16px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:10,textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem",fontWeight:900,color:c,lineHeight:1,marginBottom:2}}>{v}</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.4)"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {[["proposals","📋 Proposals"],["judges","⚖️ Active Judges"],["apply","🙋 Become a Judge"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 20px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{l}</button>
            ))}
          </div>

          {tab==="proposals"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20}}>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {PROPOSALS.map(p=>{
                  const pct=Math.round((p.votesFor/(p.votesFor+p.votesAgainst))*100);
                  const myVote=voted[p.id];
                  const isActive=p.status==="active";
                  return(
                    <div key={p.id} onClick={()=>setSel(p)} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${selected.id===p.id?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,borderRadius:14,padding:18,cursor:"pointer"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
                        <div>
                          <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                            <span style={{fontSize:"0.6rem",fontFamily:"monospace",color:"rgba(255,255,255,0.35)"}}>{p.id}</span>
                            <span style={{fontSize:"0.62rem",padding:"2px 7px",borderRadius:5,fontWeight:700,background:p.status==="active"?"rgba(240,192,64,0.1)":p.status==="passed"?"rgba(0,200,83,0.1)":"rgba(255,85,85,0.1)",color:p.status==="active"?"#f0c040":p.status==="passed"?"#00e676":"#ff5555"}}>{p.status==="active"?"🗳 ACTIVE":p.status==="passed"?"✅ PASSED":"❌ REJECTED"}</span>
                            <span style={{fontSize:"0.62rem",padding:"2px 7px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:5,color:"rgba(255,255,255,0.5)"}}>{p.category}</span>
                          </div>
                          <div style={{fontWeight:700,fontSize:"0.9rem",lineHeight:1.4}}>{p.title}</div>
                        </div>
                        {isActive&&<div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",gap:4,flexShrink:0}}><Clock size={11}/>Ends {p.ends}</div>}
                      </div>
                      <div style={{marginBottom:isActive&&!myVote?10:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.67rem",marginBottom:4}}>
                          <span style={{color:"#00e676",fontWeight:700}}>✓ {p.votesFor.toLocaleString()}</span>
                          <span style={{color:"#ff5555",fontWeight:700}}>✗ {p.votesAgainst.toLocaleString()}</span>
                        </div>
                        <div style={{height:5,background:"rgba(255,85,85,0.2)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:"#00e676",borderRadius:3}}/>
                        </div>
                        <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.3)",marginTop:3}}>{pct}% approval · {(p.votesFor+p.votesAgainst).toLocaleString()}/{p.quorum.toLocaleString()} quorum</div>
                      </div>
                      {isActive&&!myVote&&(
                        <div style={{display:"flex",gap:7}}>
                          <button onClick={e=>{e.stopPropagation();vote(p.id,"for");}} disabled={!!voting} style={{flex:1,padding:"8px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.25)",borderRadius:8,color:"#00e676",fontWeight:700,fontSize:"0.75rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                            {voting===p.id+"for"?<Loader2 size={11} style={{animation:"spin 1s linear infinite"}}/>:<CheckCircle2 size={11}/>}Vote For
                          </button>
                          <button onClick={e=>{e.stopPropagation();vote(p.id,"against");}} disabled={!!voting} style={{flex:1,padding:"8px",background:"rgba(255,85,85,0.08)",border:"1px solid rgba(255,85,85,0.2)",borderRadius:8,color:"#ff5555",fontWeight:700,fontSize:"0.75rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                            {voting===p.id+"against"?<Loader2 size={11} style={{animation:"spin 1s linear infinite"}}/>:<AlertTriangle size={11}/>}Vote Against
                          </button>
                        </div>
                      )}
                      {myVote&&<div style={{fontSize:"0.72rem",color:myVote==="for"?"#00e676":"#ff5555",fontWeight:700,display:"flex",alignItems:"center",gap:4}}><CheckCircle2 size={12}/>Voted {myVote==="for"?"in favor":"against"}</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:16,padding:20,height:"fit-content"}}>
                <div style={{fontWeight:900,fontSize:"0.95rem",marginBottom:8}}>{selected.title}</div>
                <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.55)",lineHeight:1.7,marginBottom:10}}>{selected.description}</div>
                <div style={{padding:10,background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9,marginBottom:12}}>
                  <div style={{fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Projected Impact</div>
                  <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{selected.impact}</div>
                </div>
                <div style={{padding:12,background:"rgba(240,192,64,0.05)",border:"1px solid rgba(240,192,64,0.15)",borderRadius:10,fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",lineHeight:1.65}}>
                  <strong style={{color:"#f0c040"}}>Your Voting Power:</strong><br/>Trust Score {trustScore} → <strong style={{color:"#f0c040"}}>1.69x weight</strong>
                </div>
              </div>
            </div>
          )}

          {tab==="judges"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{padding:14,background:"rgba(240,192,64,0.06)",border:"1px solid rgba(240,192,64,0.2)",borderRadius:12,fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",lineHeight:1.65,marginBottom:4}}>
                <strong style={{color:"#f0c040"}}>⚖️ How it works:</strong> When a dispute is filed, 3 judges are randomly selected. They review evidence from both parties, vote, and majority rules. Judges earn <strong style={{color:"#00e676"}}>+5 Trust Score</strong> and <strong style={{color:"#00e676"}}>$5 USDC</strong> per resolved case.
              </div>
              {JUDGES.map((j,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1rem",flexShrink:0}}>{j.name[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:"0.9rem",marginBottom:2,display:"flex",alignItems:"center",gap:6}}>{j.name}<Shield size={12} color="#1a6bff"/></div>
                    <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{j.specialty} · {j.cases} cases</div>
                  </div>
                  {[["Trust Score",j.score,"#00e676"],["Accuracy",j.accuracy,"#f0c040"],["Cases",j.cases,"#4da6ff"]].map(([l,v,c],i)=>(
                    <div key={i} style={{textAlign:"center",minWidth:60}}>
                      <div style={{fontWeight:800,color:c,fontSize:"0.9rem"}}>{v}</div>
                      <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)"}}>{l}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab==="apply"&&(
            <div style={{maxWidth:560}}>
              {!canJudge?(
                <div style={{padding:24,background:"rgba(255,85,85,0.06)",border:"1px solid rgba(255,85,85,0.2)",borderRadius:16,textAlign:"center"}}>
                  <Lock size={36} color="#ff5555" style={{margin:"0 auto 12px"}}/>
                  <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:8}}>Trust Score Too Low</div>
                  <div style={{color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>Need <strong style={{color:"#f0c040"}}>800+</strong> to apply. Your score: <strong style={{color:"#ff5555"}}>{trustScore}</strong>. Complete more jobs to qualify.</div>
                </div>
              ):applied?(
                <div style={{padding:32,background:"rgba(0,200,83,0.06)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:16,textAlign:"center"}}>
                  <CheckCircle2 size={48} color="#00e676" style={{margin:"0 auto 14px"}}/>
                  <div style={{fontWeight:900,fontSize:"1.2rem",marginBottom:6}}>Application Submitted!</div>
                  <div style={{color:"rgba(255,255,255,0.5)"}}>We'll notify you when you're activated as a judge. Expected: 2–5 business days.</div>
                </div>
              ):(
                <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:18,padding:24}}>
                  <h2 style={{fontSize:"1.3rem",fontWeight:900,marginBottom:8}}>Apply to be a Dispute Judge</h2>
                  <p style={{color:"rgba(255,255,255,0.5)",marginBottom:18,lineHeight:1.7,fontSize:"0.87rem"}}>Review evidence, vote on outcomes, earn $USDC + Trust Score points for every resolved case.</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                    {[["Your Trust Score",`${trustScore} ✓`,"#00e676"],["Earning per case","$5 USDC + 5 Trust pts","#f0c040"],["Time per case","~30 minutes","rgba(255,255,255,0.6)"]].map(([l,v,c],i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9,fontSize:"0.85rem"}}>
                        <span style={{color:"rgba(255,255,255,0.5)"}}>{l}</span><span style={{fontWeight:700,color:c}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Why do you want to be a judge?</label>
                    <textarea rows={3} placeholder="Brief statement about your experience and commitment to fair dispute resolution..." style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:10,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.6}}/>
                  </div>
                  <button onClick={()=>{setApp(true);setTimeout(()=>{setApp(false);setApplied(true);},1200);}} disabled={applying} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.92rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 18px rgba(26,107,255,0.35)"}}>
                    {applying?<><Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>Submitting...</>:<><Scale size={15}/>Apply to be a Judge</>}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
