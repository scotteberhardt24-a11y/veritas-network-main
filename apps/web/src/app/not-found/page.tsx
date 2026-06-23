
"use client";
import { useRouter } from "next/navigation";
import { Shield, Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:"linear-gradient(135deg,#0a0a0f 0%,#0d1117 50%,#0a0a0f 100%)"}}>
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="text-yellow-400" size={24}/>
          <span className="text-xl font-black gold-text italic">VERITAS</span>
        </div>
        <div className="text-8xl font-black gold-text mb-4">404</div>
        <div className="text-2xl font-bold mb-3">Page Not Found</div>
        <p className="text-white/50 mb-8 leading-relaxed">The page you are looking for doesn't exist or has been moved. Your TruScore is still safe.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={()=>router.back()} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition"><ArrowLeft size={16}/>Go Back</button>
          <button onClick={()=>router.push("/dashboard")} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"><Home size={16}/>Dashboard</button>
        </div>
      </div>
    </div>
  );
}
