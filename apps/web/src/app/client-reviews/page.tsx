
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Star, CheckCircle2, Clock, MessageSquare, Send, Loader2, ThumbsUp, TrendingUp } from "lucide-react";

const PENDING_REVIEWS = [
  {id:"R1",job:"Full-Stack SaaS Dashboard",  client:"TechVentures Inc.",avatar:"TV",completed:"Jun 28",amount:"$10,000",days:2},
  {id:"R2",job:"Q3 Content Strategy",        client:"FinEdge Capital",  avatar:"FE",completed:"Jun 20",amount:"$2,800", days:9},
];

const RECEIVED = [
  {id:"G1",client:"GreenLeaf Studios",avatar:"GL",rating:5,date:"Jun 3", text:"Exceptional work. Scott understood our vision from day one and delivered a design system that exceeded every expectation. Highest possible recommendation.",job:"Brand Identity Pack"},
  {id:"G2",client:"Bloom Health",     avatar:"BH",rating:5,date:"May 15",text:"Best developer on the platform. Delivered a week early, under budget, and the code quality was pristine. We're hiring Scott again next quarter.",job:"React Native App"},
  {id:"G3",client:"StartupX Labs",   avatar:"SX",rating:4,date:"Apr 10",text:"Good work overall. A few small revisions needed but the final product was exactly what we wanted.",job:"Landing Page"},
];

export default function ClientReviewPortalPage() {
  const [pendingReviews,setPending] = useState(PENDING_REVIEWS);
  const [tab,setTab]   = useState("pending");
  const [sending,setSending] = useState<string|null>(null);
  const [sent,setSent]       = useState<string[]>([]);

  function sendRequest(id:string){
    setSending(id);
    setTimeout(()=>{setSending(null);setSent(p=>[...p,id]);},1200);
  }

  const avgRating = RECEIVED.reduce((a,r)=>a+r.rating,0)/RECEIVED.length;
  const pendingCount = pendingReviews.filter(p=>!sent.includes(p.id)).length;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Star size={28} color="#f0c040" fill="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Review Portal</h1>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[{l:"Avg Rating",v:avgRating.toFixed(1)+"★",c:"#f0c040"},{l:"Total Reviews",v:RECEIVED.length,c:"#4da6ff"},{l:"5-Star",v:RECEIVED.filter(r=>r.rating===5).length,c:"#00e676"},{l:"Pending Requests",v:pendingCount,c:"#ff9544"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:"1.8rem",fontWeight:900,color:s.c,marginBottom:4}}>{s.v}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {[["pending","⏳ Pending Requests"],["received","⭐ Received Reviews"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{l}</button>
            ))}
          </div>

          {tab==="pending"&&(
            <div style={{maxWidth:640,display:"flex",flexDirection:"column",gap:12}}>
              {pendingReviews.map(r=>(
                <div key={r.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                    <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>{r.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:2}}>{r.job}</div>
                      <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>{r.client} · Completed {r.completed} · {r.amount}</div>
                      <div style={{fontSize:"0.68rem",color:r.days>7?"#ff5555":"#f0c040",marginTop:4,fontWeight:600}}>
                        {r.days} day{r.days>1?"s":""} since completion — {r.days>7?"request overdue":"request soon"}
                      </div>
                    </div>
                  </div>
                  {sent.includes(r.id)?(
                    <div style={{display:"flex",alignItems:"center",gap:7,color:"#00e676",fontSize:"0.82rem",fontWeight:700}}>
                      <CheckCircle2 size={15}/> Review request sent to {r.client}
                    </div>
                  ):(
                    <button onClick={()=>sendRequest(r.id)} disabled={sending===r.id} style={{display:"flex",alignItems:"center",gap:7,padding:"10px 18px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",boxShadow:"0 2px 12px rgba(26,107,255,0.3)"}}>
                      {sending===r.id?<Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>:<Send size={14}/>}
                      {sending===r.id?"Sending...":"Send Review Request"}
                    </button>
                  )}
                </div>
              ))}
              {pendingReviews.length===0&&(
                <div style={{textAlign:"center",padding:"48px",background:"rgba(4,15,36,0.7)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:16}}>
                  <ThumbsUp size={40} color="rgba(255,255,255,0.15)" style={{margin:"0 auto 12px"}}/>
                  <div style={{fontWeight:700,fontSize:"1rem",marginBottom:4}}>All caught up!</div>
                  <div style={{color:"rgba(255,255,255,0.35)",fontSize:"0.85rem"}}>No pending review requests.</div>
                </div>
              )}
            </div>
          )}

          {tab==="received"&&(
            <div style={{maxWidth:680,display:"flex",flexDirection:"column",gap:14}}>
              {/* Rating distribution */}
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:18,marginBottom:4}}>
                <div style={{fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:7}}><TrendingUp size={14} color="#f0c040"/>Rating Distribution</div>
                {[5,4,3,2,1].map(star=>{
                  const c=RECEIVED.filter(r=>r.rating===star).length;
                  const pct=RECEIVED.length?Math.round((c/RECEIVED.length)*100):0;
                  return(
                    <div key={star} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                      <span style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",width:12,textAlign:"right"}}>{star}</span>
                      <Star size={11} color="#f0c040" fill="#f0c040"/>
                      <div style={{flex:1,height:6,background:"rgba(26,107,255,0.07)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#f0c040,#c9a227)",borderRadius:3}}/></div>
                      <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",width:24,textAlign:"right"}}>{c}</span>
                    </div>
                  );
                })}
              </div>
              {RECEIVED.map(r=>(
                <div key={r.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:18}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10}}>
                    <div style={{display:"flex",gap:10}}>
                      <div style={{width:42,height:42,borderRadius:11,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>{r.avatar}</div>
                      <div><div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:2}}>{r.client}</div><div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{r.job} · {r.date}</div></div>
                    </div>
                    <div style={{display:"flex",gap:1,flexShrink:0}}>{Array.from({length:5}).map((_,i)=><Star key={i} size={15} color="#f0c040" fill={i<r.rating?"#f0c040":"transparent"}/>)}</div>
                  </div>
                  <p style={{fontSize:"0.87rem",color:"rgba(255,255,255,0.65)",lineHeight:1.7,fontStyle:"italic",margin:0}}>"{r.text}"</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
