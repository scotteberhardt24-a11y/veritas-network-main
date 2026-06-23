
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";

const POSTS = [
  {id:"1",title:"How Trust Score is Changing the Way Clients Hire",cat:"Platform",read:"8 min",date:"Jun 15, 2026",img:"🏆",featured:true,excerpt:"We built Trust Score to solve the biggest problem in freelancing. Here's how 47 signals combine into one portable number that changes everything."},
  {id:"2",title:"Web3 Escrow vs. Traditional Payments: A Deep Dive",cat:"Web3",read:"12 min",date:"Jun 10, 2026",img:"🔗",featured:true,excerpt:"Smart contract escrow isn't just faster — it's structurally safer. We break down exactly how Veritas Vault protects every dollar."},
  {id:"3",title:"From $0 to $200K: Priya's Veritas Success Story",cat:"Success Story",read:"5 min",date:"Jun 5, 2026",img:"💰",featured:false,excerpt:"In 14 months, Priya Sharma went from zero to six figures on Veritas. Here's exactly what she did differently from day one."},
  {id:"4",title:"AI Matching: Why 94% of Our Proposals Get Responses",cat:"Product",read:"6 min",date:"May 28, 2026",img:"🤖",featured:false,excerpt:"Traditional job boards show you everything. Our AI shows you what you'll actually win. The math behind the matching engine."},
  {id:"5",title:"The NFT Trust Passport: Your Credentials On-Chain",cat:"Web3",read:"9 min",date:"May 20, 2026",img:"🛡️",featured:false,excerpt:"Your work history belongs to you — not to any platform. Here's how Veritas Passport works and why it matters for your career."},
  {id:"6",title:"DAO Governance: How the Community Runs Veritas",cat:"Platform",read:"7 min",date:"May 12, 2026",img:"🗳️",featured:false,excerpt:"Every major platform decision goes to a community vote. Here's how token holders shape fees, features, and policy."},
];

const CATS=["All","Platform","Web3","Product","Success Story"];

export default function BlogPage(){
  const router=useRouter();
  const [cat,setCat]=useState("All");
  const featured=POSTS.filter(p=>p.featured);
  const filtered=(cat==="All"?POSTS:POSTS.filter(p=>p.cat===cat)).filter(p=>!p.featured);

  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={36}/>
          <div><div style={{fontSize:"1.05rem",fontWeight:900,letterSpacing:"0.08em"}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/dashboard")} style={{padding:"9px 18px",borderRadius:9,border:"1px solid rgba(26,107,255,0.2)",background:"rgba(26,107,255,0.06)",color:"#4da6ff",fontSize:"0.82rem",cursor:"pointer",fontWeight:600}}>Dashboard</button>
      </nav>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <VeritasEmblem size={40}/>
          <h1 style={{fontSize:"2rem",fontWeight:900,margin:0}}>Veritas Blog</h1>
        </div>

        {/* Featured */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
          {featured.map(post=>(
            <div key={post.id} style={{background:"linear-gradient(135deg,rgba(4,15,36,0.97),rgba(6,18,41,0.94))",border:"1.5px solid rgba(240,192,64,0.15)",borderRadius:18,overflow:"hidden",cursor:"pointer"}}>
              <div style={{height:130,background:"linear-gradient(135deg,rgba(26,107,255,0.12),rgba(0,100,200,0.08))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3.5rem"}}>{post.img}</div>
              <div style={{padding:18}}>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <span style={{fontSize:"0.65rem",padding:"3px 8px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:6,color:"#f0c040",fontWeight:700}}>{post.cat}</span>
                  <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",display:"flex",alignItems:"center",gap:4}}><Clock size={10}/>{post.read} read</span>
                </div>
                <h2 style={{fontWeight:900,fontSize:"1rem",marginBottom:7,lineHeight:1.3}}>{post.title}</h2>
                <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.45)",marginBottom:10,lineHeight:1.6}}>{post.excerpt}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.3)"}}>{post.date}</span>
                  <span style={{fontSize:"0.75rem",color:"#4da6ff",display:"flex",alignItems:"center",gap:4}}>Read more<ArrowRight size={13}/></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${cat===c?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:cat===c?"rgba(26,107,255,0.12)":"transparent",color:cat===c?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>{c}</button>)}
        </div>

        {/* List */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(post=>(
            <div key={post.id} style={{display:"flex",gap:14,padding:16,background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:14,cursor:"pointer",alignItems:"flex-start"}}>
              <div style={{width:52,height:52,borderRadius:12,background:"rgba(26,107,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",flexShrink:0}}>{post.img}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,marginBottom:5}}>
                  <span style={{fontSize:"0.62rem",padding:"2px 7px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:5,color:"rgba(255,255,255,0.45)"}}>{post.cat}</span>
                  <span style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}><Clock size={9} style={{display:"inline"}}/> {post.read} · {post.date}</span>
                </div>
                <div style={{fontWeight:700,marginBottom:4,fontSize:"0.9rem"}}>{post.title}</div>
                <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{post.excerpt}</div>
              </div>
              <ArrowRight size={16} color="rgba(255,255,255,0.2)" style={{flexShrink:0,marginTop:4}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
