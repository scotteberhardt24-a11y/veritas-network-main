"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function JobsPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/job-board"); }, []);
  return (
    <div style={{minHeight:"100vh",background:"#010812",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"1rem"}}>
      Redirecting to Job Board...
    </div>
  );
}
