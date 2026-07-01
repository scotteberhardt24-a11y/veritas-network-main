
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { TrendingUp, Star, Clock, DollarSign, Users, Zap, Award, BarChart3, Target, ThumbsUp, Sparkles } from "lucide-react";

const WEEKLY = [
  {week:"Apr W4",score:89,earn:8200,jobs:3,response:4.2},
  {week:"May W1",score:90,earn:9400,jobs:4,response:3.8},
  {week:"May W2",score:91,earn:11200,jobs:5,response:3.1},
  {week:"May W3",score:92,earn:10800,jobs:4,response:2.9},
  {week:"May W4",score:93,earn:14100,jobs:6,response:2.4},
  {week:"Jun W1",score:93,earn:12900,jobs:5,response:2.1},
  {week:"Jun W2",score:94,earn:15700,jobs:7,response:1.8},
  {week:"Jun W3",score:94,earn:17200,jobs:8,response:1.6},
];

const INSIGHTS = [
  {type:"win",  icon:"🚀", title:"Response Time Improved 62%",          desc:"Down from 4.2h to 1.6h avg over 8 weeks. This alone added +15 Trust Score points.",               action:"Keep it up"},
  {type:"win",  icon:"💰", title:"Earnings Up 110% in 8 Weeks",         desc:"From $8,200 to $17,200/week. Your higher Trust Score is unlocking premium client budgets.",        action:"View Trend"},
  {type:"warn", icon:"⚠️", title:"Proposal Acceptance Rate Plateaued",  desc:"Acceptance stuck at 36% for 3 weeks. Adding 2-3 portfolio items could push this above 45%.",      action:"Add Work"},
  {type:"tip",  icon:"💡", title:"Best Time to Apply: Tuesday 9–11am",  desc:"89% of your accepted proposals were submitted Tuesday mornings. AI detected this pattern.",        action:"Set Reminder"},
  {type:"win",  icon:"🏆", title:"Top 5% in Response Rate Globally",    desc:"Your 1.6h avg response puts you in the elite tier. Clients prioritize your proposals.",             action:"View Rank"},
];

export default function PerformanceInsightsPage() {
  const [period, setPeriod] = useState("8w");
  const latest = WEEKLY[WEEKLY.length-1];
  const first   = WEEKLY[0];
  const earnGrowth = Math.round(((latest.earn-first.earn)/first.earn)*100);
  const respImprovement = Math.round(((first.response-latest.response)/first.response)*100);
  const max = Math.max(...WEEKLY.map(w=>w.earn));

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <TrendingUp size={28} color="#00e676"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Performance Insights</h1>
            </div>
            <div style={{display:"flex",gap:6}}>
              {["4w","8w","3mo","6mo"].map(p=>(
                <button key={p} onClick={()=>setPeriod(p)} style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${period===p?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:period===p?"rgba(26,107,255,0.12)":"transparent",color:period===p?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>{p}</button>
              ))}
            </div>
          </div>

          {/* KPI Highlights */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {icon:<DollarSign size={20}/>, label:"Earnings Growth",    value:`+${earnGrowth}%`,    sub:"vs 8 weeks ago",     color:"#00e676"},
              {icon:<Clock size={20}/>,     label:"Avg Response Time",  value:"1.6h",               sub:`Improved ${respImprovement}%`, color:"#4da6ff"},
              {icon:<Star size={20}/>,      label:"Client Rating",      value:"5.0★",               sub:"Last 12 reviews",    color:"#f0c040"},
              {icon:<Zap size={20}/>,       label:"Accept Rate",        value:"36%",                sub:"Industry avg: 22%",  color:"#00d4ff"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                <div style={{fontSize:"0.62rem",color:"#00e676",marginTop:3,fontWeight:600}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Earnings chart */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22,marginBottom:16}}>
            <div style={{fontWeight:800,marginBottom:16,fontSize:"0.95rem",display:"flex",alignItems:"center",gap:8}}>
              <BarChart3 size={18} color="#4da6ff"/> Weekly Earnings Trend
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120}}>
              {WEEKLY.map((w,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:"0.62rem",color:"#00e676",fontWeight:700}}>${(w.earn/1000).toFixed(0)}K</div>
                  <div style={{width:"100%",background:"linear-gradient(180deg,#00e676,rgba(26,107,255,0.6))",borderRadius:"4px 4px 0 0",minHeight:6,transition:"height 0.6s",height:`${Math.round((w.earn/max)*100)}px`}}/>
                  <div style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.35)",whiteSpace:"nowrap"}}>{w.week.split(" ")[1]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div style={{fontWeight:800,marginBottom:14,fontSize:"0.95rem",display:"flex",alignItems:"center",gap:8}}>
            <Sparkles size={18} color="#f0c040"/> AI-Detected Insights
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {INSIGHTS.map((ins,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"16px 18px",background:"rgba(4,15,36,0.9)",border:`1px solid ${ins.type==="warn"?"rgba(240,192,64,0.2)":ins.type==="tip"?"rgba(0,212,255,0.15)":"rgba(0,200,83,0.15)"}`,borderRadius:14}}>
                <div style={{fontSize:"1.6rem",flexShrink:0,marginTop:2}}>{ins.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:"0.92rem",marginBottom:4}}>{ins.title}</div>
                  <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>{ins.desc}</div>
                </div>
                <button style={{padding:"7px 13px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,color:"#4da6ff",fontSize:"0.74rem",fontWeight:600,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{ins.action}</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
