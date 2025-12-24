// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialArtifactAuction is SepoliaConfig {

    address public owner;
    uint32 public currentAuctionId;

    struct ArtifactInfo {
        string name;
        string description;
        string category; // "painting", "sculpture", "ceramic", "jewelry", etc.
        uint256 minimumBid;
        address seller;
        bool authenticated;
        uint256 yearCreated;
        string provenance;
    }

    struct EncryptedBid {
        euint64 amount;
        bool isActive;
        uint256 timestamp;
    }

    struct AuctionDetails {
        ArtifactInfo artifact;
        uint256 startTime;
        uint256 endTime;
        uint256 minimumBid;
        bool isActive;
        bool isEnded;
        address highestBidder;
        uint256 revealedHighestBid;
        address[] bidders;
        uint256 totalBids;
    }

    mapping(uint32 => AuctionDetails) public auctions;
    mapping(uint32 => mapping(address => EncryptedBid)) public bidsByAuction;
    mapping(address => uint256) public sellerEarnings;
    mapping(address => bool) public authenticators;

    event AuctionCreated(
        uint32 indexed auctionId,
        string artifactName,
        address indexed seller,
        uint256 startTime,
        uint256 endTime,
        uint256 minimumBid
    );
    event ConfidentialBidPlaced(uint32 indexed auctionId, address indexed bidder);
    event AuctionEnded(
        uint32 indexed auctionId,
        address indexed winner,
        uint256 winningBid,
        string artifactName
    );
    event ArtifactAuthenticated(uint32 indexed auctionId, address authenticator);
    event EarningsWithdrawn(address indexed seller, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthenticator() {
        require(authenticators[msg.sender], "Not an authenticator");
        _;
    }

    modifier auctionExists(uint32 auctionId) {
        require(auctionId <= currentAuctionId && auctionId > 0, "Auction does not exist");
        _;
    }

    modifier auctionActive(uint32 auctionId) {
        require(auctions[auctionId].isActive, "Auction not active");
        require(block.timestamp >= auctions[auctionId].startTime, "Auction not started");
        require(block.timestamp <= auctions[auctionId].endTime, "Auction ended");
        require(!auctions[auctionId].isEnded, "Auction already ended");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentAuctionId = 0;
        authenticators[msg.sender] = true;
    }

    function addAuthenticator(address _authenticator) external onlyOwner {
        authenticators[_authenticator] = true;
    }

    function removeAuthenticator(address _authenticator) external onlyOwner {
        authenticators[_authenticator] = false;
    }

    function createAuction(
        string memory _name,
        string memory _description,
        string memory _category,
        uint256 _minimumBid,
        uint256 _auctionDuration,
        uint256 _yearCreated,
        string memory _provenance
    ) external returns (uint32) {
        require(_minimumBid > 0, "Minimum bid must be greater than 0");
        require(_auctionDuration > 0, "Duration must be greater than 0");
        require(bytes(_name).length > 0, "Artifact name required");

        currentAuctionId++;

        ArtifactInfo memory artifact = ArtifactInfo({
            name: _name,
            description: _description,
            category: _category,
            minimumBid: _minimumBid,
            seller: msg.sender,
            authenticated: false,
            yearCreated: _yearCreated,
            provenance: _provenance
        });

        auctions[currentAuctionId] = AuctionDetails({
            artifact: artifact,
            startTime: block.timestamp,
            endTime: block.timestamp + _auctionDuration,
            minimumBid: _minimumBid,
            isActive: true,
            isEnded: false,
            highestBidder: address(0),
            revealedHighestBid: 0,
            bidders: new address[](0),
            totalBids: 0
        });

        emit AuctionCreated(
            currentAuctionId,
            _name,
            msg.sender,
            block.timestamp,
            block.timestamp + _auctionDuration,
            _minimumBid
        );

        return currentAuctionId;
    }

    function authenticateArtifact(uint32 auctionId)
        external
        onlyAuthenticator
        auctionExists(auctionId)
    {
        require(!auctions[auctionId].isEnded, "Cannot authenticate ended auction");
        auctions[auctionId].artifact.authenticated = true;

        emit ArtifactAuthenticated(auctionId, msg.sender);
    }

    function placeBid(uint32 auctionId, uint64 _bidAmount)
        external
        auctionExists(auctionId)
        auctionActive(auctionId)
    {
        require(auctions[auctionId].artifact.authenticated, "Artifact not authenticated");
        require(_bidAmount >= auctions[auctionId].minimumBid, "Bid below minimum");
        require(msg.sender != auctions[auctionId].artifact.seller, "Seller cannot bid");

        // Encrypt the bid amount
        euint64 encryptedBid = FHE.asEuint64(_bidAmount);

        // Check if bidder already has a bid
        if (!bidsByAuction[auctionId][msg.sender].isActive) {
            auctions[auctionId].bidders.push(msg.sender);
        }

        bidsByAuction[auctionId][msg.sender] = EncryptedBid({
            amount: encryptedBid,
            isActive: true,
            timestamp: block.timestamp
        });

        auctions[auctionId].totalBids++;

        // Set FHE permissions
        FHE.allowThis(encryptedBid);
        FHE.allow(encryptedBid, msg.sender);

        emit ConfidentialBidPlaced(auctionId, msg.sender);
    }

    function endAuction(uint32 auctionId)
        external
        auctionExists(auctionId)
    {
        require(
            block.timestamp > auctions[auctionId].endTime ||
            msg.sender == owner ||
            msg.sender == auctions[auctionId].artifact.seller,
            "Cannot end auction yet"
        );
        require(!auctions[auctionId].isEnded, "Auction already ended");
        require(auctions[auctionId].bidders.length > 0, "No bids placed");

        auctions[auctionId].isActive = false;
        auctions[auctionId].isEnded = true;

        // Request decryption of all bids to find highest bidder
        _requestBidDecryption(auctionId);
    }

    function _requestBidDecryption(uint32 auctionId) private {
        AuctionDetails storage auction = auctions[auctionId];
        uint256 bidCount = auction.bidders.length;

        if (bidCount == 0) return;

        bytes32[] memory cts = new bytes32[](bidCount);

        for (uint256 i = 0; i < bidCount; i++) {
            address bidder = auction.bidders[i];
            cts[i] = FHE.toBytes32(bidsByAuction[auctionId][bidder].amount);
        }

        FHE.requestDecryption(cts, this.processBidResults.selector);
    }

    function processBidResults(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory signatures
    ) external {
        // Verify signatures
        FHE.checkSignatures(requestId, cleartexts, signatures);

        // Decode the decrypted bid values
        uint64[] memory decryptedBids = abi.decode(cleartexts, (uint64[]));

        // Find the auction ID from request (simplified - in production would need mapping)
        uint32 auctionId = currentAuctionId; // Simplified for demo

        AuctionDetails storage auction = auctions[auctionId];

        uint256 highestBid = 0;
        address winner = address(0);

        // Find highest bidder
        for (uint256 i = 0; i < decryptedBids.length && i < auction.bidders.length; i++) {
            if (decryptedBids[i] > highestBid) {
                highestBid = decryptedBids[i];
                winner = auction.bidders[i];
            }
        }

        auction.highestBidder = winner;
        auction.revealedHighestBid = highestBid;

        // Transfer earnings to seller
        if (winner != address(0)) {
            sellerEarnings[auction.artifact.seller] += highestBid;

            emit AuctionEnded(auctionId, winner, highestBid, auction.artifact.name);
        }
    }

    function withdrawEarnings() external {
        uint256 earnings = sellerEarnings[msg.sender];
        require(earnings > 0, "No earnings to withdraw");

        sellerEarnings[msg.sender] = 0;

        // In a real implementation, this would transfer actual ETH/tokens
        // For demo purposes, we just emit an event
        emit EarningsWithdrawn(msg.sender, earnings);
    }

    function getAuctionInfo(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (
            string memory name,
            string memory description,
            string memory category,
            address seller,
            uint256 startTime,
            uint256 endTime,
            uint256 minimumBid,
            bool isActive,
            bool authenticated,
            uint256 totalBids
        )
    {
        AuctionDetails storage auction = auctions[auctionId];
        return (
            auction.artifact.name,
            auction.artifact.description,
            auction.artifact.category,
            auction.artifact.seller,
            auction.startTime,
            auction.endTime,
            auction.minimumBid,
            auction.isActive && !auction.isEnded,
            auction.artifact.authenticated,
            auction.totalBids
        );
    }

    function getArtifactDetails(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (
            string memory name,
            string memory description,
            string memory category,
            uint256 yearCreated,
            string memory provenance,
            bool authenticated
        )
    {
        ArtifactInfo storage artifact = auctions[auctionId].artifact;
        return (
            artifact.name,
            artifact.description,
            artifact.category,
            artifact.yearCreated,
            artifact.provenance,
            artifact.authenticated
        );
    }

    function getBidStatus(uint32 auctionId, address bidder)
        external
        view
        auctionExists(auctionId)
        returns (bool hasActiveBid, uint256 bidTimestamp)
    {
        EncryptedBid storage bid = bidsByAuction[auctionId][bidder];
        return (bid.isActive, bid.timestamp);
    }

    function getAuctionResults(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (
            bool ended,
            address winner,
            uint256 winningBid,
            uint256 totalBids
        )
    {
        AuctionDetails storage auction = auctions[auctionId];
        require(auction.isEnded, "Auction not ended yet");

        return (
            auction.isEnded,
            auction.highestBidder,
            auction.revealedHighestBid,
            auction.totalBids
        );
    }

    function getActiveAuctions() external view returns (uint32[] memory) {
        uint32[] memory activeIds = new uint32[](currentAuctionId);
        uint32 count = 0;

        for (uint32 i = 1; i <= currentAuctionId; i++) {
            if (auctions[i].isActive && !auctions[i].isEnded &&
                block.timestamp <= auctions[i].endTime) {
                activeIds[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint32[] memory result = new uint32[](count);
        for (uint32 i = 0; i < count; i++) {
            result[i] = activeIds[i];
        }

        return result;
    }
}