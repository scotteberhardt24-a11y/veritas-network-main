
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props { children: React.ReactNode; }

export default function ProtectedRoute({ children }: Props) {
  const { isAuth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuth) {
      router.replace("/login");
    }
  }, [isAuth, loading]);

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:"#010812", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:40, height:40, border:"3px solid rgba(26,107,255,0.2)", borderTop:"3px solid #1a6bff", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuth) return null;
  return <>{children}</>;
}
