import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, parseAbi, 
keccak256, stringToBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";

// ---- Config (use env vars) ----
const RPC_URL = process.env.POLYGON_AMOY_RPC_URL!;
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY! as `0x${string}`;
const PASSPORT_ADDRESS = process.env.VIP_PASSPORT_ADDRESS! as 
`0x${string}`;

// Simple in-memory / DB nullifier store later. For now a placeholder.
const usedNullifiers = new Set<string>();

const abi = parseAbi([
  "function mint(address to, bytes32 commitment, string did) returns 
(uint256)",
  "function commitmentToToken(bytes32) view returns (uint256)",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, nullifier, mock = false } = body;

    if (!address || !nullifier) {
      return NextResponse.json({ error: "address and nullifier required" 
}, { status: 400 });
    }

    // 1. Basic nullifier reuse check (replace with Redis/Postgres)
    if (usedNullifiers.has(nullifier)) {
      return NextResponse.json({ error: "Nullifier already used" }, { 
status: 409 });
    }

    // 2. In production: verify World ID proof here.
    // For mock flow we just accept the nullifier.
    if (!mock) {
      // TODO: call World ID verifier / cloudproof verification
      // If invalid → return 401
    }

    // 3. Create commitment
    const commitment = keccak256(stringToBytes(nullifier));

    // 4. Build clients
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

    // 5. Generate a simple did:vip (improve later)
    const did = `did:vip:polygon:${address.toLowerCase()}`;

    // 6. Mint
    const hash = await walletClient.writeContract({
      address: PASSPORT_ADDRESS,
      abi,
      functionName: "mint",
      args: [address as `0x${string}`, commitment, did],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash 
});

    // 7. Mark nullifier used
    usedNullifiers.add(nullifier);

    return NextResponse.json({
      success: true,
      txHash: hash,
      did,
      // tokenId can be parsed from logs later; for now client can query
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Mint failed" }, { 
status: 500 });
  }
}
