
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Star, Shield, CheckCircle2, MessageSquare, ThumbsUp, TrendingUp, Loader2 } from "lucide-react";

const RECEIVED = [
  { id:"R1", author:"Brian Walsh",   company:"TechVentures Inc.", avatar:"BW", rating:5, date:"Jun 14, 2026", job:"Full-Stack SaaS Dashboard", amount:"$10,000", text:"Scott delivered exceptional work — a full week ahead of schedule. The architecture was flawless and communication was outstanding throughout. Highest recommendation.", replied:false },
  { id:"R2", author:"Amy Chen",      company:"GreenLeaf Studios",  avatar:"AC", rating:5, date:"May 28, 2026", job:"Brand Identity Design",     amount:"$4,500",  text:"Best developer I've worked with on this platform. Understood our vision immediately and delivered beyond expectations every step of the way.", replied:true  },
  { id:"R3", author:"David Price",   company:"FinEdge Capital",    avatar:"DP", rating:5, date:"Apr 30, 2026", job:"Q3 Content Strategy",        amount:"$2,800",  text:"Incredibly detail-oriented. The technical architecture was flawless and David delivered clean, well-documented code.", replied:false },
  { id:"R4", author:"Nadia Rose",    company:"Bloom Health",       avatar:"NR", rating:4, date:"Mar 15, 2026", job:"Product Demo Video",         amount:"$5,000",  text:"Great work overall. A couple of revisions were needed but the final product was excellent and delivered on time.", replied:true  },
];

const GIVEN = [
  { id:"G1", to:"Sarah Kim",      company:"Design Agency",   avatar:"SK", rating:5, date:"Jun 10, 2026", job:"UI Component Library",  text:"Outstanding designer. Delivered a complete design system in 3 weeks. Would hire again immediately." },
  { id:"G2", to:"Marcus Webb",    company:"Dev Freelancer",  avatar:"MW", rating:4, date:"May 20, 2026", job:"API Integration",       text:"Solid work and good communication. Minor delays on delivery but quality was excellent." },
];

export default function ReviewsPage() {
  const [tab, setTab]           = useState<"received"|"given">("received");
  const [replyId, setReplyId]   = useState<string|null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSub]    = useState(false);
  const [submitted, setSubmitted] = useState<string[]>([]);

  const avgRating = RECEIVED.reduce((a,r)=>a+r.rating,0)/RECEIVED.length;
  const fiveStar  = RECEIVED.filter(r=>r.rating===5).length;

  function submitReply(id:string) {
    if(!replyText.trim()) return;
    setSub(true);
    setTimeout(()=>{
      setSubmitted(p=>[...p,id]);
      setSub(false);
      setReplyId(null);
      setReplyText("");
    }, 900);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Star size={28} color="#f0c040" fill="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Reviews</h1>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
            {[
              {label:"Avg Rating",   value:avgRating.toFixed(1)+"★", color:"#f0c040"},
              {label:"Total Reviews",value:RECEIVED.length,          color:"#4da6ff"},
              {label:"5-Star Reviews",value:fiveStar,                color:"#00e676"},
              {label:"Reply Rate",   value:"85%",                    color:"#00d4ff"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:"2rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Rating breakdown */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:20,marginBottom:20}}>
            <div style={{fontWeight:800,marginBottom:14,fontSize:"0.9rem"}}>Rating Breakdown</div>
            {[5,4,3,2,1].map(star=>{
              const count = RECEIVED.filter(r=>r.rating===star).length;
              const pct   = RECEIVED.length ? Math.round((count/RECEIVED.length)*100) : 0;
              return(
                <div key={star} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)",width:14,textAlign:"right"}}>{star}</span>
                  <Star size={12} color="#f0c040" fill="#f0c040"/>
                  <div style={{flex:1,height:7,background:"rgba(26,107,255,0.08)",borderRadius:4,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#f0c040,#c9a227)",borderRadius:4,transition:"width 0.8s"}}/>
                  </div>
                  <span style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",width:28}}>{count}</span>
                  <span style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.28)",width:32}}>{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {[["received","⭐ Received ("+RECEIVED.length+")"],["given","💬 Given ("+GIVEN.length+")"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t as any)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{l}</button>
            ))}
          </div>

          {/* RECEIVED */}
          {tab==="received"&&(
            <div style={{maxWidth:720,display:"flex",flexDirection:"column",gap:14}}>
              {RECEIVED.map(r=>(
                <div key={r.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:20}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:12}}>
                    <div style={{display:"flex",gap:12}}>
                      <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>{r.avatar}</div>
                      <div>
                        <div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:2}}>{r.author}</div>
                        <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{r.company} · {r.date}</div>
                        <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.3)"}}>Job: {r.job} · {r.amount}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:1,flexShrink:0}}>
                      {Array.from({length:5}).map((_,i)=><Star key={i} size={16} color="#f0c040" fill={i<r.rating?"#f0c040":"transparent"}/>)}
                    </div>
                  </div>
                  <p style={{fontSize:"0.87rem",color:"rgba(255,255,255,0.65)",lineHeight:1.7,fontStyle:"italic",marginBottom:12}}>"{r.text}"</p>

                  {/* Reply section */}
                  {(submitted.includes(r.id)||r.replied)?(
                    <div style={{padding:"10px 14px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10,display:"flex",alignItems:"flex-start",gap:8}}>
                      <Shield size={14} color="#4da6ff" style={{marginTop:2,flexShrink:0}}/>
                      <div>
                        <div style={{fontSize:"0.68rem",fontWeight:700,color:"#4da6ff",marginBottom:2}}>Your Reply</div>
                        <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.55)"}}>Thank you so much! It was a pleasure working on this project. Looking forward to future opportunities!</div>
                      </div>
                    </div>
                  ):replyId===r.id?(
                    <div>
                      <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} rows={3} placeholder="Write a professional reply to this review..." style={{width:"100%",padding:"10px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.83rem",outline:"none",resize:"none",lineHeight:1.55,marginBottom:8}}/>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>setReplyId(null)} style={{flex:1,padding:"9px",borderRadius:9,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:"0.8rem"}}>Cancel</button>
                        <button onClick={()=>submitReply(r.id)} disabled={!replyText.trim()||submitting} style={{flex:2,padding:"9px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontWeight:700,cursor:"pointer",fontSize:"0.8rem",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:!replyText.trim()?0.5:1}}>
                          {submitting?<Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>:<MessageSquare size={14}/>} Reply
                        </button>
                      </div>
                    </div>
                  ):(
                    <button onClick={()=>setReplyId(r.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:8,color:"#4da6ff",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>
                      <MessageSquare size={13}/> Reply to Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* GIVEN */}
          {tab==="given"&&(
            <div style={{maxWidth:720,display:"flex",flexDirection:"column",gap:14}}>
              {GIVEN.map(r=>(
                <div key={r.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:20}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:12}}>
                    <div style={{display:"flex",gap:12}}>
                      <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>{r.avatar}</div>
                      <div>
                        <div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:2}}>To: {r.to}</div>
                        <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{r.company} · {r.date}</div>
                        <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.3)"}}>Job: {r.job}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:1,flexShrink:0}}>
                      {Array.from({length:5}).map((_,i)=><Star key={i} size={16} color="#f0c040" fill={i<r.rating?"#f0c040":"transparent"}/>)}
                    </div>
                  </div>
                  <p style={{fontSize:"0.87rem",color:"rgba(255,255,255,0.65)",lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
