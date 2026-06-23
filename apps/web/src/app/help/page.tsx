
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Search, ChevronRight, ChevronDown, MessageSquare, BookOpen, Shield, DollarSign, Briefcase, Zap, Star } from "lucide-react";

const CATS = [
  { icon:<Shield size={22}/>,  label:"Trust Score",      count:12, color:"#1a6bff" },
  { icon:<DollarSign size={22}/>,label:"Payments & Escrow",count:18,color:"#00e676" },
  { icon:<Briefcase size={22}/>,label:"Jobs & Proposals",  count:24, color:"#f0c040" },
  { icon:<Star size={22}/>,    label:"Badges & Rewards",  count:9,  color:"#c9a227" },
  { icon:<Shield size={22}/>,  label:"Verification",      count:15, color:"#00d4ff" },
  { icon:<Zap size={22}/>,     label:"AI Features",       count:8,  color:"#a78bfa" },
];

const FAQS = [
  { cat:"Trust Score", q:"How is my Trust Score calculated?", a:"Your Trust Score (0–1000) is calculated from 6 weighted factors: on-time delivery (25%), client ratings (25%), verification level (20%), dispute history (15%), platform activity (10%), and referral quality (5%). Scores update within 24 hours of any qualifying event." },
  { cat:"Trust Score", q:"How do I improve my Trust Score quickly?", a:"The fastest wins are: complete identity verification (+50–100 pts), deliver your next job on time (+15–30 pts), ask satisfied clients to leave reviews (+10–20 pts each), and avoid any disputes. The leaderboard updates weekly." },
  { cat:"Payments & Escrow", q:"When does escrow release?", a:"Escrow releases automatically when: (1) the client approves a milestone, (2) 72 hours pass after you mark work complete with no client response, or (3) a dispute is resolved in your favor. Funds reach your Vault within minutes of release." },
  { cat:"Payments & Escrow", q:"What is the platform fee?", a:"Starter plan: 3% of milestone value. Pro plan: 2%. Elite plan: 1.5%. The fee is deducted automatically at the time of escrow release. There are no additional processing fees for USD payments." },
  { cat:"Jobs & Proposals", q:"How does AI matching work?", a:"Our AI analyzes 47 signals across your profile, Trust Score, skill endorsements, past job performance, and the job requirements. Matches are scored 0–100%. We recommend applying to jobs with 85%+ match for best acceptance rates." },
  { cat:"Verification", q:"How long does identity verification take?", a:"Phone verification is instant. Government ID verification typically takes 2–4 hours (automated) or up to 24 hours during peak periods. You'll receive a notification and Trust Score update immediately upon approval." },
  { cat:"Badges & Rewards", q:"How do I earn the Escrow Master badge?", a:"Complete 50+ escrow contracts with a 98%+ release rate (no disputed releases). The badge is awarded automatically within 24 hours of hitting the threshold and adds +25 points to your Trust Score permanently." },
  { cat:"AI Features", q:"What can the AI Assistant help with?", a:"The AI Assistant can draft contracts, write job proposals, analyze dispute evidence, suggest Trust Score improvements, explain platform features, and provide advice on pricing and client communication. It uses the full Veritas context for accurate answers." },
];

export default function HelpPage() {
  const [search, setSearch]     = useState("");
  const [openFaq, setOpenFaq]   = useState<number|null>(null);
  const [selCat, setSelCat]     = useState("All");

  const filtered = FAQS.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    const matchCat    = selCat==="All" || f.cat===selCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",color:"white"}}>

          {/* Hero */}
          <div style={{background:"linear-gradient(135deg,rgba(2,13,31,0.99),rgba(4,18,42,0.98))",borderBottom:"1px solid rgba(26,107,255,0.12)",padding:"40px 32px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.18) 1px,transparent 1px)",backgroundSize:"26px 26px",opacity:0.15}}/>
            <div style={{position:"relative",zIndex:10}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><VeritasEmblem size={52}/></div>
              <h1 style={{fontSize:"2rem",fontWeight:900,marginBottom:8}}>How can we help?</h1>
              <p style={{color:"rgba(255,255,255,0.45)",marginBottom:20,fontSize:"0.9rem"}}>Search our knowledge base or browse by category</p>
              <div style={{position:"relative",maxWidth:520,margin:"0 auto"}}>
                <Search size={16} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.35)"}}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search help articles..." style={{width:"100%",padding:"14px 16px 14px 44px",background:"rgba(6,18,41,0.9)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:12,color:"white",fontSize:"0.95rem",outline:"none"}}/>
              </div>
            </div>
          </div>

          <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px"}}>

            {/* Category Grid */}
            <h2 style={{fontWeight:800,marginBottom:14,fontSize:"0.85rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)"}}>Browse by Category</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:32}}>
              {CATS.map((cat,i)=>(
                <button key={i} onClick={()=>setSelCat(selCat===cat.label?"All":cat.label)} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"14px 18px",
                  background:`rgba(${cat.color==="#1a6bff"?"26,107,255":"26,107,255"},0.06)`,
                  border:`1px solid ${selCat===cat.label?cat.color:"rgba(26,107,255,0.15)"}`,
                  borderRadius:12,cursor:"pointer",textAlign:"left",transition:"all 0.15s",
                }}>
                  <span style={{color:cat.color}}>{cat.icon}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:"0.85rem",color:"white"}}>{cat.label}</div>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)"}}>{cat.count} articles</div>
                  </div>
                </button>
              ))}
            </div>

            {/* FAQ */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h2 style={{fontWeight:800,fontSize:"0.85rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)"}}>
                {selCat==="All"?"Popular Questions":selCat} ({filtered.length})
              </h2>
              {selCat!=="All"&&<button onClick={()=>setSelCat("All")} style={{fontSize:"0.75rem",color:"#4da6ff",background:"none",border:"none",cursor:"pointer"}}>Clear filter</button>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>
              {filtered.map((faq,i)=>(
                <div key={i} style={{background:"rgba(4,15,36,0.8)",border:`1px solid ${openFaq===i?"rgba(26,107,255,0.3)":"rgba(26,107,255,0.1)"}`,borderRadius:12,overflow:"hidden",transition:"border-color 0.15s"}}>
                  <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",background:"none",border:"none",color:"white",cursor:"pointer",textAlign:"left",gap:12}}>
                    <div>
                      <span style={{fontSize:"0.6rem",color:"#4da6ff",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginRight:8}}>{faq.cat}</span>
                      <span style={{fontWeight:600,fontSize:"0.9rem"}}>{faq.q}</span>
                    </div>
                    <ChevronDown size={16} color="rgba(255,255,255,0.35)" style={{flexShrink:0,transform:openFaq===i?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
                  </button>
                  {openFaq===i&&(
                    <div style={{padding:"0 20px 18px",fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",lineHeight:1.75,borderTop:"1px solid rgba(26,107,255,0.08)"}}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[
                {icon:<MessageSquare size={24}/>,title:"Live Chat",desc:"Talk to our support team in real-time. Avg response: 4 minutes.",cta:"Start Chat",color:"#1a6bff"},
                {icon:<BookOpen size={24}/>,title:"AI Assistant",desc:"Get instant answers from our AI. Available 24/7 with full platform knowledge.",cta:"Ask AI",color:"#a78bfa"},
              ].map((c,i)=>(
                <div key={i} style={{background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:20,display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`rgba(${i===0?"26,107,255":"167,139,250"},0.1)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c.color}}>{c.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,marginBottom:4}}>{c.title}</div>
                    <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.45)",marginBottom:12,lineHeight:1.5}}>{c.desc}</div>
                    <button style={{padding:"8px 18px",background:`rgba(${i===0?"26,107,255":"167,139,250"},0.12)`,border:`1px solid rgba(${i===0?"26,107,255":"167,139,250"},0.25)`,borderRadius:8,color:c.color,fontSize:"0.78rem",fontWeight:700,cursor:"pointer"}}>{c.cta} →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
