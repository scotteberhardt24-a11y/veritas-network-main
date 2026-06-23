
"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { MessageSquare, Search, Send, Shield, Paperclip, MoreVertical, CheckCheck, Loader2, Phone, Video, Info, Smile } from "lucide-react";

const THREADS = [
  { id:"1", name:"Brian Walsh",    company:"TechVentures Inc.",  avatar:"BW", last:"Can we hop on a call today?",                    time:"2m",  unread:2, online:true,  score:91, verified:true  },
  { id:"2", name:"Amy Chen",      company:"GreenLeaf Studios",   avatar:"AC", last:"The design looks amazing! When can we...",        time:"1h",  unread:0, online:true,  score:87, verified:true  },
  { id:"3", name:"David Price",   company:"FinEdge Capital",     avatar:"DP", last:"Please send the revised draft when ready.",       time:"3h",  unread:1, online:false, score:94, verified:true  },
  { id:"4", name:"Nadia Rose",    company:"Bloom Health",        avatar:"NR", last:"Contract signed ✓ Looking forward to it!",       time:"1d",  unread:0, online:false, score:82, verified:false },
  { id:"5", name:"Kevin Marsh",   company:"SaaS Growth Labs",    avatar:"KM", last:"What's your availability next week?",             time:"2d",  unread:0, online:false, score:89, verified:true  },
  { id:"6", name:"Lisa Chen",     company:"FinVault Inc.",       avatar:"LC", last:"The proposal looks great, just a few questions.", time:"3d",  unread:0, online:false, score:86, verified:true  },
];

const MSG_DATA: Record<string,{from:"me"|"them";text:string;time:string;read:boolean}[]> = {
  "1":[
    {from:"them",text:"Hey Scott! I saw your proposal for the SaaS dashboard — really impressive portfolio, especially the FinVault project.",time:"Yesterday 9:14am",read:true},
    {from:"me",  text:"Thanks Brian! That's one of my favorites too. I've built 4 similar platforms in the last 18 months. Happy to walk you through the architecture on a call.",time:"Yesterday 9:31am",read:true},
    {from:"them",text:"That would be great. Can we hop on a call today? I'm free at 3pm PST.",time:"2m ago",read:false},
  ],
  "2":[
    {from:"them",text:"Scott, the brand identity package is absolutely stunning. You completely nailed our vision.",time:"2h ago",read:true},
    {from:"me",  text:"So glad you love it! Ready to send the final Figma files and all export assets whenever you're ready.",time:"1h ago",read:true},
    {from:"them",text:"The design looks amazing! When can we schedule the final handoff call?",time:"1h ago",read:true},
  ],
  "3":[
    {from:"me",  text:"Hi David, here's the first batch — articles 1–5 of 20 are complete. Let me know your thoughts!",time:"4h ago",read:true},
    {from:"them",text:"Good start. The tone is slightly too technical for our audience. Please send the revised draft when ready.",time:"3h ago",read:true},
  ],
};

export default function MessagesV2Page() {
  const [selectedId, setSel] = useState("1");
  const [search, setSearch]  = useState("");
  const [input, setInput]    = useState("");
  const [msgs, setMsgs]      = useState(MSG_DATA);
  const [threads, setThreads]= useState(THREADS);
  const [sending, setSending]= useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);

  const thread = threads.find(t=>t.id===selectedId)!;
  const curMsgs= msgs[selectedId]||[];

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[selectedId,msgs]);

  const filtered = threads.filter(t=>!search||t.name.toLowerCase().includes(search.toLowerCase())||t.company.toLowerCase().includes(search.toLowerCase()));

  function send() {
    if(!input.trim()||sending) return;
    const text=input.trim(); setInput(""); setSending(true);
    const newMsg={from:"me" as const,text,time:"Just now",read:true};
    setMsgs(p=>({...p,[selectedId]:[...(p[selectedId]||[]),newMsg]}));
    setThreads(p=>p.map(t=>t.id===selectedId?{...t,last:text,time:"now",unread:0}:t));
    setTimeout(()=>setSending(false),300);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <TopBar/>
        <div style={{flex:1,display:"flex",overflow:"hidden",padding:16,gap:12,height:"calc(100vh - 60px)"}}>

          {/* Thread list */}
          <div style={{width:300,flexShrink:0,background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:16,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <MessageSquare size={18} color="#1a6bff"/>
                <span style={{fontWeight:800,color:"white"}}>Messages</span>
                {threads.reduce((a,t)=>a+t.unread,0)>0&&<span style={{marginLeft:"auto",background:"#ff3333",color:"white",fontSize:"0.65rem",fontWeight:800,padding:"2px 7px",borderRadius:12}}>{threads.reduce((a,t)=>a+t.unread,0)}</span>}
              </div>
              <div style={{position:"relative"}}>
                <Search size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations..." style={{width:"100%",padding:"8px 10px 8px 30px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,color:"white",fontSize:"0.78rem",outline:"none"}}/>
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto"}}>
              {filtered.map(t=>(
                <div key={t.id} onClick={()=>{setSel(t.id);setThreads(p=>p.map(x=>x.id===t.id?{...x,unread:0}:x));}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer",borderBottom:"1px solid rgba(26,107,255,0.05)",background:selectedId===t.id?"rgba(26,107,255,0.1)":"transparent",transition:"background 0.15s"}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.88rem",color:"white"}}>{t.avatar}</div>
                    {t.online&&<span style={{position:"absolute",bottom:-1,right:-1,width:10,height:10,borderRadius:"50%",background:"#00e676",border:"2px solid #040f24"}}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontWeight:700,fontSize:"0.85rem",color:"white",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</span>
                      <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",flexShrink:0,marginLeft:4}}>{t.time}</span>
                    </div>
                    <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.38)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.company}</div>
                    <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.5)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:1}}>{t.last}</div>
                  </div>
                  {t.unread>0&&<span style={{width:18,height:18,borderRadius:"50%",background:"#1a6bff",color:"white",fontSize:"0.62rem",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.unread}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div style={{flex:1,background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:16,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Header */}
            <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(26,107,255,0.1)",display:"flex",alignItems:"center",gap:12}}>
              <div style={{position:"relative"}}>
                <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{thread.avatar}</div>
                {thread.online&&<span style={{position:"absolute",bottom:-1,right:-1,width:10,height:10,borderRadius:"50%",background:"#00e676",border:"2px solid #040f24"}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,fontWeight:700,color:"white"}}>
                  {thread.name}{thread.verified&&<Shield size={12} color="#1a6bff"/>}
                </div>
                <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)"}}>{thread.company} · Score {thread.score} · {thread.online?"Online":"Offline"}</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {[Phone,Video,Info].map((Icon,i)=>(
                  <button key={i} style={{width:34,height:34,borderRadius:9,background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                    <Icon size={15} color="rgba(255,255,255,0.55)"/>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
              {curMsgs.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:8,flexDirection:m.from==="me"?"row-reverse":"row",alignItems:"flex-end"}}>
                  {m.from==="them"&&<div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:700,flexShrink:0}}>{thread.avatar}</div>}
                  <div style={{maxWidth:"72%"}}>
                    <div style={{padding:"10px 14px",borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.from==="me"?"rgba(26,107,255,0.2)":"rgba(255,255,255,0.06)",border:`1px solid ${m.from==="me"?"rgba(26,107,255,0.3)":"rgba(255,255,255,0.08)"}`,fontSize:"0.85rem",lineHeight:1.55,color:"rgba(255,255,255,0.9)"}}>
                      {m.text}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginTop:3,justifyContent:m.from==="me"?"flex-end":"flex-start",fontSize:"0.62rem",color:"rgba(255,255,255,0.28)"}}>
                      {m.time}{m.from==="me"&&<CheckCheck size={11} color={m.read?"#1a6bff":"rgba(255,255,255,0.25)"}/>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef}/>
            </div>

            {/* Input */}
            <div style={{padding:"12px 16px",borderTop:"1px solid rgba(26,107,255,0.1)",display:"flex",gap:8,alignItems:"flex-end"}}>
              <button style={{width:36,height:36,borderRadius:9,background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><Paperclip size={16} color="rgba(255,255,255,0.45)"/></button>
              <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={`Message ${thread.name}...`} rows={1} style={{flex:1,padding:"10px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:10,color:"white",fontSize:"0.88rem",outline:"none",resize:"none",lineHeight:1.5,maxHeight:120}} onInput={e=>{const el=e.currentTarget;el.style.height="auto";el.style.height=Math.min(el.scrollHeight,120)+"px";}}/>
              <button onClick={send} disabled={!input.trim()||sending} style={{width:40,height:40,borderRadius:10,background:input.trim()?"linear-gradient(135deg,#1a6bff,#0050dd)":"rgba(26,107,255,0.1)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,boxShadow:input.trim()?"0 2px 12px rgba(26,107,255,0.4)":"none",transition:"all 0.2s",opacity:input.trim()?1:0.5}}>
                {sending?<Loader2 size={17} color="white" style={{animation:"spin 1s linear infinite"}}/>:<Send size={17} color="white"/>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
