import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC");

  // Base URI — update to your IPFS gateway or backend metadata endpoint
  const BASE_URI = process.env.METADATA_BASE_URI || "https://veritasbackend.up.railway.app/api/passport/metadata/";
  // Backend wallet that has permission to mint/update
  const BACKEND_WALLET = process.env.BACKEND_WALLET_ADDRESS || deployer.address;

  console.log("\nDeploying VeritasTrustPassport...");
  console.log("  Base URI:", BASE_URI);
  console.log("  Backend wallet:", BACKEND_WALLET);

  const Contract = await ethers.getContractFactory("VeritasTrustPassport");
  const contract = await Contract.deploy(BASE_URI, BACKEND_WALLET);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ VeritasTrustPassport deployed to:", address);
  console.log("   Network:", (await ethers.provider.getNetwork()).name);
  console.log("\nAdd to backend/.env:");
  console.log(`   CONTRACT_ADDRESS=${address}`);
  console.log(`   BACKEND_WALLET_ADDRESS=${BACKEND_WALLET}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
