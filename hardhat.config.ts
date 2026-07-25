import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const POLYGON_RPC  = process.env.POLYGON_RPC_URL    || "https://polygon-rpc.com";
const AMOY_RPC     = process.env.AMOY_RPC_URL       || "https://rpc-amoy.polygon.technology";
const POLYGONSCAN  = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    amoy: {
      // Polygon Amoy testnet (free test MATIC from faucet.polygon.technology)
      url: AMOY_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002,
    },
    polygon: {
      // Polygon mainnet
      url: POLYGON_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      polygon:     POLYGONSCAN,
      polygonAmoy: POLYGONSCAN,
    },
  },
};

export default config;
