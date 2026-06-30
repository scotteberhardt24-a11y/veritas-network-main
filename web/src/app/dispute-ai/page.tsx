
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Scale, Shield, CheckCircle2, Loader2, Send, AlertTriangle, Bot, FileText, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://veritas-trust-ledger-production.up.railway.app";

export default function DisputeAIPage() {
  const [step, setStep]         = useState<"select"|"analyze"|"result">("select");
  const [disputeType, setType]  = useState("");
  const [amount, setAmount]     = useState("");
  const [desc, setDesc]         = useState("");
  const [evidence, setEvidence] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [verdict, setVerdict]   = useState("");

  const TYPES = [
    {id:"nondelivery", label:"Non-Delivery",       icon:"📦", desc:"Work was not delivered as agreed"},
    {id:"quality",     label:"Quality Issue",       icon:"⚠️", desc:"Work doesn't meet the agreed standard"},
    {id:"scope",       label:"Scope Creep",         icon:"📋", desc:"Client requesting work beyond contract"},
    {id:"payment",     label:"Payment Refused",     icon:"💰", desc:"Client refusing to release escrow"},
    {id:"revision",    label:"Revision Dispute",    icon:"🔄", desc:"Disagreement on revision limits"},
  ];

  async function analyze() {
    if(!disputeType||!amount||!desc) return;
    setAnalyzing(true);
    setStep("analyze");

    const prompt = `You are the Veritas AI Arbitration System analyzing a freelance dispute. Provide a fair, structured analysis.

Dispute Type: ${disputeType}
Amount in Dispute: $${amount}
Description: ${desc}
Evidence Submitted: ${evidence||"None provided yet"}

Provide:
1. PRELIMINARY VERDICT (Likely outcome in 1-2 sentences)
2. KEY FACTORS (3-4 bullet points of what matters most here)
3. RECOMMENDED ACTION (Specific next steps for both parties)
4. RISK ASSESSMENT (For both sides if dispute escalates)
5. SETTLEMENT SUGGESTION (Proposed fair resolution)

Be specific, fair, and cite the Veritas Terms of Service where relevant. Keep response concise and actionable.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data = await res.json();
      setVerdict(data.content?.[0]?.text || "Analysis unavailable. Please contact support.");
    } catch {
      setVerdict("Unable to connect to AI arbitration. Please try again or contact support directly.");
    }
    setAnalyzing(false);
    setStep("result");
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Scale size={28} color="#1a6bff"/>
            <div>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>AI Dispute Arbitration</h1>
              <div style={{fontSize:"0.65rem",color:"#00d4ff",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:2}}>Powered by Veritas AI · 99.2% Resolution Rate</div>
            </div>
          </div>

          {/* How it works banner */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            {[["1","Submit Dispute","Describe the issue and provide evidence"],["2","AI Analysis","Our AI reviews both sides in seconds"],["3","Panel Review","3 arbitrators verify AI recommendation"],["4","Resolution","Escrow released per verdict within 48h"]].map(([n,t,d],i)=>(
              <div key={i} style={{padding:"14px 16px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:12,display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(26,107,255,0.15)",border:"1px solid rgba(26,107,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"0.8rem",color:"#4da6ff",flexShrink:0}}>{n}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:"0.82rem",marginBottom:3}}>{t}</div>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)",lineHeight:1.4}}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{maxWidth:720}}>

            {/* SELECT */}
            {step==="select"&&(
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:24}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                  <AlertTriangle size={18} color="#f0c040"/>
                  <span style={{fontWeight:800}}>Open AI-Assisted Dispute</span>
                </div>
                <div style={{padding:12,background:"rgba(240,192,64,0.06)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:10,fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",marginBottom:20,lineHeight:1.6}}>
                  ⚠️ Only open disputes for legitimate unresolved issues. Frivolous disputes impact your Trust Score. AI analysis is preliminary — the final verdict is reviewed by 3 human arbitrators.
                </div>

                <div style={{marginBottom:16}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,display:"block"}}>Dispute Type</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {TYPES.map(t=>(
                      <button key={t.id} onClick={()=>setType(t.label)} style={{padding:"12px 14px",textAlign:"left",background:disputeType===t.label?"rgba(26,107,255,0.12)":"rgba(26,107,255,0.04)",border:`1px solid ${disputeType===t.label?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:"1.1rem"}}>{t.icon}</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:"0.82rem",color:disputeType===t.label?"#4da6ff":"white"}}>{t.label}</div>
                          <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>{t.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div>
                    <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Disputed Amount ($)</label>
                    <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="0.00" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.9rem",outline:"none"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Related Contract</label>
                    <select style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.9rem",outline:"none"}}>
                      <option>ESC-8821 — SaaS Platform ($10,000)</option>
                      <option>ESC-8654 — Demo Video ($5,000)</option>
                    </select>
                  </div>
                </div>

                <div style={{marginBottom:12}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Describe the Issue</label>
                  <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4} placeholder="Explain clearly what was agreed, what was delivered, and what went wrong. Include dates, messages, and any relevant details..." style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.6}}/>
                </div>

                <div style={{marginBottom:20}}>
                  <label style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Evidence (optional)</label>
                  <textarea value={evidence} onChange={e=>setEvidence(e.target.value)} rows={2} placeholder="Links, screenshots, message excerpts, contract clauses..." style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.6}}/>
                </div>

                <button onClick={analyze} disabled={!disputeType||!amount||!desc} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 20px rgba(26,107,255,0.35)",opacity:!disputeType||!amount||!desc?0.4:1}}>
                  <Bot size={18}/> Analyze with AI Arbitration
                </button>
              </div>
            )}

            {/* ANALYZING */}
            {step==="analyze"&&analyzing&&(
              <div style={{textAlign:"center",padding:48,background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(26,107,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                  <Loader2 size={28} color="#1a6bff" style={{animation:"spin 1s linear infinite"}}/>
                </div>
                <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:6}}>AI Arbitration in Progress</div>
                <div style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem",lineHeight:1.6}}>Analyzing dispute details, contract terms, and platform policies...<br/>This typically takes 15–30 seconds.</div>
              </div>
            )}

            {/* RESULT */}
            {step==="result"&&!analyzing&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:12,marginBottom:16}}>
                  <Bot size={20} color="#00e676"/>
                  <div>
                    <div style={{fontWeight:700,color:"#00e676",fontSize:"0.88rem"}}>AI Analysis Complete</div>
                    <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.45)"}}>Review pending · 3 human arbitrators will verify within 12 hours</div>
                  </div>
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4,fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>
                    <Clock size={12}/> Just now
                  </div>
                </div>

                <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:16,padding:22,marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                    <Shield size={16} color="#4da6ff"/>
                    <span style={{fontWeight:800,fontSize:"0.88rem",color:"#4da6ff",letterSpacing:"0.06em",textTransform:"uppercase"}}>AI Arbitration Analysis</span>
                  </div>
                  <pre style={{fontFamily:"inherit",whiteSpace:"pre-wrap",fontSize:"0.85rem",color:"rgba(255,255,255,0.75)",lineHeight:1.75}}>{verdict}</pre>
                </div>

                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setStep("select")} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.18)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:"0.85rem"}}>Edit Dispute</button>
                  <button style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,cursor:"pointer",fontSize:"0.88rem"}}>
                    Submit for Panel Review →
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
