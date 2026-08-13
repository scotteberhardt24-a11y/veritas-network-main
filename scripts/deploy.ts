import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC");

  const BASE_URI      = process.env.METADATA_BASE_URI || "https://splendid-enjoyment-production-910a.up.railway.app/api/passport/metadata/";
  const ADMIN_WALLET  = process.env.ADMIN_WALLET   || deployer.address;
  const MINTER_WALLET = process.env.MINTER_WALLET  || deployer.address;
  const ORACLE_WALLET = process.env.ORACLE_WALLET  || deployer.address;

  console.log("\nDeploying VeritasTrustPassport v2...");
  const Contract = await ethers.getContractFactory("VeritasTrustPassport");
  const contract = await Contract.deploy(BASE_URI, ADMIN_WALLET, MINTER_WALLET, ORACLE_WALLET);
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✅ Deployed to:", address);
  console.log("   Network:", (await ethers.provider.getNetwork()).name);
  console.log("\nAdd to Railway backend variables:");
  console.log(`   CONTRACT_ADDRESS=${address}`);
  console.log(`   DEPLOYER_PRIVATE_KEY=your_key`);
  console.log(`   POLYGON_RPC_URL=your_rpc`);
  console.log("\nVerify on PolygonScan:");
  console.log(`   npx hardhat verify --network polygon ${address} "${BASE_URI}" "${ADMIN_WALLET}" "${MINTER_WALLET}" "${ORACLE_WALLET}"`);
}

main().catch(e => { console.error(e); process.exitCode = 1; });
