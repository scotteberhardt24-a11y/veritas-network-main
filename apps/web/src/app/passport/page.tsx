"use client";

import { useRouter } from "next/navigation";

export default function PassportPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030d1e",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          VIP Passport
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: 24 }}>
          One human. One lifetime professional identity.
        </p>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
          World ID mint flow is being updated for IDKit v4. Use the mock mint
          path for now while the Amoy contract is deployed.
        </p>
        <button
          onClick={() => router.push("/passport/mock")}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 8,
            background: "#D4AF37",
            color: "#000",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Go to Mock Mint
        </button>
      </div>
    </div>
  );
}
