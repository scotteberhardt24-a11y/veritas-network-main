// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VeritasTrustPassport
 * @notice Soulbound NFT representing a worker's verified identity and Trust Score on Veritas Network
 * @dev Non-transferable ERC-721. One token per wallet. Minted and updated by Veritas backend.
 */
contract VeritasTrustPassport is ERC721, Ownable {
    using Strings for uint256;

    // ── State ──
    uint256 private _tokenIdCounter;
    string  private _baseTokenURI;
    address public  veritasBackend;  // authorized minter/updater

    // ── Token data ──
    struct PassportData {
        string  username;
        uint16  trustScore;
        uint8   jobsCompleted;
        string  tier;           // "VERIFIED" | "PRO" | "EXPERT" | "ELITE"
        string  metadataURI;    // IPFS URI for full metadata
        uint256 mintedAt;
        uint256 lastUpdated;
        bool    active;
    }

    mapping(uint256 => PassportData) public passports;
    mapping(address => uint256)      public walletToToken;  // one token per wallet
    mapping(string  => uint256)      public usernameToToken;

    // ── Badges ──
    struct Badge {
        string  name;
        string  category;
        uint256 earnedAt;
        uint16  pointsAwarded;
    }
    mapping(uint256 => Badge[]) public tokenBadges;

    // ── Events ──
    event PassportMinted(uint256 indexed tokenId, address indexed wallet, string username, uint16 trustScore);
    event TrustScoreUpdated(uint256 indexed tokenId, uint16 oldScore, uint16 newScore, string reason);
    event BadgeAwarded(uint256 indexed tokenId, string badgeName, uint16 points);
    event PassportRevoked(uint256 indexed tokenId, string reason);

    // ── Errors ──
    error AlreadyMinted(address wallet);
    error NotAuthorized();
    error TokenNotFound(uint256 tokenId);
    error PassportInactive(uint256 tokenId);
    error Soulbound();

    // ── Modifiers ──
    modifier onlyBackend() {
        if (msg.sender != veritasBackend && msg.sender != owner()) revert NotAuthorized();
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        if (tokenId == 0 || tokenId > _tokenIdCounter) revert TokenNotFound(tokenId);
        _;
    }

    modifier tokenActive(uint256 tokenId) {
        if (!passports[tokenId].active) revert PassportInactive(tokenId);
        _;
    }

    constructor(
        string memory baseURI,
        address _veritasBackend
    ) ERC721("Veritas Trust Passport", "VTP") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        veritasBackend = _veritasBackend;
    }

    // ════════════════════════════════════════
    // MINTING
    // ════════════════════════════════════════

    /**
     * @notice Mint a soulbound Trust Passport NFT
     * @param wallet     Worker's wallet address
     * @param username   Veritas username
     * @param trustScore Starting Trust Score (0-1000)
     * @param metaURI    IPFS URI for token metadata
     */
    function mintPassport(
        address wallet,
        string calldata username,
        uint16  trustScore,
        string calldata metaURI
    ) external onlyBackend returns (uint256) {
        if (walletToToken[wallet] != 0) revert AlreadyMinted(wallet);

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(wallet, tokenId);

        string memory tier = _getTier(trustScore);

        passports[tokenId] = PassportData({
            username:     username,
            trustScore:   trustScore,
            jobsCompleted:0,
            tier:         tier,
            metadataURI:  metaURI,
            mintedAt:     block.timestamp,
            lastUpdated:  block.timestamp,
            active:       true
        });

        walletToToken[wallet]        = tokenId;
        usernameToToken[username]    = tokenId;

        // Award New Member badge automatically on mint
        tokenBadges[tokenId].push(Badge({
            name:         "New Member",
            category:     "Milestone",
            earnedAt:     block.timestamp,
            pointsAwarded:50
        }));

        emit PassportMinted(tokenId, wallet, username, trustScore);
        emit BadgeAwarded(tokenId, "New Member", 50);

        return tokenId;
    }

    // ════════════════════════════════════════
    // UPDATES (called by backend on score change)
    // ════════════════════════════════════════

    function updateTrustScore(
        uint256 tokenId,
        uint16  newScore,
        string calldata reason,
        string calldata newMetaURI
    ) external onlyBackend tokenExists(tokenId) tokenActive(tokenId) {
        uint16 oldScore = passports[tokenId].trustScore;
        passports[tokenId].trustScore   = newScore;
        passports[tokenId].tier         = _getTier(newScore);
        passports[tokenId].metadataURI  = newMetaURI;
        passports[tokenId].lastUpdated  = block.timestamp;

        emit TrustScoreUpdated(tokenId, oldScore, newScore, reason);
    }

    function incrementJobsCompleted(
        uint256 tokenId
    ) external onlyBackend tokenExists(tokenId) tokenActive(tokenId) {
        passports[tokenId].jobsCompleted++;
        passports[tokenId].lastUpdated = block.timestamp;

        uint8 jobs = passports[tokenId].jobsCompleted;
        if (jobs == 1) {
            _awardBadge(tokenId, "First Job", "Milestone", 25);
        } else if (jobs == 10) {
            _awardBadge(tokenId, "10 Jobs", "Milestone", 50);
        } else if (jobs == 50) {
            _awardBadge(tokenId, "50 Jobs", "Milestone", 100);
        } else if (jobs == 100) {
            _awardBadge(tokenId, "100 Jobs", "Milestone", 200);
        }
    }

    function awardBadge(
        uint256 tokenId,
        string calldata name,
        string calldata category,
        uint16  points
    ) external onlyBackend tokenExists(tokenId) tokenActive(tokenId) {
        _awardBadge(tokenId, name, category, points);
    }

    function revokePassport(
        uint256 tokenId,
        string calldata reason
    ) external onlyOwner tokenExists(tokenId) {
        passports[tokenId].active = false;
        emit PassportRevoked(tokenId, reason);
    }

    // ════════════════════════════════════════
    // VIEWS
    // ════════════════════════════════════════

    function getPassport(uint256 tokenId) external view returns (PassportData memory) {
        return passports[tokenId];
    }

    function getBadges(uint256 tokenId) external view returns (Badge[] memory) {
        return tokenBadges[tokenId];
    }

    function getPassportByWallet(address wallet) external view returns (uint256 tokenId, PassportData memory data) {
        tokenId = walletToToken[wallet];
        data    = passports[tokenId];
    }

    function getPassportByUsername(string calldata username) external view returns (uint256 tokenId, PassportData memory data) {
        tokenId = usernameToToken[username];
        data    = passports[tokenId];
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory metaURI = passports[tokenId].metadataURI;
        if (bytes(metaURI).length > 0) return metaURI;
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    // ════════════════════════════════════════
    // SOULBOUND — block all transfers
    // ════════════════════════════════════════

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }

    // ════════════════════════════════════════
    // ADMIN
    // ════════════════════════════════════════

    function setBackend(address _backend) external onlyOwner {
        veritasBackend = _backend;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    // ════════════════════════════════════════
    // INTERNAL
    // ════════════════════════════════════════

    function _getTier(uint16 score) internal pure returns (string memory) {
        if (score >= 950) return "ELITE";
        if (score >= 850) return "EXPERT";
        if (score >= 700) return "PRO";
        return "VERIFIED";
    }

    function _awardBadge(uint256 tokenId, string memory name, string memory category, uint16 points) internal {
        tokenBadges[tokenId].push(Badge({
            name:         name,
            category:     category,
            earnedAt:     block.timestamp,
            pointsAwarded:points
        }));
        emit BadgeAwarded(tokenId, name, points);
    }
}
