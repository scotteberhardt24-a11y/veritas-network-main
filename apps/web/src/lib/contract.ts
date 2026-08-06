export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const NFT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const ABI = [] as const;
export const NFT_ABI = [] as const;
export const ESCROW_ABI = [] as const;
export const publicClient = { readContract: async (args: any) => null };
export const walletClient = { writeContract: async (args: any) => "0x" as `0x${string}` };
export function getContract() { return null; }
