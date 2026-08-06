
export const ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const abi = [
  { name: "getEscrow",   type: "function", stateMutability: "view",       inputs: [{ name: "jobId", type: "uint256" }], outputs: [{ name: "", type: "tuple", components: [{ name: "amount", type: "uint256" }, { name: "released", type: "bool" }] }] },
  { name: "nextEscrowId",type: "function", stateMutability: "view",       inputs: [],                                   outputs: [{ name: "", type: "uint256" }] },
  { name: "isReleased",  type: "function", stateMutability: "view",       inputs: [{ name: "jobId", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { name: "createEscrow",type: "function", stateMutability: "payable",    inputs: [{ name: "jobId", type: "uint256" }], outputs: [] },
  { name: "release",     type: "function", stateMutability: "nonpayable", inputs: [{ name: "jobId", type: "uint256" }], outputs: [] },
] as const;

export const publicClient = {
  readContract: async (args: any) => null,
};

export const walletClient = {
  writeContract: async (args: any) => null,
};

export async function createEscrow(jobId: string, amount: number) { return null; }
export async function releaseEscrow(escrowId: string) { return null; }
export async function getEscrow(escrowId: string) { return null; }
