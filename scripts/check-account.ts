import "dotenv/config";
import { ethers } from "ethers";

async function main() {
  // Prefer Amoy RPC, fall back to older names
  const rpcUrl =
    process.env.POLYGON_AMOY_RPC_URL ||
    process.env.AMOY_RPC_URL ||
    process.env.POLYGON_RPC_URL ||
    "https://rpc-amoy.polygon.technology";

  const privateKey =
    process.env.MINTER_PRIVATE_KEY ||
    process.env.DEPLOYER_PRIVATE_KEY ||
    process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "No private key found. Set MINTER_PRIVATE_KEY, DEPLOYER_PRIVATE_KEY, or PRIVATE_KEY in your environment."
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const network = await provider.getNetwork();
  const balance = await provider.getBalance(wallet.address);

  console.log("----------------------------------------");
  console.log("Wallet address:", wallet.address);
  console.log("Network:       ", network.name, `(chainId ${network.chainId})`);
  console.log("RPC:           ", rpcUrl);
  console.log("Balance:       ", ethers.formatEther(balance), "MATIC");
  console.log("----------------------------------------");

  if (network.chainId !== 80002n) {
    console.warn(
      "⚠️  Warning: You are not on Polygon Amoy (chainId 80002). Current chainId is",
      network.chainId.toString()
    );
  }

  if (balance === 0n) {
    console.warn(
      "⚠️  This wallet has 0 MATIC. Get test MATIC from an Amoy faucet before deploying."
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});