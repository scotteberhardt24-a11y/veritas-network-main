"use client";
import { useRouter } from "next/navigation";
export default function MockPassportPage() {
  const router = useRouter();
  return (
    <div style={{minHeight:"100vh",background:"#030d1e",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <h1>Mock Passport</h1>
        <button onClick={()=>router.push("/passport")} style={{marginTop:16,padding:"10px 24px",background:"#1a6bff",border:"none",borderRadius:8,color:"white",cursor:"pointer"}}>Go to Passport</button>
      </div>
    </div>
  );
}
