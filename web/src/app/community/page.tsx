
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Globe, Heart, MessageCircle, Share2, Plus, Shield, Flame, TrendingUp, Award, Users, Calendar, BookOpen, Send, X, Loader2 } from "lucide-react";

const POSTS = [
  {id:"1",author:"Alex Chen",  avatar:"AC",score:99,verified:true, time:"2h ago",cat:"Achievement",liked:false,likes:142,comments:38,tags:["TruScore","Milestone"],
   content:"Just hit Trust Score 990! 🏆 The key? Never miss a deadline and over-communicate. I send progress updates every 48 hours whether clients ask or not. Trust is built in the small moments."},
  {id:"2",author:"Maya Rodriguez",avatar:"MR",score:98,verified:true, time:"5h ago",cat:"Tip",liked:true,likes:89,comments:22,tags:["Escrow","Platform"],
   content:"Had my first dispute after 2 years on Veritas. AI arbitration resolved it in 48 hours — $8,400 released. The system genuinely works. Share your escrow protection stories below 👇"},
  {id:"3",author:"James Park",   avatar:"JP",score:97,verified:true, time:"1d ago",cat:"Discussion",liked:false,likes:67,comments:44,tags:["Contracts","Clients"],
   content:"How do you handle scope creep after a contract is signed? Using the AI Contract Writer with explicit change order clauses has been a game-changer. What's your approach?"},
];

const CAT_COLOR:Record<string,string> = {Achievement:"rgba(240,192,64,0.15)",Tip:"rgba(0,212,255,0.12)",Discussion:"rgba(26,107,255,0.12)",Question:"rgba(167,139,250,0.12)"};
const CAT_TEXT:Record<string,string>  = {Achievement:"#f0c040",Tip:"#00d4ff",Discussion:"#4da6ff",Question:"#a78bfa"};

export default function CommunityV2Page() {
  const [tab, setTab]         = useState("Feed");
  const [posts, setPosts]     = useState(POSTS);
  const [showCompose, setShow] = useState(false);
  const [newPost, setNewPost]  = useState("");
  const [newCat, setNewCat]   = useState("Discussion");
  const [posting, setPosting] = useState(false);

  function toggleLike(id:string){ setPosts(p=>p.map(post=>post.id===id?{...post,liked:!post.liked,likes:post.liked?post.likes-1:post.likes+1}:post)); }

  function submit() {
    if(!newPost.trim()) return;
    setPosting(true);
    setTimeout(()=>{
      const p={id:Date.now().toString(),author:"You",avatar:"YO",score:87,verified:true,time:"Just now",cat:newCat,liked:false,likes:0,comments:0,tags:[],content:newPost};
      setPosts(prev=>[p,...prev]);
      setPosting(false);setShow(false);setNewPost("");
    },800);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Globe size={28} color="#1a6bff"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Community</h1>
            </div>
            <button onClick={()=>setShow(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
              <Plus size={17}/> Post
            </button>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {["Feed","Events","Resources","Members"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{t}</button>
            ))}
          </div>

          <div style={{display:"flex",gap:20}}>
            {/* Main */}
            <div style={{flex:1}}>
              {tab==="Feed"&&posts.map(post=>(
                <div key={post.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:18,marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{post.avatar}</div>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,fontWeight:700,marginBottom:1}}>{post.author}{post.verified&&<Shield size={11} color="#1a6bff"/>}<span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",fontWeight:400}}>{post.time}</span></div>
                        <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>Trust Score {post.score}</div>
                      </div>
                    </div>
                    <span style={{fontSize:"0.65rem",padding:"3px 9px",background:CAT_COLOR[post.cat]||"rgba(26,107,255,0.1)",borderRadius:6,color:CAT_TEXT[post.cat]||"#4da6ff",fontWeight:700}}>{post.cat}</span>
                  </div>
                  <p style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.78)",lineHeight:1.65,marginBottom:10}}>{post.content}</p>
                  {post.tags.length>0&&<div style={{display:"flex",gap:5,marginBottom:10}}>{post.tags.map(t=><span key={t} style={{fontSize:"0.65rem",padding:"2px 8px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:5,color:"rgba(255,255,255,0.4)"}}>#{t}</span>)}</div>}
                  <div style={{display:"flex",gap:16,paddingTop:10,borderTop:"1px solid rgba(26,107,255,0.07)"}}>
                    {[
                      {icon:<Heart size={15} fill={post.liked?"#ff5555":"none"} color={post.liked?"#ff5555":"rgba(255,255,255,0.4)"}/>,label:post.likes,action:()=>toggleLike(post.id)},
                      {icon:<MessageCircle size={15} color="rgba(255,255,255,0.4)"/>,label:post.comments,action:()=>{}},
                      {icon:<Share2 size={15} color="rgba(255,255,255,0.4)"/>,label:"Share",action:()=>{}},
                    ].map((a,i)=>(
                      <button key={i} onClick={a.action} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",padding:0}}>
                        {a.icon}{a.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {tab==="Events"&&(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[
                    {title:"Veritas Summit 2026",date:"Aug 15",type:"Virtual",attendees:1247,desc:"Annual gathering of the top 100 Veritas professionals.",hot:true},
                    {title:"AI Freelancing Masterclass",date:"Jul 22",type:"Webinar",attendees:456,desc:"How to use AI tools to 10x your freelancing income.",hot:false},
                    {title:"Web3 Contracts & Escrow AMA",date:"Jul 18",type:"Live Q&A",attendees:289,desc:"Deep dive into smart escrow and dispute prevention.",hot:false},
                  ].map((e,i)=>(
                    <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:18}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{fontWeight:800,fontSize:"0.95rem"}}>{e.title}</div>
                          {e.hot&&<span style={{fontSize:"0.62rem",padding:"2px 7px",background:"rgba(255,100,0,0.1)",border:"1px solid rgba(255,100,0,0.25)",borderRadius:5,color:"#ff6600",display:"flex",alignItems:"center",gap:3,fontWeight:700}}><Flame size={9}/>Hot</span>}
                        </div>
                        <span style={{fontSize:"0.68rem",padding:"3px 9px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:6,color:"#4da6ff"}}>{e.type}</span>
                      </div>
                      <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",marginBottom:8,display:"flex",gap:12}}>
                        <span>📅 {e.date}, 2026</span><span>👥 {e.attendees.toLocaleString()} attending</span>
                      </div>
                      <p style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.55)",marginBottom:12,lineHeight:1.5}}>{e.desc}</p>
                      <button style={{padding:"8px 16px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:8,color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>Register Free →</button>
                    </div>
                  ))}
                </div>
              )}

              {tab==="Resources"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[["📋","Freelancing Starter Guide","Everything to launch on Veritas"],["⚖️","Legal Contract Templates","10+ ready-to-use templates"],["🏆","Trust Score Playbook","Get from 0 to 900+ in 90 days"],["🔐","Web3 Security Handbook","Protect your wallet and identity"],["💰","Pricing Guide by Category","Market rates for every skill"],["🤖","AI Tools for Freelancers","Boost output with AI workflows"]].map(([ic,t,d],i)=>(
                    <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:16,cursor:"pointer"}}>
                      <div style={{fontSize:"1.8rem",marginBottom:8}}>{ic}</div>
                      <div style={{fontWeight:700,marginBottom:4,fontSize:"0.9rem"}}>{t}</div>
                      <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{d}</div>
                    </div>
                  ))}
                </div>
              )}

              {tab==="Members"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {POSTS.map((p,i)=>(
                    <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{p.avatar}</div>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:5,fontWeight:700,fontSize:"0.88rem"}}>{p.author}{p.verified&&<Shield size={11} color="#1a6bff"/>}</div>
                          <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>Trust Score {p.score}</div>
                        </div>
                      </div>
                      <button style={{padding:"6px 12px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,color:"#4da6ff",fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>Follow</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:16}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12,fontWeight:800,fontSize:"0.88rem"}}><TrendingUp size={15} color="#f0c040"/>Trending</div>
                {["#TruScore","#Web3Freelance","#SmartEscrow","#AIContracts","#FreelanceTips"].map((t,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:"0.78rem"}}>
                    <span style={{color:"#4da6ff"}}>{t}</span>
                    <span style={{color:"rgba(255,255,255,0.3)"}}>{Math.floor(Math.random()*400+50)} posts</span>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:16}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12,fontWeight:800,fontSize:"0.88rem"}}><Award size={15} color="#f0c040"/>Community Stats</div>
                {[["Active Members","12,847"],["Posts Today","3,291"],["Jobs Posted","891"],["Resolution Rate","99.2%"]].map(([l,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:"0.78rem",borderBottom:i<3?"1px solid rgba(26,107,255,0.06)":"none"}}>
                    <span style={{color:"rgba(255,255,255,0.5)"}}>{l}</span><span style={{fontWeight:700,color:"#f0c040"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showCompose&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:24,width:"100%",maxWidth:480,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontWeight:900,fontSize:"1.05rem"}}>Share with Community</div>
                  <button onClick={()=>setShow(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                <div style={{display:"flex",gap:6,marginBottom:10}}>
                  {["Discussion","Tip","Achievement","Question"].map(c=>(
                    <button key={c} onClick={()=>setNewCat(c)} style={{padding:"5px 11px",borderRadius:8,border:`1px solid ${newCat===c?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:newCat===c?"rgba(26,107,255,0.12)":"transparent",color:newCat===c?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>{c}</button>
                  ))}
                </div>
                <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} rows={5} placeholder="Share an insight, tip, or achievement..." style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:10,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.55,marginBottom:12}}/>
                <div style={{display:"flex",gap:9}}>
                  <button onClick={()=>setShow(false)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:"0.85rem"}}>Cancel</button>
                  <button onClick={submit} disabled={!newPost.trim()||posting} style={{flex:2,padding:"11px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!newPost.trim()?0.4:1}}>
                    {posting?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<Send size={15}/>}{posting?"Posting...":"Post"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
