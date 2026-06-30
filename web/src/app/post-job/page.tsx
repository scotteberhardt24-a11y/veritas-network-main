
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { CheckCircle2, ChevronRight, Plus, X, Sparkles, Loader2, Shield, Lock, Zap, AlertCircle } from "lucide-react";

const STEPS = ["Job Details","Skills & Scope","Budget & Timeline","Review & Post"];
const CATS   = [["💻","Development"],["🎨","Design"],["✍️","Writing"],["📈","Marketing"],["🎬","Video"],["🤝","Consulting"],["📊","Data"],["⚡","Other"]];
const BUDGETS= ["Under $1,000","$1,000–$5,000","$5,000–$20,000","$20,000–$50,000","$50,000+"];
const DURS   = ["< 1 week","1–4 weeks","1–3 months","3–6 months","Ongoing"];

export default function JobWizardPage() {
  const router = useRouter();
  const [step, setStep]         = useState(0);
  const [title, setTitle]       = useState("");
  const [cat, setCat]           = useState("");
  const [desc, setDesc]         = useState("");
  const [skills, setSkills]     = useState<string[]>([]);
  const [si, setSi]             = useState("");
  const [budget, setBudget]     = useState("");
  const [dur, setDur]           = useState("");
  const [milestones, setMs]     = useState("3");
  const [urgent, setUrgent]     = useState(false);
  const [escrow, setEscrow]     = useState(true);
  const [posting, setPosting]   = useState(false);
  const [posted, setPosted]     = useState(false);
  const [aiSuggesting, setAiSug]= useState(false);
  const [aiSkills, setAiSkills] = useState<string[]>([]);

  function addSkill(){ if(si.trim()&&!skills.includes(si.trim())){setSkills(p=>[...p,si.trim()]);setSi("");}  }

  async function suggestSkills() {
    if(!cat||!desc) return;
    setAiSug(true);
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`For a ${cat} freelance job described as: "${desc.slice(0,300)}" — list exactly 6 specific technical skills required. Return ONLY a JSON array of strings, nothing else. Example: ["React","TypeScript","PostgreSQL","Stripe API","Vercel","Prisma"]`}]})
    });
    const data = await res.json();
    try {
      const text = data.content?.[0]?.text||"[]";
      const parsed = JSON.parse(text.match(/\[.*\]/s)?.[0]||"[]");
      setAiSkills(parsed.slice(0,6));
    } catch { setAiSkills(["React","TypeScript","Node.js","PostgreSQL","Tailwind","AWS"]); }
    setAiSug(false);
  }

  function post() {
    setPosting(true);
    setTimeout(()=>{ setPosting(false); setPosted(true); setTimeout(()=>router.push("/jobs"),2500); },1600);
  }

  const valid = [
    title.length>5 && cat,
    desc.length>30 && skills.length>0,
    budget && dur,
    true,
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Sparkles size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Post a Job</h1>
          </div>

          {/* Stepper */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:28,overflowX:"auto",paddingBottom:4}}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:12,fontSize:"0.82rem",fontWeight:700,
                  background:step===i?"rgba(26,107,255,0.15)":step>i?"rgba(0,200,83,0.08)":"transparent",
                  border:step===i?"1px solid rgba(26,107,255,0.4)":step>i?"1px solid rgba(0,200,83,0.2)":"1px solid transparent",
                  color:step===i?"#4da6ff":step>i?"#00e676":"rgba(255,255,255,0.3)"}}>
                  {step>i?<CheckCircle2 size={14}/>:<span style={{width:18,height:18,borderRadius:"50%",border:"1.5px solid currentColor",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem"}}>{i+1}</span>}
                  {s}
                </div>
                {i<STEPS.length-1&&<ChevronRight size={14} color="rgba(255,255,255,0.2)"/>}
              </div>
            ))}
          </div>

          <div style={{maxWidth:660}}>

            {/* STEP 0 */}
            {step===0&&(
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:28}}>
                <h2 style={{fontSize:"1.2rem",fontWeight:800,marginBottom:18}}>What do you need done?</h2>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7,display:"block"}}>Job Title</label>
                  <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Build a React SaaS Dashboard with Auth & Stripe" style={{width:"100%",padding:"12px 16px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.92rem",outline:"none"}}/>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",marginTop:5}}>Specific titles attract 3x more qualified proposals</div>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7,display:"block"}}>Category</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                    {CATS.map(([ic,c])=>(
                      <button key={c} onClick={()=>setCat(c)} style={{padding:"10px 8px",background:cat===c?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.04)",border:`1px solid ${cat===c?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.1)"}`,borderRadius:10,cursor:"pointer",textAlign:"center"}}>
                        <div style={{fontSize:"1.3rem",marginBottom:3}}>{ic}</div>
                        <div style={{fontSize:"0.68rem",fontWeight:700,color:cat===c?"#4da6ff":"rgba(255,255,255,0.55)"}}>{c}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  {[{l:"Public 🌍",d:"All verified workers",v:"public"},{l:"Invite Only 🔒",d:"Hand-pick workers",v:"invite"}].map(b=>(
                    <div key={b.v} style={{flex:1,padding:"12px 14px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10,cursor:"pointer"}}>
                      <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:2}}>{b.l}</div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{b.d}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setStep(1)} disabled={!title||!cat} style={{width:"100%",marginTop:20,padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.92rem",cursor:"pointer",opacity:!title||!cat?0.4:1}}>Continue →</button>
              </div>
            )}

            {/* STEP 1 */}
            {step===1&&(
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:28}}>
                <h2 style={{fontSize:"1.2rem",fontWeight:800,marginBottom:18}}>Skills & Project Scope</h2>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7,display:"block"}}>Full Description</label>
                  <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={6} placeholder={"Describe the project in detail:\n• What needs to be built / created\n• Deliverables you expect\n• Tech stack or tool preferences\n• Resources you will provide"} style={{width:"100%",padding:"12px 16px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.6}}/>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",marginTop:4}}>{desc.length}/2000 characters</div>
                </div>
                <div style={{marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                    <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Required Skills</label>
                    <button onClick={suggestSkills} disabled={!desc||!cat||aiSuggesting} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:"rgba(240,192,64,0.1)",border:"1px solid rgba(240,192,64,0.25)",borderRadius:7,color:"#f0c040",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",opacity:!desc||!cat?0.4:1}}>
                      {aiSuggesting?<Loader2 size={12} style={{animation:"spin 1s linear infinite"}}/>:<Sparkles size={12}/>} AI Suggest
                    </button>
                  </div>
                  {aiSkills.length>0&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8,padding:10,background:"rgba(240,192,64,0.05)",border:"1px solid rgba(240,192,64,0.15)",borderRadius:9}}>
                      <div style={{width:"100%",fontSize:"0.65rem",color:"#f0c040",fontWeight:700,marginBottom:4}}>⚡ AI Suggested:</div>
                      {aiSkills.map(s=>(
                        <button key={s} onClick={()=>!skills.includes(s)&&setSkills(p=>[...p,s])} style={{padding:"4px 10px",background:skills.includes(s)?"rgba(0,200,83,0.12)":"rgba(240,192,64,0.08)",border:`1px solid ${skills.includes(s)?"rgba(0,200,83,0.3)":"rgba(240,192,64,0.2)"}`,borderRadius:6,color:skills.includes(s)?"#00e676":"#f0c040",fontSize:"0.72rem",cursor:"pointer",fontWeight:600}}>
                          {skills.includes(s)?"✓ ":""}{s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{display:"flex",gap:8,marginBottom:8}}>
                    <input value={si} onChange={e=>setSi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()} placeholder="Add a skill..." style={{flex:1,padding:"10px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                    <button onClick={addSkill} style={{padding:"10px 16px",background:"rgba(26,107,255,0.12)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:9,color:"#4da6ff",cursor:"pointer",fontWeight:700}}><Plus size={16}/></button>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {skills.map(s=>(
                      <span key={s} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:"rgba(26,107,255,0.12)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:8,fontSize:"0.78rem",color:"#4da6ff",fontWeight:600}}>
                        {s}<button onClick={()=>setSkills(p=>p.filter(x=>x!==s))} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",padding:0,lineHeight:1}}><X size={11}/></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:10,marginTop:20}}>
                  <button onClick={()=>setStep(0)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                  <button onClick={()=>setStep(2)} disabled={!desc||skills.length===0} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!desc||skills.length===0?0.4:1}}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step===2&&(
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:28}}>
                <h2 style={{fontSize:"1.2rem",fontWeight:800,marginBottom:18}}>Budget & Timeline</h2>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7,display:"block"}}>Budget Range</label>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {BUDGETS.map(b=>(
                      <button key={b} onClick={()=>setBudget(b)} style={{padding:"11px 16px",textAlign:"left",background:budget===b?"rgba(26,107,255,0.12)":"rgba(26,107,255,0.04)",border:`1px solid ${budget===b?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:9,color:budget===b?"#4da6ff":"rgba(255,255,255,0.6)",fontWeight:budget===b?700:500,fontSize:"0.88rem",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        {b}{budget===b&&<CheckCircle2 size={14} color="#00e676"/>}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7,display:"block"}}>Duration</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
                    {DURS.map(d=>(
                      <button key={d} onClick={()=>setDur(d)} style={{padding:"10px",background:dur===d?"rgba(26,107,255,0.12)":"rgba(26,107,255,0.04)",border:`1px solid ${dur===d?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:9,color:dur===d?"#4da6ff":"rgba(255,255,255,0.55)",fontWeight:600,fontSize:"0.76rem",cursor:"pointer"}}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:16,marginBottom:6}}>
                  {[{l:"⚡ Mark Urgent",d:"Responses within 4h",v:urgent,set:()=>setUrgent(!urgent),c:"#f0c040"},
                    {l:"🔒 Require Escrow",d:"Recommended for trust",v:escrow,set:()=>setEscrow(!escrow),c:"#00e676"}].map((t,i)=>(
                    <label key={i} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flex:1}} onClick={t.set}>
                      <div style={{width:40,height:22,borderRadius:11,background:t.v?i===0?"#f0c040":"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                        <span style={{position:"absolute",top:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",left:t.v?21:3}}/>
                      </div>
                      <div>
                        <div style={{fontSize:"0.82rem",fontWeight:700,color:t.v?t.c:"rgba(255,255,255,0.7)"}}>{t.l}</div>
                        <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>{t.d}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,marginTop:20}}>
                  <button onClick={()=>setStep(1)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                  <button onClick={()=>setStep(3)} disabled={!budget||!dur} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!budget||!dur?0.4:1}}>Review Job →</button>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step===3&&(
              posted?(
                <div style={{textAlign:"center",padding:48,background:"rgba(4,15,36,0.95)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:20}}>
                  <CheckCircle2 size={52} color="#00e676" style={{margin:"0 auto 14px"}}/>
                  <div style={{fontSize:"1.6rem",fontWeight:900,marginBottom:6}}>Job Posted!</div>
                  <div style={{color:"rgba(255,255,255,0.45)",fontSize:"0.9rem"}}>AI is matching qualified workers now. Redirecting...</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:24}}>
                    <h2 style={{fontSize:"1.1rem",fontWeight:800,marginBottom:16}}>Review Your Posting</h2>
                    {[["Title",title],["Category",cat],["Budget",budget],["Duration",dur],["Skills",skills.join(", ")],["Escrow",escrow?"✓ Required":"Not required"],["Urgent",urgent?"⚡ Yes":"No"]].map(([l,v],i)=>(
                      <div key={i} style={{display:"flex",gap:16,padding:"10px 0",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                        <span style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",width:80,flexShrink:0,paddingTop:2}}>{l}</span>
                        <span style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.8)"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:14,background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:12,display:"flex",alignItems:"flex-start",gap:8}}>
                    <AlertCircle size={15} color="#4da6ff" style={{flexShrink:0,marginTop:1}}/>
                    <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>A 2% platform fee applies to the contract value when escrow milestones are released. No upfront charges.</div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>setStep(2)} style={{flex:1,padding:"13px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Edit</button>
                    <button onClick={post} disabled={posting} style={{flex:2,padding:"13px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:posting?0.7:1}}>
                      {posting?<><Loader2 size={18} style={{animation:"spin 1s linear infinite"}}/>Posting...</>:<><Sparkles size={18}/>Post Job & Find Talent</>}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
