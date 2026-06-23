
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Search, Shield, Star, Zap, Filter, TrendingUp } from "lucide-react";

const ALL_RESULTS = [
  { type:"worker", name:"Alex Chen",    username:"alexchen.dev", score:99, skills:["Next.js","TypeScript","PostgreSQL"], rate:"$150/hr", jobs:247, available:true  },
  { type:"worker", name:"Maya Rodriguez",username:"maya.designs",score:98, skills:["Figma","UI/UX","Design Systems"],   rate:"$120/hr", jobs:189, available:true  },
  { type:"job",    title:"React Native App Developer", client:"Bloom Health",   budget:"$15,000–$20,000", category:"Development", score:99, posted:"3h ago", urgent:true },
  { type:"worker", name:"James Park",   username:"jpark.writes", score:97, skills:["SEO","Finance","Long-form"],         rate:"$80/hr",  jobs:312, available:false },
  { type:"job",    title:"Brand Identity Design System", client:"GreenLeaf",  budget:"$3,500–$5,000",   category:"Design",       score:94, posted:"5h ago", urgent:false},
  { type:"worker", name:"Priya Sharma", username:"priyadev",     score:96, skills:["Node.js","AWS","Docker"],            rate:"$140/hr", jobs:156, available:true  },
];

export default function SearchPage() {
  const [q,setQ]           = useState("");
  const [tab,setTab]       = useState<"all"|"workers"|"jobs">("all");
  const [searched,setSearched] = useState(false);

  const results = ALL_RESULTS.filter(r=>{
    const matchTab = tab==="all"||(tab==="workers"&&r.type==="worker")||(tab==="jobs"&&r.type==="job");
    const matchQ   = !q||("name" in r?r.name:r.title).toLowerCase().includes(q.toLowerCase());
    return matchTab&&matchQ;
  });

  function doSearch(e:React.FormEvent){e.preventDefault();setSearched(true);}

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black gold-text mb-3">Find Anything on Veritas</h1>
          <p className="text-white/50">Search workers, jobs, clients, and more</p>
        </div>
        <form onSubmit={doSearch} className="relative mb-6">
          <Search size={20} className="absolute left-5 top-4 text-white/40"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search workers, skills, job titles..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white text-lg outline-none focus:border-yellow-500/50 transition"/>
          <button type="submit" className="absolute right-3 top-2.5 px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition">Search</button>
        </form>

        <div className="flex gap-2 mb-6">
          {(["all","workers","jobs"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={"px-4 py-2 rounded-xl text-sm font-medium capitalize transition "+(tab===t?"bg-yellow-500/20 text-yellow-400 border border-yellow-500/30":"border border-white/10 text-white/40 hover:text-white")}>{t}</button>)}
        </div>

        {!searched?(
          <div className="text-center py-16 text-white/30">
            <Search size={48} className="mx-auto mb-4 opacity-30"/>
            <div className="text-lg">Start typing to search workers and jobs</div>
          </div>
        ):(
          <div className="space-y-3">
            <p className="text-sm text-white/40 mb-4">{results.length} results for "{q||"everything"}"</p>
            {results.map((r,i)=>(
              r.type==="worker"?(
                <div key={i} className="glass-card rounded-2xl p-5 flex items-center justify-between hover:bg-white/3 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-black">{r.name[0]}</div>
                    <div>
                      <div className="flex items-center gap-2 font-bold">{r.name}<Shield size={12} className="text-yellow-400"/></div>
                      <div className="text-xs text-white/40">@{r.username} · {r.rate}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">{r.skills.map(s=><span key={s} className="text-xs px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/50">{s}</span>)}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black gold-text">{r.score}</div>
                    <div className="text-xs text-white/40">TruScore</div>
                    <div className={"text-xs mt-1 "+(r.available?"text-green-400":"text-white/30")}>{r.available?"Available":"Busy"}</div>
                  </div>
                </div>
              ):(
                <div key={i} className="glass-card rounded-2xl p-5 hover:bg-white/3 transition cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      {"urgent" in r&&r.urgent&&<span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium mb-2 inline-block">⚡ Urgent</span>}
                      <div className="font-bold text-lg">{"title" in r?r.title:""}</div>
                      <div className="text-sm text-white/50 mt-1">{"client" in r?r.client:""} · {"budget" in r?r.budget:""}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-2xl font-black gold-text">{"score" in r?r.score:""}%</div>
                      <div className="text-xs text-white/40">AI Match</div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </main></div></div>
  );
}
