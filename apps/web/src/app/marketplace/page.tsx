
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Users, Shield, Star, Zap, Search, SlidersHorizontal, Filter, CheckCircle2, MapPin, Clock, DollarSign } from "lucide-react";

const WORKERS = [
  { id:"W001", name:"Alex Chen",    username:"alexchen.dev", avatar:"AC", score:99, title:"Full-Stack Developer",    rate:150, skills:["Next.js","TypeScript","PostgreSQL","Stripe"],   rating:5.0, jobs:247, available:true,  verified:true,  location:"San Francisco" },
  { id:"W002", name:"Maya Rodriguez",username:"maya.designs",avatar:"MR",score:98, title:"UI/UX Designer",         rate:120, skills:["Figma","Design Systems","Tailwind","Framer"],    rating:5.0, jobs:189, available:true,  verified:true,  location:"New York" },
  { id:"W003", name:"James Park",   username:"jpark.writes", avatar:"JP", score:97, title:"Content Strategist",     rate:80,  skills:["SEO","Finance","Long-form","Research"],           rating:5.0, jobs:312, available:false, verified:true,  location:"Austin" },
  { id:"W004", name:"Priya Sharma", username:"priyadev",     avatar:"PS", score:96, title:"Backend Engineer",        rate:140, skills:["Node.js","AWS","PostgreSQL","Docker"],            rating:4.9, jobs:156, available:true,  verified:true,  location:"Remote" },
  { id:"W005", name:"Zoe Larsson",  username:"zoe.vid",      avatar:"ZL", score:90, title:"Video Producer",         rate:95,  skills:["After Effects","Premiere","Motion","VO"],         rating:4.8, jobs:267, available:true,  verified:false, location:"London" },
  { id:"W006", name:"Carlos Rivera",username:"carloslima",   avatar:"CR", score:87, title:"Growth Marketer",        rate:75,  skills:["Google Ads","Meta Ads","Analytics","CRO"],        rating:4.7, jobs:167, available:false, verified:true,  location:"Miami" },
];

const CATS=["All","Development","Design","Writing","Marketing","Video","Consulting"];

export default function MarketplaceV2Page() {
  const [workers] = useState(WORKERS);
  const [search,setSearch]   = useState("");
  const [cat,setCat]         = useState("All");
  const [availOnly,setAvailOnly] = useState(false);

  const filtered = workers.filter(w=>{
    const q=search.toLowerCase();
    return (cat==="All"||w.title.toLowerCase().includes(cat.toLowerCase().slice(0,-1)))&&
           (!availOnly||w.available)&&
           (!q||w.name.toLowerCase().includes(q)||w.skills.some(s=>s.toLowerCase().includes(q)));
  });

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6"><Users className="text-yellow-400" size={28}/><h1 className="text-3xl font-black gold-text">Find Talent</h1></div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-3.5 text-white/40"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, skill, or specialty..." className="veritas-input pl-10 py-3 text-sm"/>
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm cursor-pointer hover:bg-white/5 transition">
          <input type="checkbox" checked={availOnly} onChange={e=>setAvailOnly(e.target.checked)} className="rounded"/>
          <span className="text-white/60">Available now</span>
        </label>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={"px-4 py-2 rounded-xl text-xs font-medium transition "+(cat===c?"bg-yellow-500/20 text-yellow-400 border border-yellow-500/30":"border border-white/10 text-white/50 hover:text-white hover:bg-white/5")}>{c}</button>)}
      </div>

      <p className="text-sm text-white/40 mb-4">{filtered.length} professionals found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(w=>(
          <div key={w.id} className="glass-card rounded-2xl p-5 hover:bg-white/[0.02] transition border border-white/5 hover:border-yellow-500/20 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-black">{w.avatar}</div>
                  {w.available&&<span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-black"/>}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">{w.name}{w.verified&&<Shield size={12} className="text-yellow-400"/>}</div>
                  <div className="text-xs text-white/40">{w.title}</div>
                </div>
              </div>
              <div className="text-right"><div className="text-xl font-black gold-text">{w.score}</div><div className="text-xs text-white/30">TruScore</div></div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {w.skills.slice(0,3).map(s=><span key={s} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50">{s}</span>)}
              {w.skills.length>3&&<span className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/30">+{w.skills.length-3}</span>}
            </div>

            <div className="flex items-center justify-between text-xs text-white/50 mb-4">
              <span className="flex items-center gap-1"><DollarSign size={10}/>${w.rate}/hr</span>
              <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400" fill="currentColor"/>{w.rating}</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={10}/>{w.jobs} jobs</span>
              <span className="flex items-center gap-1"><MapPin size={10}/>{w.location}</span>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500/30 transition">View Profile & Hire</button>
          </div>
        ))}
      </div>
    </main></div></div>
  );
}
