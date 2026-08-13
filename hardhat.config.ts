import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const config: HardhatUserConfig = {
  solidity: { version:"0.8.24", settings:{ optimizer:{ enabled:true, runs:200 } } },
  networks: {
    amoy:    { url: process.env.AMOY_RPC_URL    || "https://rpc-amoy.polygon.technology", accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], chainId: 80002 },
    polygon: { url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",             accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], chainId: 137   },
  },
  etherscan: { apiKey: { polygon: process.env.POLYGONSCAN_API_KEY || "", polygonAmoy: process.env.POLYGONSCAN_API_KEY || "" } },
};
export default config;
