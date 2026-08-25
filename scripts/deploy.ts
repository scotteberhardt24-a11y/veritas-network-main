const { ethers, run } = require("hardhat") as any;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC");

  if (balance === 0n) {
    console.error("Deployer has no MATIC on Amoy. Get test MATIC from a faucet first.");
    process.exit(1);
  }

  const BASE_URI =
    process.env.METADATA_BASE_URI ||
    "https://splendid-enjoyment-production-910a.up.railway.app/api/passport/metadata/";
  const ADMIN_WALLET = process.env.ADMIN_WALLET || deployer.address;
  const MINTER_WALLET = process.env.MINTER_WALLET || deployer.address;
  const ORACLE_WALLET = process.env.ORACLE_WALLET || deployer.address;

  console.log("\nConstructor args:");
  console.log("  BASE_URI     :", BASE_URI);
  console.log("  ADMIN_WALLET :", ADMIN_WALLET);
  console.log("  MINTER_WALLET:", MINTER_WALLET);
  console.log("  ORACLE_WALLET:", ORACLE_WALLET);

  console.log("\nDeploying VeritasTrustPassport...");
  const Contract = await ethers.getContractFactory("VeritasTrustPassport");
  const contract = await Contract.deploy(
    BASE_URI,
    ADMIN_WALLET,
    MINTER_WALLET,
    ORACLE_WALLET
  );

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✅ Deployed to:", address);
  console.log("   Network: Amoy (chainId 80002)");

  // Wait for indexing before verify
  console.log("\nWaiting 20s before verification...");
  await new Promise((r) => setTimeout(r, 20000));

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [BASE_URI, ADMIN_WALLET, MINTER_WALLET, ORACLE_WALLET],
      network: "amoy",
    });
    console.log("✅ Verified on Polygonscan");
  } catch (err: any) {
    console.log("Verification note:", err.message || err);
    console.log("You can verify manually later with:");
    console.log(
      `npx hardhat verify --network amoy ${address} "${BASE_URI}" "${ADMIN_WALLET}" "${MINTER_WALLET}" "${ORACLE_WALLET}"`
    );
  }

  console.log("\n----------------------------------------");
  console.log("Add these to your environment variables:");
  console.log(`VIP_PASSPORT_ADDRESS=${address}`);
  console.log(`CONTRACT_ADDRESS=${address}`);
  console.log("----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});