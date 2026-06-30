
"use client";
import { useParams, useRouter } from "next/navigation";
import { VeritasVerifiedBadge, NewMemberBadge, YearVerifiedBadge, Jobs50Badge, FirstEscrowBadge, VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Shield, CheckCircle2, MapPin, Star, Lock, Briefcase, Clock, DollarSign, MessageSquare, Share2 } from "lucide-react";

const WORKER = {
  name:"Alex Chen", title:"Full-Stack Developer", username:"alexchen.dev",
  location:"San Francisco, CA", score:99, jobs:247, rating:5.0, reviews:89,
  rate:150, available:true, memberYears:2,
  bio:"Senior full-stack engineer with 12 years of experience building SaaS platforms, marketplaces, and fintech applications. I specialize in Next.js, PostgreSQL, and Stripe integrations. Available for contracts starting at $5K.",
  skills:["Next.js","TypeScript","PostgreSQL","React","Node.js","Stripe","AWS","Docker","Prisma","Redis"],
  certifications:["Next.js Verified","TypeScript Verified","AWS Certified","Stripe Partner"],
  topWork:[
    {title:"FinVault SaaS Platform",value:"$18,000",client:"FinVault Inc.",rating:5},
    {title:"E-commerce Rebuild",   value:"$12,000",client:"TechVentures",  rating:5},
    {title:"Crypto Dashboard",     value:"$8,500", client:"CryptoEdge",    rating:5},
  ],
  reviews:[
    {author:"Brian Walsh",company:"TechVentures",rating:5,date:"Jun 2026",text:"Scott delivered exceptional work — a week ahead of schedule and under budget. Communication was outstanding throughout."},
    {author:"Amy Chen",  company:"GreenLeaf",    rating:5,date:"May 2026",text:"Best developer I've worked with. Understood our vision from day one. Will definitely hire again."},
  ],
};

export default function PublicProfilePage() {
  const router = useRouter();

  return (
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={32}/>
          <span style={{fontWeight:900,letterSpacing:"0.08em"}}>VERITAS</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{padding:"8px 16px",borderRadius:9,border:"1px solid rgba(26,107,255,0.2)",background:"rgba(26,107,255,0.06)",color:"#4da6ff",fontSize:"0.8rem",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Share2 size={13}/>Share Profile</button>
          <button style={{padding:"8px 16px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.8rem",cursor:"pointer",fontWeight:700}}>Sign In</button>
        </div>
      </nav>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 24px"}}>
        {/* Hero card */}
        <div style={{background:"linear-gradient(135deg,rgba(2,13,31,0.99),rgba(4,18,42,0.98))",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,overflow:"hidden",marginBottom:20}}>
          <div style={{height:5,background:"linear-gradient(90deg,#1a6bff,#00d4ff,#1a6bff)"}}/>
          <div style={{padding:"24px 28px"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:24,flexWrap:"wrap"}}>
              <div style={{width:88,height:88,borderRadius:18,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",border:"3px solid rgba(26,107,255,0.35)",flexShrink:0}}>AC</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:"1.9rem",fontWeight:900}}>{WORKER.name}</span>
                  <CheckCircle2 size={20} color="#1a6bff" fill="#1a6bff"/>
                  <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 12px 4px 8px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:20,fontSize:"0.62rem",fontWeight:800,color:"#4da6ff",letterSpacing:"0.07em"}}>
                    <Shield size={10}/> VERITAS VERIFIED
                  </div>
                </div>
                <div style={{fontSize:"1rem",color:"rgba(255,255,255,0.55)",marginBottom:5}}>{WORKER.title}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:12}}>
                  <MapPin size={13}/>{WORKER.location}
                  <span>·</span>
                  <span style={{color:WORKER.available?"#00e676":"rgba(255,255,255,0.35)",fontWeight:700}}>● {WORKER.available?"Available Now":"Busy"}</span>
                  <span>·</span>
                  <span>@{WORKER.username}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {[["$"+WORKER.rate+"/hr","💰"],["★"+WORKER.rating+" ("+WORKER.reviews+" reviews)","⭐"],[WORKER.jobs+" jobs","✅"],[WORKER.memberYears+"yr member","🏆"]].map(([v,ic],i)=>(
                    <span key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:8,fontSize:"0.75rem",color:"rgba(255,255,255,0.7)"}}>{ic}{v}</span>
                  ))}
                </div>
              </div>
              <div style={{flexShrink:0}}><VeritasVerifiedBadge score={WORKER.score*10} size={160}/></div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderTop:"1px solid rgba(26,107,255,0.1)"}}>
            {[["TRUST SCORE","99","Excellent"],["JOBS COMPLETED","247","100% Success"],["MEMBER SINCE","2 Years","Verified"],["RESPONSE TIME","< 1 Hour","Avg"]].map(([l,v,s],i)=>(
              <div key={i} style={{padding:"14px",textAlign:"center",borderRight:i<3?"1px solid rgba(26,107,255,0.08)":"none",background:"rgba(4,15,36,0.4)"}}>
                <div style={{fontSize:"0.58rem",fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.07em",marginBottom:4}}>{l}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:"#00e676",lineHeight:1,marginBottom:2}}>{v}</div>
                <div style={{fontSize:"0.58rem",fontWeight:700,color:"#00e676",letterSpacing:"0.05em"}}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start"}}>
          {/* Left */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Bio */}
            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:20}}>
              <h3 style={{fontWeight:800,marginBottom:10}}>About</h3>
              <p style={{fontSize:"0.9rem",color:"rgba(255,255,255,0.6)",lineHeight:1.75}}>{WORKER.bio}</p>
            </div>

            {/* Badges */}
            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:20}}>
              <h3 style={{fontWeight:800,marginBottom:14}}>Verified Badges</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                {[NewMemberBadge,YearVerifiedBadge,Jobs50Badge,FirstEscrowBadge].map((Comp,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <Comp size={90}/>
                    <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",marginTop:4}}>{["New Member","1 Year","50 Jobs","First Escrow"][i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:20}}>
              <h3 style={{fontWeight:800,marginBottom:12}}>Verified Skills</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {WORKER.skills.map(s=><span key={s} style={{padding:"6px 14px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:8,fontSize:"0.8rem",color:"#4da6ff",fontWeight:600}}>{s}</span>)}
              </div>
            </div>

            {/* Reviews */}
            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:20}}>
              <h3 style={{fontWeight:800,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                Reviews <span style={{color:"#ffd700"}}>★</span><span style={{fontSize:"1.3rem"}}>{WORKER.rating}</span><span style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.35)"}}>({WORKER.reviews})</span>
              </h3>
              {WORKER.reviews.map((r,i)=>(
                <div key={i} style={{padding:14,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:12,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <div><div style={{fontWeight:700,fontSize:"0.88rem"}}>{r.author}</div><div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.38)"}}>{r.company} · {r.date}</div></div>
                    <div style={{color:"#ffd700",fontSize:"0.85rem"}}>{"★".repeat(r.rating)}</div>
                  </div>
                  <p style={{fontSize:"0.83rem",color:"rgba(255,255,255,0.6)",fontStyle:"italic",lineHeight:1.6}}>"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking sidebar */}
          <div style={{position:"sticky",top:80}}>
            <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",border:"1px solid rgba(26,107,255,0.25)",borderRadius:18,overflow:"hidden"}}>
              <div style={{padding:"16px 18px",borderBottom:"1px solid rgba(26,107,255,0.1)",textAlign:"center"}}>
                <div style={{fontSize:"0.65rem",fontWeight:700,color:"rgba(255,255,255,0.38)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>BOOK WITH CONFIDENCE</div>
                <div style={{fontSize:"0.7rem",fontWeight:900,color:"#00d4ff",letterSpacing:"0.07em",textTransform:"uppercase"}}>VERITAS VERIFIED WORKER</div>
              </div>
              <div style={{padding:"16px 18px"}}>
                {[["Trust Score","99","#00e676"],["Escrow Protection","Active","#00e676"],["Insurance Coverage","$1,000,000","white"],["Dispute Protection","Included","#00e676"],["Response Time","< 1 Hour","#4da6ff"]].map(([l,v,c],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(26,107,255,0.06)",fontSize:"0.82rem"}}>
                    <span style={{color:"rgba(255,255,255,0.5)",display:"flex",alignItems:"center",gap:5}}>
                      {i===1&&"🔒"}{i===2&&"🛡️"}{i===3&&"🛡️"}{i===4&&<Clock size={11}/>} {l}
                    </span>
                    <span style={{fontWeight:700,color:c}}>{v}</span>
                  </div>
                ))}
                <button style={{width:"100%",marginTop:14,padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0044cc)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(26,107,255,0.45)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
                  🔒 Hire Securely
                </button>
                <button style={{width:"100%",padding:"11px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"#4da6ff",fontWeight:600,fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <MessageSquare size={15}/> Send Message
                </button>
                <div style={{textAlign:"center",fontSize:"0.63rem",marginTop:10,color:"rgba(255,255,255,0.25)"}}>You're protected with Veritas · No payment until you approve</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
