
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, X, ChevronRight, Shield } from "lucide-react";
import { VeritasEmblem, VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";

const PLANS = [
  {id:"starter",name:"Starter",price:0,annual:0,color:"rgba(255,255,255,0.7)",border:"rgba(26,107,255,0.15)",
   desc:"For new members getting started",
   features:["Up to 5 active proposals","Standard visibility","3% platform fee","Basic Trust Score","Community access","Email support"],
   missing:["AI job matching","Priority placement","NFT Passport","API access"],cta:"Get Started Free"},
  {id:"pro",name:"Pro",price:49,annual:39,color:"#f0c040",border:"rgba(240,192,64,0.4)",badge:"Most Popular",
   desc:"For serious professionals building reputation",
   features:["Unlimited proposals","Priority visibility","2% platform fee","Full AI matching","NFT Trust Passport","Score boost tools","Advanced analytics","Priority support","Custom profile URL"],
   missing:["API access","White-label","Dedicated manager"],cta:"Start Pro — $49/mo"},
  {id:"elite",name:"Elite",price:149,annual:119,color:"#00d4ff",border:"rgba(0,212,255,0.3)",
   desc:"For top earners and agencies",
   features:["Everything in Pro","1.5% platform fee","API access (100K/mo)","White-label branding","Dedicated manager","Custom escrow terms","5 team seats","SLA support","Early access","DAO voting x2"],
   missing:[],cta:"Go Elite — $149/mo"},
];

const FAQ = [
  {q:"Is there a free trial?",a:"Yes — Starter is completely free with no time limit. Pro and Elite include a 14-day free trial, no credit card required."},
  {q:"What is the platform fee?",a:"Charged on milestone releases from escrow. Starter: 3%, Pro: 2%, Elite: 1.5%. No hidden fees."},
  {q:"Can I switch plans anytime?",a:"Absolutely. Upgrade or downgrade at any time. Downgrades take effect at the end of your billing period."},
  {q:"What is the Trust Score?",a:"Your Trust Score (0–1000) reflects verification level, on-time delivery, client ratings, and dispute history. It's blockchain-verified and fully portable."},
  {q:"Is my payment data secure?",a:"All payments processed via Stripe and held in blockchain-verified smart contract escrow. SOC 2 Type II compliant."},
];

export default function PricingPage() {
  const router = useRouter();
  const [annual,setAnnual] = useState(false);
  const [openFaq,setOpenFaq] = useState<number|null>(null);

  return (
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={36}/>
          <div>
            <div style={{fontSize:"1rem",fontWeight:900,letterSpacing:"0.08em"}}>VERITAS</div>
            <div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div>
          </div>
        </div>
        <button onClick={()=>router.push("/dashboard")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(26,107,255,0.25)",background:"rgba(26,107,255,0.08)",color:"#4da6ff",fontSize:"0.8rem",cursor:"pointer",fontWeight:600}}>Dashboard</button>
      </nav>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:30,fontSize:"0.75rem",color:"#4da6ff",fontWeight:600,marginBottom:16,letterSpacing:"0.05em"}}>
            ⚡ Transparent, no-surprise pricing
          </div>
          <h1 style={{fontSize:"3rem",fontWeight:900,marginBottom:8}}>Simple Pricing</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"1.05rem",marginBottom:24}}>Start free. Scale as you grow. No hidden fees.</p>
          {/* Toggle */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
            <span style={{fontSize:"0.9rem",color:annual?"rgba(255,255,255,0.4)":"white"}}>Monthly</span>
            <div onClick={()=>setAnnual(!annual)} style={{width:52,height:28,borderRadius:14,background:annual?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",transition:"all 0.2s"}}>
              <span style={{position:"absolute",top:4,width:20,height:20,borderRadius:"50%",background:"white",transition:"all 0.2s",left:annual?28:4}}/>
            </div>
            <span style={{fontSize:"0.9rem",color:annual?"white":"rgba(255,255,255,0.4)"}}>Annual <span style={{color:"#00e676",fontWeight:700}}>Save 20%</span></span>
          </div>
        </div>

        {/* Plans */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:48}}>
          {PLANS.map(plan=>(
            <div key={plan.id} style={{position:"relative",background:"linear-gradient(135deg,rgba(4,15,36,0.97),rgba(6,18,41,0.94))",border:`1.5px solid ${plan.border}`,borderRadius:20,padding:28,boxShadow:plan.id==="pro"?"0 0 40px rgba(240,192,64,0.12)":"none"}}>
              {plan.badge&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",padding:"4px 16px",background:"linear-gradient(135deg,#f0c040,#c9a227)",borderRadius:12,fontSize:"0.7rem",fontWeight:900,color:"#0a0800",whiteSpace:"nowrap"}}>{plan.badge}</div>}
              <div style={{fontSize:"1.2rem",fontWeight:900,color:plan.color,marginBottom:4}}>{plan.name}</div>
              <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",marginBottom:20}}>{plan.desc}</div>
              <div style={{marginBottom:20}}>
                <span style={{fontSize:"2.4rem",fontWeight:900}}>{plan.price===0?"Free":"$"+(annual?plan.annual:plan.price)}</span>
                {plan.price>0&&<span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem"}}>/month</span>}
                {annual&&plan.price>0&&<div style={{fontSize:"0.7rem",color:"#00e676",marginTop:4}}>Billed annually · Save ${((plan.price-plan.annual)*12)}/yr</div>}
              </div>
              <button onClick={()=>router.push("/onboarding")} style={{
                width:"100%",padding:"12px",borderRadius:10,fontWeight:700,fontSize:"0.88rem",cursor:"pointer",marginBottom:20,
                background:plan.id==="pro"?"linear-gradient(135deg,#f0c040,#c9a227)":plan.id==="elite"?"rgba(0,212,255,0.1)":"rgba(26,107,255,0.1)",
                border:plan.id==="pro"?"none":plan.id==="elite"?`1px solid rgba(0,212,255,0.3)`:"1px solid rgba(26,107,255,0.25)",
                color:plan.id==="pro"?"#0a0800":plan.id==="elite"?"#00d4ff":"#4da6ff",
              }}>{plan.cta}</button>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {plan.features.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.82rem",color:"rgba(255,255,255,0.75)"}}>
                    <CheckCircle2 size={14} color="#00e676" style={{flexShrink:0}}/>{f}
                  </div>
                ))}
                {plan.missing.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.82rem",color:"rgba(255,255,255,0.2)"}}>
                    <X size={14} style={{flexShrink:0}}/>{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{maxWidth:680,margin:"0 auto 40px"}}>
          <h2 style={{fontSize:"1.6rem",fontWeight:900,textAlign:"center",marginBottom:20}}>Frequently Asked Questions</h2>
          {FAQ.map((faq,i)=>(
            <div key={i} style={{background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:12,marginBottom:8,overflow:"hidden"}}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",background:"none",border:"none",color:"white",cursor:"pointer",textAlign:"left"}}>
                <span style={{fontWeight:600,fontSize:"0.92rem"}}>{faq.q}</span>
                <ChevronRight size={16} color="rgba(255,255,255,0.4)" style={{transform:openFaq===i?"rotate(90deg)":"none",transition:"transform 0.2s",flexShrink:0}}/>
              </button>
              {openFaq===i&&<div style={{padding:"0 20px 16px",fontSize:"0.85rem",color:"rgba(255,255,255,0.55)",lineHeight:1.7,borderTop:"1px solid rgba(26,107,255,0.08)"}}>{faq.a}</div>}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{textAlign:"center",background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(10,8,2,0.95))",border:"1px solid rgba(201,162,39,0.2)",borderRadius:24,padding:"48px 28px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><VeritasVerifiedBadge score={845} size={140}/></div>
          <h2 style={{fontSize:"2rem",fontWeight:900,marginBottom:8}}>Ready to Build Your Reputation?</h2>
          <p style={{color:"rgba(255,255,255,0.45)",marginBottom:24}}>Join 12,000+ verified professionals on the world's most trusted platform.</p>
          <button onClick={()=>router.push("/onboarding")} style={{padding:"14px 40px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",borderRadius:10,border:"none",color:"#0a0800",fontWeight:800,fontSize:"1.05rem",cursor:"pointer",boxShadow:"0 4px 24px rgba(201,162,39,0.35)"}}>
            Get Verified Free →
          </button>
        </div>
      </div>
    </div>
  );
}
