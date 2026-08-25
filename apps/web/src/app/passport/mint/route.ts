import { NextRequest, NextResponse } from "next/server";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseAbi,
  keccak256,
  toBytes,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";

const RPC_URL = process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY as `0x${string}`;
const PASSPORT_ADDRESS = process.env.VIP_PASSPORT_ADDRESS as `0x${string}`;
const WLD_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID;
const WLD_ACTION = process.env.NEXT_PUBLIC_WLD_ACTION || "vip-passport-mint";

// Temporary in-memory store – replace with Redis/Postgres
const usedNullifiers = new Set<string>();

// Adjust this ABI to match the actual function on VeritasTrustPassport
const abi = parseAbi([
  "function mint(address to, bytes32 commitment, string did) returns (uint256)",
  // If your contract uses a different signature, replace the line above.
]);

async function verifyWorldIdProof(proof: any) {
  if (!WLD_APP_ID) throw new Error("WLD_APP_ID not configured");

  const res = await fetch(
    `https://developer.worldcoin.org/api/v2/verify/${WLD_APP_ID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nullifier_hash: proof.nullifier_hash,
        merkle_root: proof.merkle_root,
        proof: proof.proof,
        verification_level: proof.verification_level,
        action: WLD_ACTION,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "World ID verification failed");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, nullifier, proof, mock = false } = body;

    if (!address || !nullifier) {
      return NextResponse.json(
        { error: "address and nullifier are required" },
        { status: 400 }
      );
    }

    if (!PRIVATE_KEY || !PASSPORT_ADDRESS) {
      return NextResponse.json(
        { error: "Server missing MINTER_PRIVATE_KEY or VIP_PASSPORT_ADDRESS" },
        { status: 500 }
      );
    }

    if (usedNullifiers.has(nullifier)) {
      return NextResponse.json({ error: "Nullifier already used" }, { status: 409 });
    }

    // Real World ID path
    if (!mock) {
      if (!proof) {
        return NextResponse.json({ error: "World ID proof required" }, { status: 400 });
      }
      await verifyWorldIdProof(proof);
    }

    const commitment = keccak256(toBytes(nullifier));
    const account = privateKeyToAccount(PRIVATE_KEY);

    const walletClient = createWalletClient({
      account,
      chain: polygonAmoy,
      transport: http(RPC_URL),
    });

    const publicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(RPC_URL),
    });

    const did = `did:vip:polygon:${address.toLowerCase()}`;

    const hash = await walletClient.writeContract({
      address: PASSPORT_ADDRESS,
      abi,
      functionName: "mint",
      args: [address as `0x${string}`, commitment, did],
    });

    await publicClient.waitForTransactionReceipt({ hash });
    usedNullifiers.add(nullifier);

    return NextResponse.json({
      success: true,
      txHash: hash,
      did,
    });
  } catch (err: any) {
    console.error("Mint error:", err);
    return NextResponse.json(
      { error: err.shortMessage || err.message || "Mint failed" },
      { status: 500 }
    );
  }
}