
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Zap, Briefcase, DollarSign, Clock, CheckCircle2, Shield, Loader2, ArrowRight, Sparkles, Star } from "lucide-react";

const QUEUE = [
  {id:"JB-4510",title:"Senior Next.js Developer",client:"StartupX Labs",    budget:"$12,000",match:99,skills:["Next.js","TypeScript"],deadline:"3d",proposals:4, urgent:true},
  {id:"JB-4509",title:"React + Node Full-Stack",  client:"FinTech Ventures", budget:"$18,000",match:97,skills:["React","Node.js"],    deadline:"5d",proposals:7, urgent:false},
  {id:"JB-4507",title:"React Native App Phase 2", client:"Bloom Health",     budget:"$15,000",match:94,skills:["React Native","Expo"], deadline:"2d",proposals:3, urgent:true},
  {id:"JB-4506",title:"API Microservices Build",  client:"CloudSync AI",     budget:"$22,000",match:91,skills:["Node.js","Docker"],    deadline:"10d",proposals:9,urgent:false},
];

const TEMPLATE = `Hi,

I've reviewed your project and I'm confident I can deliver exactly what you need. My background in [skill] combined with my verified track record on Veritas (94 completed jobs, 100% on-time delivery, Trust Score 845) makes me an ideal fit.

I'd propose a milestone-based approach with clear deliverables at each stage, all protected by Veritas escrow.

Happy to jump on a quick call to discuss — I'm available immediately.

Best,
Scott`;

export default function QuickApplyPage() {
  const [queue, setQueue]       = useState(QUEUE);
  const [current, setCurrent]   = useState(0);
  const [proposal, setProposal] = useState(TEMPLATE);
  const [rate, setRate]         = useState("150");
  const [timeline, setTimeline] = useState("2-3 weeks");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied]   = useState<string[]>([]);
  const [generating, setGen]    = useState(false);

  const job = queue[current];
  if(!job) return(
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/><div style={{flex:1,display:"flex",flexDirection:"column"}}><TopBar/>
      <main style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"white",padding:24}}>
        <div style={{textAlign:"center"}}>
          <CheckCircle2 size={56} color="#00e676" style={{margin:"0 auto 16px"}}/>
          <div style={{fontSize:"1.6rem",fontWeight:900,marginBottom:6}}>All caught up!</div>
          <div style={{color:"rgba(255,255,255,0.45)"}}>You've applied to all queued jobs. Check back soon for new matches.</div>
        </div>
      </main></div>
    </div>
  );

  function generateAI(){
    setGen(true);
    setTimeout(()=>{
      setProposal(`Hi,

I just reviewed your ${job.title} listing and I'm very interested — it aligns perfectly with my core specialties.

I've built ${job.skills.join(" and ")} applications for clients ranging from early-stage startups to enterprise SaaS platforms. My most recent comparable project delivered a ${job.budget} solution 5 days ahead of schedule with a 5-star review.

My proposal:
• Milestone 1: Project setup, architecture, core scaffolding (${Math.round(parseInt(job.budget.replace(/\D/g,""))*0.25).toLocaleString()})
• Milestone 2: Core feature development + testing (${Math.round(parseInt(job.budget.replace(/\D/g,""))*0.5).toLocaleString()})
• Milestone 3: Final polish, deployment, handoff (${Math.round(parseInt(job.budget.replace(/\D/g,""))*0.25).toLocaleString()})

All milestones protected by Veritas escrow. Ready to start immediately.

Scott`);
      setGen(false);
    },1500);
  }

  function apply(){
    setApplying(true);
    setTimeout(()=>{
      setApplied(p=>[...p,job.id]);
      setApplying(false);
      setProposal(TEMPLATE);
      if(current<queue.length-1) setCurrent(c=>c+1);
      else setCurrent(queue.length);
    },1200);
  }

  function skip(){ if(current<queue.length-1) setCurrent(c=>c+1); else setCurrent(queue.length); }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <Zap size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Quick Apply</h1>
            <div style={{marginLeft:8,fontSize:"0.78rem",color:"rgba(255,255,255,0.4)"}}>Job {current+1} of {queue.length}</div>
          </div>

          {/* Progress */}
          <div style={{height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden",marginBottom:20}}>
            <div style={{width:`${((current)/queue.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#00e676)",borderRadius:2,transition:"width 0.4s"}}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 420px",gap:20}}>
            {/* Job detail */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"rgba(4,15,36,0.95)",border:`1px solid ${job.urgent?"rgba(240,192,64,0.25)":"rgba(26,107,255,0.18)"}`,borderRadius:18,padding:22}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:14}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontWeight:900,fontSize:"1.15rem"}}>{job.title}</span>
                      {job.urgent&&<span style={{fontSize:"0.62rem",padding:"2px 8px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:5,color:"#f0c040",fontWeight:800}}>⚡ URGENT</span>}
                    </div>
                    <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)"}}>{job.client}</div>
                  </div>
                  <div style={{textAlign:"center",flexShrink:0}}>
                    <div style={{fontSize:"2.2rem",fontWeight:900,color:"#f0c040",lineHeight:1}}>{job.match}%</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>AI Match</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
                  {[[job.budget,"Budget"],[`${job.deadline} left`,"Deadline"],[`${job.proposals} proposals`,"Competition"]].map(([v,l],i)=>(
                    <div key={i} style={{padding:"10px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9,textAlign:"center"}}>
                      <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:2}}>{v}</div>
                      <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:6}}>
                  {job.skills.map(s=><span key={s} style={{padding:"4px 11px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:7,fontSize:"0.75rem",color:"#4da6ff",fontWeight:600}}>{s}</span>)}
                </div>
              </div>

              {/* Rate + Timeline */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{l:"Your Rate ($/hr)",v:rate,set:setRate,t:"number",p:"150"},{l:"Timeline",v:timeline,set:setTimeline,t:"text",p:"2-3 weeks"}].map((f,i)=>(
                  <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:12,padding:"14px 16px"}}>
                    <label style={{fontSize:"0.65rem",fontWeight:700,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>{f.l}</label>
                    <input value={f.v} onChange={e=>f.set(e.target.value)} type={f.t} placeholder={f.p} style={{width:"100%",padding:"9px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:8,color:"white",fontSize:"0.95rem",fontWeight:700,outline:"none"}}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposal editor */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:16,padding:18,flex:1,display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Proposal</label>
                  <button onClick={generateAI} disabled={generating} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",background:"rgba(240,192,64,0.1)",border:"1px solid rgba(240,192,64,0.25)",borderRadius:7,color:"#f0c040",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",opacity:generating?0.6:1}}>
                    {generating?<Loader2 size={12} style={{animation:"spin 1s linear infinite"}}/>:<Sparkles size={12}/>} AI Write
                  </button>
                </div>
                <textarea value={proposal} onChange={e=>setProposal(e.target.value)} rows={16} style={{flex:1,padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:10,color:"rgba(255,255,255,0.85)",fontSize:"0.83rem",outline:"none",resize:"none",lineHeight:1.65,fontFamily:"inherit"}}/>
              </div>
              <div style={{display:"flex",gap:9}}>
                <button onClick={skip} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:"0.85rem"}}>Skip →</button>
                <button onClick={apply} disabled={applying} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 18px rgba(26,107,255,0.4)",opacity:applying?0.7:1}}>
                  {applying?<Loader2 size={17} style={{animation:"spin 1s linear infinite"}}/>:<Zap size={17}/>}{applying?"Applying...":"Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
