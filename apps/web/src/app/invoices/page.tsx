
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Receipt, Plus, Download, Send, CheckCircle2, Clock, AlertCircle, DollarSign, Loader2 } from "lucide-react";

const INVOICES = [
  { id:"INV-2024", client:"TechVentures Inc.", amount:4500, issued:"Jun 14, 2026", due:"Jun 28, 2026", status:"paid",    items:[{desc:"Milestone 2 — Backend API",qty:1,rate:4500}] },
  { id:"INV-2023", client:"FinEdge Capital",   amount:9800, issued:"Jun 8, 2026",  due:"Jun 22, 2026", status:"paid",    items:[{desc:"Milestone 1 — Setup & Auth",qty:1,rate:9800}] },
  { id:"INV-2025", client:"GreenLeaf Studios", amount:1800, issued:"Jun 18, 2026", due:"Jul 2, 2026",  status:"pending", items:[{desc:"Design System Delivery",qty:1,rate:1800}] },
  { id:"INV-2022", client:"Bloom Health",      amount:3200, issued:"May 28, 2026", due:"Jun 11, 2026", status:"overdue", items:[{desc:"Final milestone — Video",qty:1,rate:3200}] },
];

const S_STYLE: Record<string,string> = {
  paid:    "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function InvoicesPage() {
  const [invoices] = useState(INVOICES);
  const [selected,setSelected] = useState(INVOICES[0]);
  const [sending,setSending]   = useState(false);
  const [sent,setSent]         = useState(false);

  function sendReminder(){setSending(true);setTimeout(()=>{setSending(false);setSent(true);setTimeout(()=>setSent(false),2000);},1000);}

  const totalPaid    = invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+i.amount,0);
  const totalPending = invoices.filter(i=>i.status==="pending").reduce((a,i)=>a+i.amount,0);
  const totalOverdue = invoices.filter(i=>i.status==="overdue").reduce((a,i)=>a+i.amount,0);

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><Receipt className="text-yellow-400" size={28}/><h1 className="text-3xl font-black gold-text">Invoices</h1></div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition"><Plus size={18}/>New Invoice</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[["Paid","$"+totalPaid.toLocaleString(),"text-green-400"],["Pending","$"+totalPending.toLocaleString(),"text-yellow-400"],["Overdue","$"+totalOverdue.toLocaleString(),"text-red-400"]].map(([l,v,c],i)=>(
          <div key={i} className="glass-card rounded-2xl p-5 text-center"><div className={"text-2xl font-black mb-1 "+c}>{v}</div><div className="text-xs text-white/50">{l}</div></div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="w-72 flex-shrink-0 space-y-3">
          {invoices.map(inv=>(
            <button key={inv.id} onClick={()=>setSelected(inv)} className={"w-full glass-card rounded-2xl p-4 text-left transition border "+(selected.id===inv.id?"border-yellow-500/30":"border-white/5 hover:border-white/15")}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-white/40">{inv.id}</span>
                <span className={"text-xs px-2 py-0.5 rounded-full border "+S_STYLE[inv.status]}>{inv.status}</span>
              </div>
              <div className="font-semibold text-sm mb-1">{inv.client}</div>
              <div className="text-lg font-black gold-text">${inv.amount.toLocaleString()}</div>
              <div className="text-xs text-white/30 mt-1">Due {inv.due}</div>
            </button>
          ))}
        </div>

        <div className="flex-1 glass-card rounded-3xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-xs text-white/40 font-mono mb-1">{selected.id}</div>
              <h2 className="text-2xl font-black mb-1">{selected.client}</h2>
              <div className="text-sm text-white/50">Issued {selected.issued} · Due {selected.due}</div>
            </div>
            <span className={"text-sm px-3 py-1.5 rounded-xl border font-medium "+S_STYLE[selected.status]}>{selected.status}</span>
          </div>

          <div className="border border-white/10 rounded-2xl overflow-hidden mb-6">
            <div className="grid grid-cols-4 px-5 py-3 text-xs text-white/40 uppercase tracking-wide bg-white/3">
              <div className="col-span-2">Description</div><div>Qty</div><div className="text-right">Amount</div>
            </div>
            {selected.items.map((item,i)=>(
              <div key={i} className="grid grid-cols-4 px-5 py-4 border-t border-white/5">
                <div className="col-span-2 text-sm font-medium">{item.desc}</div>
                <div className="text-sm text-white/60">{item.qty}</div>
                <div className="text-sm font-bold text-right gold-text">${item.rate.toLocaleString()}</div>
              </div>
            ))}
            <div className="grid grid-cols-4 px-5 py-4 border-t border-white/10 bg-white/3">
              <div className="col-span-3 font-bold">Total</div>
              <div className="text-right text-xl font-black gold-text">${selected.amount.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition"><Download size={16}/>Download PDF</button>
            {selected.status!=="paid"&&(
              <button onClick={sendReminder} disabled={sending} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition disabled:opacity-40">
                {sending?<Loader2 size={16} className="animate-spin"/>:sent?<CheckCircle2 size={16}/>:<Send size={16}/>}
                {sent?"Reminder Sent!":"Send Reminder"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main></div></div>
  );
}
