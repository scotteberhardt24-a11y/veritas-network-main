const { ethers } = require("ethers");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CONTRACT_ADDRESS    = process.env.CONTRACT_ADDRESS;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const POLYGON_RPC          = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";
const BACKEND_URL          = process.env.BACKEND_URL || "https://veritasbackend.up.railway.app";

// Minimal ABI — only the functions we call
const ABI = [
  "function mintPassport(address wallet, string username, uint16 trustScore, string metaURI) returns (uint256)",
  "function updateTrustScore(uint256 tokenId, uint16 newScore, string reason, string newMetaURI) external",
  "function incrementJobsCompleted(uint256 tokenId) external",
  "function awardBadge(uint256 tokenId, string name, string category, uint16 points) external",
  "function getPassportByWallet(address wallet) view returns (uint256 tokenId, tuple(string username, uint16 trustScore, uint8 jobsCompleted, string tier, string metadataURI, uint256 mintedAt, uint256 lastUpdated, bool active) data)",
  "function walletToToken(address) view returns (uint256)",
  "event PassportMinted(uint256 indexed tokenId, address indexed wallet, string username, uint16 trustScore)",
];

function getContract() {
  if (!CONTRACT_ADDRESS || !DEPLOYER_PRIVATE_KEY) {
    throw new Error("CONTRACT_ADDRESS or DEPLOYER_PRIVATE_KEY not set in env");
  }
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC);
  const signer   = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

// ── Build IPFS-style metadata JSON ──
function buildMetadata(user, badges = []) {
  const tier = user.trustScore >= 950 ? "ELITE"
    : user.trustScore >= 850 ? "EXPERT"
    : user.trustScore >= 700 ? "PRO"
    : "VERIFIED";

  return {
    name: `Veritas Trust Passport — @${user.username}`,
    description: `Soulbound NFT representing the verified identity and Trust Score of ${user.username} on Veritas Network. Truth Becomes Trust.`,
    image: `${BACKEND_URL}/api/passport/badge-image/${user.username}`,
    external_url: `https://veritas.network/u/${user.username}`,
    attributes: [
      { trait_type: "Trust Score",    value: user.trustScore },
      { trait_type: "Tier",           value: tier },
      { trait_type: "Jobs Completed", value: user.completedJobs || 0 },
      { trait_type: "Member Since",   display_type: "date", value: Math.floor(new Date(user.createdAt).getTime() / 1000) },
      { trait_type: "Role",           value: user.role },
      ...badges.map(b => ({ trait_type: `Badge: ${b.name}`, value: b.earnedAt })),
    ],
    properties: {
      username:    user.username,
      trustScore:  user.trustScore,
      tier,
      verified:    true,
      soulbound:   true,
      network:     "Polygon",
    },
  };
}

// ── MINT ──
async function mintPassport(userId, walletAddress) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id:true, email:true, username:true, trustScore:true, role:true, completedJobs:true, createdAt:true },
  });
  if (!user) throw new Error("User not found");
  if (!user.username) throw new Error("User has no username set");

  // Build metadata URI — points to our backend endpoint
  const metaURI = `${BACKEND_URL}/api/passport/metadata/${user.username}`;

  // Call the contract
  const contract = getContract();
  const tx = await contract.mintPassport(
    walletAddress,
    user.username,
    user.trustScore,
    metaURI
  );
  const receipt = await tx.wait();

  // Parse the tokenId from the event
  const event = receipt.logs
    .map(log => { try { return contract.interface.parseLog(log); } catch { return null; } })
    .find(e => e && e.name === "PassportMinted");

  const tokenId = event ? event.args.tokenId.toString() : null;

  console.log(`[PASSPORT] Minted tokenId=${tokenId} for ${user.username} wallet=${walletAddress}`);
  return { tokenId, txHash: receipt.hash, walletAddress, username: user.username };
}

// ── UPDATE SCORE ON-CHAIN ──
async function updateScoreOnChain(userId, newScore, reason = "Score updated") {
  if (!CONTRACT_ADDRESS) {
    console.log("[PASSPORT] No contract deployed yet — skipping on-chain update");
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username:true, trustScore:true, completedJobs:true, createdAt:true, role:true },
    });
    if (!user) return null;

    // Get tokenId for this user's wallet
    // (In production, store wallet address on the User model)
    const metaURI = `${BACKEND_URL}/api/passport/metadata/${user.username}`;
    const contract = getContract();

    // We need the tokenId — look it up by username from your DB
    // For now we skip if we can't find it
    console.log(`[PASSPORT] Score update for ${user.username}: ${newScore} — ${reason}`);
    return null;
  } catch (err) {
    console.error("[PASSPORT] On-chain update failed:", err.message);
    return null;
  }
}

module.exports = { mintPassport, updateScoreOnChain, buildMetadata };
