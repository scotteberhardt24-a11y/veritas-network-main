"use client";

import { useState } from "react";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function PassportPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [status, setStatus] = useState<"idle" | "minting" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWorldIdSuccess = async (proof: ISuccessResult) => {
    if (!address) {
      setError("Connect wallet first");
      return;
    }

    setStatus("minting");
    setError(null);

    try {
      const res = await fetch("/api/passport/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          nullifier: proof.nullifier_hash,
          proof: {
            merkle_root: proof.merkle_root,
            nullifier_hash: proof.nullifier_hash,
            proof: proof.proof,
            verification_level: proof.verification_level,
          },
          mock: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mint failed");

      setResult(data);
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#030d1e] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">VIP Passport</h1>
          <p className="text-slate-400">
            One human. One lifetime professional identity.
          </p>
        </div>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            className="w-full py-3 px-4 rounded-lg bg-[#1a6bff] hover:bg-blue-600 font-medium transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-slate-400 break-all">
              Connected: {address}
              <button
                onClick={() => disconnect()}
                className="ml-3 text-[#1a6bff] hover:underline"
              >
                Disconnect
              </button>
            </div>

            {status === "idle" && (
              <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
                action={process.env.NEXT_PUBLIC_WLD_ACTION || "vip-passport-mint"}
                onSuccess={handleWorldIdSuccess}
                verification_level={VerificationLevel.Orb}
              >
                {({ open }) => (
                  <button
                    onClick={open}
                    className="w-full py-3 px-4 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-yellow-500 transition"
                  >
                    Verify with World ID & Mint Passport
                  </button>
                )}
              </IDKitWidget>
            )}

            {status === "minting" && (
              <div className="text-center py-8 text-slate-300">
                Verifying uniqueness and minting your passport…
              </div>
            )}

            {status === "success" && result && (
              <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-5 space-y-3">
                <p className="font-semibold text-green-400">Passport minted successfully</p>
                {result.did && (
                  <p className="text-sm break-all">
                    <span className="text-slate-400">DID:</span> {result.did}
                  </p>
                )}
                {result.txHash && (
                  <p className="text-sm break-all">
                    <span className="text-slate-400">Tx:</span>{" "}
                    <a
                      href={`https://amoy.polygonscan.com/tx/${result.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1a6bff] hover:underline"
                    >
                      {result.txHash.slice(0, 10)}…{result.txHash.slice(-8)}
                    </a>
                  </p>
                )}
                {result.tokenId && (
                  <p className="text-sm">
                    <span className="text-slate-400">Token ID:</span> {result.tokenId}
                  </p>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}