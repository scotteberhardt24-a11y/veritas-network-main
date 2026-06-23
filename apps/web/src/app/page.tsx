
"use client";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle2, Lock, Users, MapPin, ArrowRight } from "lucide-react";

function VShield({size=80}:{size?:number}){return(<svg width={size} height={size} viewBox="0 0 100 115" fill="none"><defs><linearGradient id="s1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="100%" stopColor="#0033aa"/></linearGradient><linearGradient id="s2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c0d8ff"/><stop offset="100%" stopColor="#6699ff"/></linearGradient><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f0c040"/><stop offset="100%" stopColor="#a07810"/></linearGradient></defs><path d="M50 4 L96 22 L96 58 Q96 90 50 112 Q4 90 4 58 L4 22 Z" fill="url(#s1)" stroke="url(#s2)" strokeWidth="2.5"/><path d="M50 12 L88 27 L88 58 Q88 84 50 103 Q12 84 12 58 L12 27 Z" fill="none" stroke="rgba(200,220,255,0.18)" strokeWidth="1"/><path d="M28 56 L42 70 L72 40" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="72" cy="22" r="7" fill="url(#g1)"/><rect x="67" y="28" width="3" height="14" rx="1" fill="url(#g1)"/><rect x="64" y="36" width="6" height="2.5" rx="1" fill="url(#g1)"/><rect x="64" y="40" width="4" height="2.5" rx="1" fill="url(#g1)"/></svg>);}

function TrustBadge({score=845}:{score?:number}){
  return(
    <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:200,height:220}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse,rgba(201,162,39,0.2) 0%,transparent 70%)"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 200 220" fill="none">
        {[0,1,2,3,4,5,6].map(i=><ellipse key={"l"+i} cx={62-i*5} cy={95+i*8} rx="11" ry="6" transform={`rotate(${-55+i*13} ${62-i*5} ${95+i*8})`} fill="#c9a227" opacity={0.85-i*0.07}/>)}
        {[0,1,2,3,4,5,6].map(i=><ellipse key={"r"+i} cx={138+i*5} cy={95+i*8} rx="11" ry="6" transform={`rotate(${55-i*13} ${138+i*5} ${95+i*8})`} fill="#c9a227" opacity={0.85-i*0.07}/>)}
        <path d="M55 188 Q100 178 145 188 Q100 202 55 188Z" fill="#c9a227"/>
        <text x="100" y="195" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1a0a00" letterSpacing="1.5">TRUST SCORE</text>
      </svg>
      <div style={{position:"relative",zIndex:10,width:128,height:146,borderRadius:"50% 50% 40% 40%",background:"linear-gradient(145deg,#1a3a6b,#0d1f3d,#080f20)",border:"2.5px solid #c9a227",boxShadow:"0 0 40px rgba(201,162,39,0.4),inset 0 2px 4px rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{fontSize:"0.52rem",fontWeight:800,letterSpacing:"0.18em",color:"#f0c040",opacity:0.9}}>VERITAS</div>
        <div style={{fontSize:"0.48rem",fontWeight:700,letterSpacing:"0.15em",color:"#d4a820",opacity:0.7,marginBottom:8}}>VERIFIED</div>
        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#00c853,#007a30)",boxShadow:"0 0 12px rgba(0,200,83,0.5)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{fontSize:"2rem",fontWeight:900,color:"#00e676",textShadow:"0 0 16px rgba(0,230,118,0.6)",lineHeight:1}}>{score}</div>
      </div>
    </div>
  );
}

function WorkerCard(){
  return(
    <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.95))",border:"1px solid rgba(26,107,255,0.25)",borderRadius:16,overflow:"hidden",maxWidth:430}}>
      <div style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(26,107,255,0.1)",background:"rgba(2,13,31,0.95)"}}>
        <VShield size={20}/>
        <span style={{fontWeight:900,fontSize:"0.78rem",letterSpacing:"0.12em",color:"white"}}>VERITAS</span>
        <span style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.45)",marginLeft:4}}>TRUST YOU CAN SEE. <span style={{color:"#00d4ff",fontWeight:700}}>CONFIDENCE YOU CAN FEEL.</span></span>
      </div>
      <div style={{padding:16}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14}}>
          <div style={{width:72,height:72,borderRadius:12,border:"2px solid rgba(26,107,255,0.3)",flexShrink:0,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem"}}>👷</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:"1.1rem",fontWeight:900,color:"white"}}>James Wilson</span><CheckCircle2 size={14} color="#1a6bff" fill="#1a6bff"/></div>
            <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",marginBottom:3}}>Plumbing Specialist</div>
            <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",gap:3,marginBottom:8}}><MapPin size={11}/> Austin, TX</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px 3px 7px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:20}}>
              <Shield size={9} color="#4da6ff"/><span style={{fontSize:"0.6rem",fontWeight:800,color:"#4da6ff",letterSpacing:"0.06em"}}>VERITAS VERIFIED</span>
            </div>
          </div>
          <div style={{flexShrink:0,transform:"scale(0.75)",transformOrigin:"top right"}}><TrustBadge score={845}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"rgba(26,107,255,0.08)",borderRadius:10,overflow:"hidden",marginBottom:12}}>
          {[["TRUST SCORE","845","Excellent"],["JOBS COMPLETED","247","100% Success Rate"],["MEMBER SINCE","1 Year","Verified"]].map(([l,v,s],i)=>(
            <div key={i} style={{background:"rgba(4,15,36,0.8)",padding:"11px 8px",textAlign:"center"}}>
              <div style={{fontSize:"0.56rem",fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em",marginBottom:3}}>{l}</div>
              <div style={{fontSize:i===2?"1.2rem":"1.5rem",fontWeight:900,color:"#00e676",lineHeight:1,marginBottom:2}}>{v}</div>
              <div style={{fontSize:"0.55rem",fontWeight:700,color:"#00e676",letterSpacing:"0.05em"}}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
          {[["🪪","IDENTITY VERIFIED","ID & Background Check"],["🔧","SKILLS VERIFIED","Certifications Verified"],["🛡️","INSURED","$1M Coverage"],["🔒","ESCROW PROTECTED","Payments Secured"]].map(([ic,l,s],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 9px",background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:8}}>
              <span style={{fontSize:"0.9rem"}}>{ic}</span>
              <div><div style={{fontSize:"0.57rem",fontWeight:800,color:"rgba(255,255,255,0.62)",letterSpacing:"0.05em"}}>{l}</div><div style={{fontSize:"0.51rem",color:"rgba(255,255,255,0.28)"}}>{s}</div></div>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontSize:"0.6rem",fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em",marginBottom:5}}>CUSTOMER REVIEWS</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontSize:"1.3rem",fontWeight:900,color:"white"}}>5.0</span>
            <span style={{color:"#ffd700",fontSize:"0.95rem"}}>★★★★★</span>
            <span style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.35)"}}>(128)</span>
          </div>
          <div style={{fontSize:"0.76rem",fontStyle:"italic",color:"rgba(255,255,255,0.42)"}}>"Excellent work, on time and very professional."</div>
        </div>
      </div>
    </div>
  );
}

function MobilePreview(){
  return(
    <div style={{width:185,background:"#060e22",border:"1px solid rgba(26,107,255,0.2)",borderRadius:22,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
      <div style={{display:"flex",justifyContent:"space-between",padding:"7px 14px",background:"#050d1e",fontSize:"0.62rem",color:"rgba(255,255,255,0.45)"}}><span>9:41</span><span>▪▪▪▪ 🔋</span></div>
      <div style={{padding:"13px 11px"}}>
        <div style={{textAlign:"center",marginBottom:10}}>
          <div style={{fontSize:"0.68rem",fontWeight:600,color:"rgba(255,255,255,0.45)",marginBottom:2}}>Book with Confidence</div>
          <div style={{fontSize:"0.62rem",fontWeight:900,color:"#00d4ff",letterSpacing:"0.06em"}}>VERITAS VERIFIED WORKER</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:10,marginBottom:11}}>
          <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem"}}>👷</div>
          <div><div style={{fontSize:"0.68rem",fontWeight:700,color:"white"}}>James Wilson</div><div style={{fontSize:"0.57rem",color:"rgba(255,255,255,0.38)"}}>Plumbing Specialist</div></div>
        </div>
        <div style={{marginBottom:11}}>
          {[["Trust Score","845","#00e676"],["Escrow Protection","Active","#00e676"],["Insurance Coverage","$1,000,000","white"],["Dispute Protection","Included","#00e676"]].map(([l,v,c],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3.5px 0",fontSize:"0.63rem",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <span style={{color:"rgba(255,255,255,0.42)"}}>{i===1?"🔒 ":i===2?"🛡️ ":i===3?"🛡️ ":""}{l}</span>
              <span style={{fontWeight:700,color:c}}>{v}</span>
            </div>
          ))}
        </div>
        <button style={{width:"100%",background:"linear-gradient(135deg,#1a6bff,#0044cc)",color:"white",fontWeight:800,border:"none",borderRadius:9,padding:"10px 0",fontSize:"0.72rem",display:"flex",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer",boxShadow:"0 4px 14px rgba(26,107,255,0.5)"}}>🔒 Book Now Securely</button>
        <div style={{textAlign:"center",fontSize:"0.57rem",marginTop:5,color:"rgba(255,255,255,0.25)"}}>You're protected with Veritas</div>
      </div>
    </div>
  );
}

export default function LandingPage(){
  const router=useRouter();
  const HOW=[{n:1,t:"WORKER VERIFIED",d:"Identity, skills, and background verified."},{n:2,t:"BADGE EARNED",d:"Portable truth badge earned and secured."},{n:3,t:"CUSTOMER PROTECTED",d:"Customers see verified trust before they hire."},{n:4,t:"ESCROW RELEASED",d:"Job completed. Escrow released safely."}];
  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>

      {/* HERO */}
      <section style={{position:"relative",overflow:"hidden",minHeight:460}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.25) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.22}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 65% 80% at 18% 50%,rgba(26,107,255,0.16) 0%,transparent 65%)"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 60% at 82% 30%,rgba(0,80,200,0.1) 0%,transparent 55%)"}}/>
        <div style={{position:"relative",zIndex:10,maxWidth:1280,margin:"0 auto",padding:"36px 24px"}}>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:32}}>
            <div style={{flex:1,minWidth:280}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                <VShield size={86}/>
                <div>
                  <div style={{fontSize:"3.2rem",fontWeight:900,color:"white",letterSpacing:"-0.02em",lineHeight:1}}>VERITAS</div>
                  <div style={{fontSize:"0.62rem",fontWeight:600,letterSpacing:"0.25em",textTransform:"uppercase",color:"#00d4ff",marginTop:4}}>Truth Becomes Trust</div>
                </div>
              </div>
              <h1 style={{fontSize:"2.6rem",fontWeight:900,color:"white",lineHeight:1.05,marginBottom:4}}>PORTABLE TRUTH BADGES</h1>
              <h2 style={{fontSize:"2.6rem",fontWeight:900,color:"#1a6bff",lineHeight:1.05,marginBottom:22}}>FOR GIG WORKERS</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:18}}>
                {[["🛡️","VERIFIED WORKERS"],["🔒","ESCROW PROTECTION"],["👥","SAFER HIRING"],["🛡️","PROTECTED EVERYWHERE"]].map(([ic,l],i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",border:"1px solid rgba(26,107,255,0.2)",borderRadius:40,fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:"0.07em",background:"rgba(26,107,255,0.06)"}}>
                    <span style={{fontSize:"0.9rem"}}>{ic}</span>{l}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
                <div style={{flex:1,height:1,background:"linear-gradient(to right,rgba(26,107,255,0.5),transparent)"}}/>
                <span style={{fontSize:"0.62rem",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",whiteSpace:"nowrap"}}>ONE BADGE. ANY JOB. EVERYWHERE.</span>
                <div style={{flex:1,height:1,background:"linear-gradient(to left,rgba(26,107,255,0.5),transparent)"}}/>
              </div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <button onClick={()=>router.push("/onboarding")} style={{background:"linear-gradient(135deg,#1a6bff,#0050dd)",color:"white",fontWeight:700,borderRadius:10,padding:"13px 26px",border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(26,107,255,0.4)",fontSize:"0.98rem",display:"flex",alignItems:"center",gap:8}}>Get Your Badge <ArrowRight size={17}/></button>
                <button onClick={()=>router.push("/jobs")} style={{background:"rgba(26,107,255,0.08)",color:"#4da6ff",fontWeight:600,borderRadius:10,padding:"12px 20px",border:"1px solid rgba(26,107,255,0.35)",cursor:"pointer",fontSize:"0.9rem"}}>Find Work</button>
                <button onClick={()=>router.push("/marketplace")} style={{background:"rgba(26,107,255,0.08)",color:"#4da6ff",fontWeight:600,borderRadius:10,padding:"12px 20px",border:"1px solid rgba(26,107,255,0.35)",cursor:"pointer",fontSize:"0.9rem"}}>Hire Talent</button>
              </div>
            </div>
            <div style={{flexShrink:0,display:"flex",justifyContent:"center"}}><TrustBadge score={845}/></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS + WORKER CARD */}
      <section style={{maxWidth:1280,margin:"0 auto",padding:"20px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.95),rgba(6,18,41,0.9))",border:"1px solid rgba(26,107,255,0.15)",borderRadius:16,padding:24,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at top left,rgba(26,107,255,0.06),transparent 60%)",pointerEvents:"none"}}/>
          <h3 style={{textAlign:"center",fontSize:"0.95rem",fontWeight:900,letterSpacing:"0.08em",marginBottom:20,color:"white"}}>HOW <span style={{color:"#1a6bff"}}>VERITAS</span> PROTECTS EVERYONE</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}}>
            {HOW.map((s,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:8}}>
                <div style={{width:46,height:46,borderRadius:"50%",background:"rgba(26,107,255,0.12)",border:"2px solid rgba(26,107,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem",fontWeight:900,color:"#4da6ff",boxShadow:"0 0 16px rgba(26,107,255,0.18)"}}>{s.n}</div>
                <div style={{fontSize:"0.58rem",fontWeight:900,letterSpacing:"0.07em",color:"white",lineHeight:1.2}}>{s.t}</div>
                <div style={{fontSize:"0.56rem",color:"rgba(255,255,255,0.4)",lineHeight:1.4}}>{s.d}</div>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:"0 0 10px 10px",padding:"9px 14px",display:"flex",justifyContent:"space-around"}}>
            {[["🛡️","VERIFICATION"],["🔒","ESCROW"],["🛡️","INSURANCE"],["👥","DISPUTE PROTECTION"]].map(([ic,l],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.58rem",fontWeight:700,color:"rgba(255,255,255,0.48)",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                <span style={{fontSize:"0.82rem"}}>{ic}</span>{l}
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:9,fontSize:"0.58rem",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"#00d4ff",opacity:0.65}}>TRUST. TRANSPARENCY. PROTECTION.</div>
        </div>
        <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          <div style={{flex:1}}><WorkerCard/></div>
          <MobilePreview/>
        </div>
      </section>

      {/* STATS */}
      <section style={{maxWidth:1280,margin:"0 auto",padding:"0 24px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {[["12,847","Verified Professionals"],["$42M+","Paid Out Securely"],["99.2%","Dispute Resolution"],["845","Avg Trust Score"]].map(([v,l],i)=>(
            <div key={i} style={{background:"linear-gradient(135deg,rgba(4,15,36,0.95),rgba(6,18,41,0.9))",border:"1px solid rgba(26,107,255,0.15)",borderRadius:14,padding:"18px 14px",textAlign:"center"}}>
              <div style={{fontSize:"1.9rem",fontWeight:900,background:"linear-gradient(135deg,#f0c040,#c9a227)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>{v}</div>
              <div style={{fontSize:"0.68rem",fontWeight:500,color:"rgba(255,255,255,0.4)"}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{maxWidth:900,margin:"0 auto",padding:"0 24px 40px"}}>
        <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(10,8,2,0.95))",border:"1px solid rgba(201,162,39,0.25)",borderRadius:24,padding:"44px 28px",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><VShield size={52}/></div>
          <h2 style={{fontSize:"2rem",fontWeight:900,color:"white",marginBottom:8}}>Join the Trust Revolution</h2>
          <p style={{color:"rgba(255,255,255,0.45)",marginBottom:24,fontSize:"1rem"}}>One badge. Any job. Everywhere.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>router.push("/onboarding")} style={{background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",color:"#0a0800",fontWeight:800,borderRadius:10,padding:"13px 34px",border:"none",cursor:"pointer",fontSize:"1rem",boxShadow:"0 4px 24px rgba(201,162,39,0.4)"}}>Get Verified Free →</button>
            <button onClick={()=>router.push("/pricing")} style={{background:"rgba(26,107,255,0.08)",color:"#4da6ff",fontWeight:600,borderRadius:10,padding:"12px 24px",border:"1px solid rgba(26,107,255,0.35)",cursor:"pointer",fontSize:"0.9rem"}}>See Pricing</button>
          </div>
        </div>
      </section>
    </div>
  );
}
