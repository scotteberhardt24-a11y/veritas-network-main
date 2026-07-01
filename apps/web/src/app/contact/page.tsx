
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { MessageSquare, CheckCircle2, Loader2, Building2, Shield, Zap } from "lucide-react";

export default function ContactPage(){
  const router=useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [type,setType]=useState("general");
  const [message,setMessage]=useState("");
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);

  function send(){if(!name||!email||!message)return;setSending(true);setTimeout(()=>{setSending(false);setSent(true);},1200);}

  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={34}/>
          <div><div style={{fontSize:"1rem",fontWeight:900}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/help")} style={{padding:"9px 18px",borderRadius:9,border:"1px solid rgba(26,107,255,0.2)",background:"rgba(26,107,255,0.06)",color:"#4da6ff",fontSize:"0.82rem",cursor:"pointer",fontWeight:600}}>Help Center</button>
      </nav>
      <div style={{maxWidth:900,margin:"0 auto",padding:"48px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><VeritasEmblem size={52}/></div>
          <h1 style={{fontSize:"2.5rem",fontWeight:900,marginBottom:8}}>Get in Touch</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.95rem"}}>We typically respond within 4 hours during business hours</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:26}}>
            {sent?(
              <div style={{textAlign:"center",padding:"32px 0"}}>
                <CheckCircle2 size={48} color="#00e676" style={{margin:"0 auto 14px"}}/>
                <div style={{fontSize:"1.3rem",fontWeight:900,marginBottom:6}}>Message Sent!</div>
                <div style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem",marginBottom:20}}>We'll reply to {email} within 4 hours.</div>
                <button onClick={()=>router.push("/")} style={{padding:"10px 22px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",cursor:"pointer",fontWeight:600,fontSize:"0.85rem"}}>Back to Home</button>
              </div>
            ):(
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  {[{l:"Your Name",v:name,s:setName,p:"Alex Chen"},{l:"Email",v:email,s:setEmail,p:"alex@email.com"}].map((f,i)=>(
                    <div key={i}><label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>{f.l}</label>
                    <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/></div>
                  ))}
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7,display:"block"}}>Topic</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[{id:"general",l:"General Question",ic:"💬"},{id:"enterprise",l:"Enterprise Sales",ic:"🏢"},{id:"support",l:"Tech Support",ic:"🔧"},{id:"dispute",l:"Dispute Help",ic:"⚖️"}].map(t=>(
                      <button key={t.id} onClick={()=>setType(t.id)} style={{padding:"8px 10px",background:type===t.id?"rgba(26,107,255,0.14)":"rgba(26,107,255,0.04)",border:`1px solid ${type===t.id?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:"0.78rem",fontWeight:600,color:type===t.id?"#4da6ff":"rgba(255,255,255,0.55)"}}>
                        <span>{t.ic}</span>{t.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Message</label>
                  <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5} placeholder="How can we help?" style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:10,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.6}}/>
                </div>
                <button onClick={send} disabled={!name||!email||!message||sending} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.92rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:!name||!email||!message?0.4:1}}>
                  {sending?<><Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>Sending...</>:<><MessageSquare size={16}/>Send Message</>}
                </button>
              </>
            )}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[{ic:"💬",t:"Live Chat",d:"Talk to support now. Avg response: 4 min.",a:"Start Chat",c:"#1a6bff"},{ic:"⚡",t:"AI Assistant",d:"Instant answers 24/7.",a:"Ask AI",c:"#a78bfa"},{ic:"🏢",t:"Enterprise",d:"Need white-label or API access?",a:"Talk to Sales",c:"#f0c040"},{ic:"⚖️",t:"Dispute Help",d:"Has your case stalled? We'll step in.",a:"Escalate",c:"#ff5555"}].map((c,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:18,display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:42,height:42,borderRadius:11,background:"rgba(26,107,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"1.3rem"}}>{c.ic}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,marginBottom:4}}>{c.t}</div>
                  <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",marginBottom:10,lineHeight:1.5}}>{c.d}</div>
                  <button style={{padding:"7px 14px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:8,color:"#4da6ff",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"}}>{c.a} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
