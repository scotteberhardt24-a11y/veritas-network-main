
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Image, Plus, ExternalLink, Star, Trash2, Edit3, Globe, Github, Eye } from "lucide-react";

const PROJECTS = [
  { id:"1", title:"FinVault SaaS Dashboard",    cat:"Development", img:"💻", desc:"Full-stack Next.js 15 platform with Stripe billing, role-based auth, and real-time analytics dashboard.", tech:["Next.js","PostgreSQL","Stripe","Tailwind"], url:"https://finvault.io", stars:5, views:342, featured:true  },
  { id:"2", title:"GreenLeaf Brand Identity",   cat:"Design",      img:"🎨", desc:"Complete rebrand including logo system, color palette, typography guide, and 60+ UI component library in Figma.", tech:["Figma","Illustrator","Design Tokens"],   url:"",                 stars:5, views:218, featured:true  },
  { id:"3", title:"CloudSync API Integration",  cat:"Development", img:"⚡", desc:"Architected RESTful API layer connecting 4 third-party services with webhook handling and retry logic.",           tech:["Node.js","Express","Redis","Docker"],   url:"https://github.com",stars:4, views:89,  featured:false },
  { id:"4", title:"Bloom Health Mobile App",    cat:"Mobile",      img:"📱", desc:"React Native health tracker with Apple Watch integration, push notifications, and offline-first architecture.",      tech:["React Native","Expo","Firebase"],       url:"",                 stars:5, views:156, featured:false },
];

export default function PortfolioPage() {
  const [projects] = useState(PROJECTS);
  const [filter,setFilter] = useState("All");
  const cats = ["All",...Array.from(new Set(projects.map(p=>p.cat)))];
  const filtered = filter==="All"?projects:projects.filter(p=>p.cat===filter);

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><Image className="text-yellow-400" size={28}/><h1 className="text-3xl font-black gold-text">Portfolio</h1></div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition"><Plus size={18}/>Add Project</button>
      </div>

      <div className="flex gap-2 mb-6">
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} className={"px-4 py-2 rounded-xl text-sm font-medium transition "+(filter===c?"bg-yellow-500/20 text-yellow-400 border border-yellow-500/30":"border border-white/10 text-white/50 hover:text-white hover:bg-white/5")}>{c}</button>)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {filtered.map(p=>(
          <div key={p.id} className={"glass-card rounded-2xl overflow-hidden border "+(p.featured?"border-yellow-500/20":"border-white/5")}>
            <div className="h-36 bg-gradient-to-br from-yellow-500/10 to-cyan-500/10 flex items-center justify-center relative">
              <span className="text-6xl">{p.img}</span>
              {p.featured&&<span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium">⭐ Featured</span>}
              <div className="absolute top-3 right-3 flex gap-1">
                <button className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center hover:bg-black/60 transition"><Edit3 size={14} className="text-white/60"/></button>
                <button className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center hover:bg-red-500/30 transition"><Trash2 size={14} className="text-white/40 hover:text-red-400"/></button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <span className="text-xs text-white/40">{p.cat}</span>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  {Array.from({length:p.stars}).map((_,i)=><Star key={i} size={12} className="text-yellow-400" fill="currentColor"/>)}
                </div>
              </div>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tech.map(t=><span key={t} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50">{t}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-white/30"><Eye size={12}/>{p.views} views</div>
                <div className="flex gap-2">
                  {p.url&&<a href={p.url} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white transition"><Globe size={12}/>Live</a>}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white transition"><Github size={12}/>Repo</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main></div></div>
  );
}
