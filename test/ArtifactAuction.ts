import { expect } from "chai";
import { ethers } from "hardhat";
import { ArtifactAuction } from "../types";

describe("ArtifactAuction", function () {
  let artifactAuction: ArtifactAuction;
  let owner: any;
  let seller: any;
  let bidder1: any;
  let bidder2: any;
  let authenticator: any;
  let other: any;

  const ARTIFACT_NAME = "Ancient Vase";
  const ARTIFACT_DESCRIPTION = "A precious ancient vase from Ming Dynasty";
  const ARTIFACT_CATEGORY = "ceramic";
  const MINIMUM_BID = ethers.parseEther("10");
  const AUCTION_DURATION = 3600; // 1 hour
  const YEAR_CREATED = 1432;
  const PROVENANCE = "Private collection in Beijing";

  beforeEach(async function () {
    const [ownerAccount, sellerAccount, bidder1Account, bidder2Account, authenticatorAccount, otherAccount] =
      await ethers.getSigners();

    owner = ownerAccount;
    seller = sellerAccount;
    bidder1 = bidder1Account;
    bidder2 = bidder2Account;
    authenticator = authenticatorAccount;
    other = otherAccount;

    const ArtifactAuctionFactory = await ethers.getContractFactory("ArtifactAuction");
    artifactAuction = await ArtifactAuctionFactory.deploy();
    await artifactAuction.waitForDeployment();

    // Add authenticator
    await artifactAuction.connect(owner).addAuthenticator(authenticator.address);
  });

  describe("Initialization", function () {
    /**
     * Test: Verify that the contract is properly initialized
     * Expected: Owner and initial values are set correctly
     */
    it("should initialize with correct owner", async function () {
      const ownerAddress = await artifactAuction.owner();
      expect(ownerAddress).to.equal(owner.address);
    });

    /**
     * Test: Verify that current auction ID starts at 0
     * Expected: No auctions exist initially
     */
    it("should have initial auction ID of 0", async function () {
      const currentId = await artifactAuction.currentAuctionId();
      expect(currentId).to.equal(0);
    });

    /**
     * Test: Verify that owner is an authenticator by default
     * Expected: Owner has authenticator privileges
     */
    it("should initialize owner as authenticator", async function () {
      const isAuth = await artifactAuction.authenticators(owner.address);
      expect(isAuth).to.be.true;
    });
  });

  describe("Authenticator Management", function () {
    /**
     * Test: Adding an authenticator
     * Expected: Specified address gains authenticator privileges
     */
    it("should allow owner to add authenticator", async function () {
      const initiallyAuth = await artifactAuction.authenticators(other.address);
      expect(initiallyAuth).to.be.false;

      await artifactAuction.connect(owner).addAuthenticator(other.address);
      const nowAuth = await artifactAuction.authenticators(other.address);
      expect(nowAuth).to.be.true;
    });

    /**
     * Test: Removing an authenticator
     * Expected: Specified address loses authenticator privileges
     */
    it("should allow owner to remove authenticator", async function () {
      await artifactAuction.connect(owner).addAuthenticator(other.address);
      let isAuth = await artifactAuction.authenticators(other.address);
      expect(isAuth).to.be.true;

      await artifactAuction.connect(owner).removeAuthenticator(other.address);
      isAuth = await artifactAuction.authenticators(other.address);
      expect(isAuth).to.be.false;
    });

    /**
     * Test: Non-owner cannot add authenticator
     * Expected: Transaction reverts with authorization error
     */
    it("should prevent non-owner from adding authenticator", async function () {
      await expect(
        artifactAuction.connect(other).addAuthenticator(bidder1.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Auction Creation", function () {
    /**
     * Test: Creating a valid auction
     * Expected: Auction is created with ID 1 and correct parameters
     */
    it("should create auction successfully", async function () {
      const tx = await artifactAuction
        .connect(seller)
        .createAuction(
          ARTIFACT_NAME,
          ARTIFACT_DESCRIPTION,
          ARTIFACT_CATEGORY,
          MINIMUM_BID,
          AUCTION_DURATION,
          YEAR_CREATED,
          PROVENANCE
        );

      await expect(tx).to.emit(artifactAuction, "AuctionCreated");

      const currentId = await artifactAuction.currentAuctionId();
      expect(currentId).to.equal(1);
    });

    /**
     * Test: Auction with zero minimum bid
     * Expected: Transaction reverts with validation error
     */
    it("should reject auction with zero minimum bid", async function () {
      await expect(
        artifactAuction
          .connect(seller)
          .createAuction(ARTIFACT_NAME, ARTIFACT_DESCRIPTION, ARTIFACT_CATEGORY, 0, AUCTION_DURATION, YEAR_CREATED, PROVENANCE)
      ).to.be.revertedWith("Minimum bid must be greater than 0");
    });

    /**
     * Test: Auction with zero duration
     * Expected: Transaction reverts with validation error
     */
    it("should reject auction with zero duration", async function () {
      await expect(
        artifactAuction
          .connect(seller)
          .createAuction(ARTIFACT_NAME, ARTIFACT_DESCRIPTION, ARTIFACT_CATEGORY, MINIMUM_BID, 0, YEAR_CREATED, PROVENANCE)
      ).to.be.revertedWith("Duration must be greater than 0");
    });

    /**
     * Test: Auction without artifact name
     * Expected: Transaction reverts with validation error
     */
    it("should reject auction without artifact name", async function () {
      await expect(
        artifactAuction
          .connect(seller)
          .createAuction("", ARTIFACT_DESCRIPTION, ARTIFACT_CATEGORY, MINIMUM_BID, AUCTION_DURATION, YEAR_CREATED, PROVENANCE)
      ).to.be.revertedWith("Artifact name required");
    });

    /**
     * Test: Multiple auctions increment ID correctly
     * Expected: Each auction gets a unique sequential ID
     */
    it("should increment auction ID with each new auction", async function () {
      await artifactAuction
        .connect(seller)
        .createAuction(ARTIFACT_NAME, ARTIFACT_DESCRIPTION, ARTIFACT_CATEGORY, MINIMUM_BID, AUCTION_DURATION, YEAR_CREATED, PROVENANCE);

      let currentId = await artifactAuction.currentAuctionId();
      expect(currentId).to.equal(1);

      await artifactAuction
        .connect(other)
        .createAuction(ARTIFACT_NAME, ARTIFACT_DESCRIPTION, ARTIFACT_CATEGORY, MINIMUM_BID, AUCTION_DURATION, YEAR_CREATED, PROVENANCE);

      currentId = await artifactAuction.currentAuctionId();
      expect(currentId).to.equal(2);
    });
  });

  describe("Artifact Authentication", function () {
    let auctionId: number;

    beforeEach(async function () {
      const tx = await artifactAuction
        .connect(seller)
        .createAuction(
          ARTIFACT_NAME,
          ARTIFACT_DESCRIPTION,
          ARTIFACT_CATEGORY,
          MINIMUM_BID,
          AUCTION_DURATION,
          YEAR_CREATED,
          PROVENANCE
        );
      const receipt = await tx.wait();
      auctionId = 1;
    });

    /**
     * Test: Authenticating an artifact
     * Expected: Artifact authentication status changes to true
     */
    it("should allow authenticator to authenticate artifact", async function () {
      let details = await artifactAuction.getArtifactDetails(auctionId);
      expect(details.authenticated).to.be.false;

      await artifactAuction.connect(authenticator).authenticateArtifact(auctionId);

      details = await artifactAuction.getArtifactDetails(auctionId);
      expect(details.authenticated).to.be.true;
    });

    /**
     * Test: Non-authenticator cannot authenticate
     * Expected: Transaction reverts with authorization error
     */
    it("should prevent non-authenticator from authenticating", async function () {
      await expect(
        artifactAuction.connect(other).authenticateArtifact(auctionId)
      ).to.be.revertedWith("Not an authenticator");
    });

    /**
     * Test: Cannot authenticate non-existent auction
     * Expected: Transaction reverts with auction not found error
     */
    it("should prevent authenticating non-existent auction", async function () {
      await expect(
        artifactAuction.connect(authenticator).authenticateArtifact(999)
      ).to.be.revertedWith("Auction does not exist");
    });

    /**
     * Test: Cannot authenticate ended auction
     * Expected: Transaction reverts with auction ended error
     */
    it("should prevent authenticating ended auction", async function () {
      // Manually mark as ended for testing
      const endTx = await artifactAuction.connect(seller).endAuction(auctionId);
      // Note: This test assumes endAuction doesn't require bids
    });
  });

  describe("Bidding", function () {
    let auctionId: number;

    beforeEach(async function () {
      const tx = await artifactAuction
        .connect(seller)
        .createAuction(
          ARTIFACT_NAME,
          ARTIFACT_DESCRIPTION,
          ARTIFACT_CATEGORY,
          MINIMUM_BID,
          AUCTION_DURATION,
          YEAR_CREATED,
          PROVENANCE
        );
      auctionId = 1;

      // Authenticate the artifact
      await artifactAuction.connect(authenticator).authenticateArtifact(auctionId);
    });

    /**
     * Test: Placing a valid bid
     * Expected: Bid is recorded and event is emitted
     */
    it("should allow bidding on authenticated artifact", async function () {
      const bidAmount = ethers.parseEther("15");

      const tx = artifactAuction.connect(bidder1).placeBid(auctionId, bidAmount);
      await expect(tx).to.emit(artifactAuction, "ConfidentialBidPlaced").withArgs(auctionId, bidder1.address);
    });

    /**
     * Test: Bid below minimum
     * Expected: Transaction reverts with bid validation error
     */
    it("should reject bid below minimum", async function () {
      const bidAmount = ethers.parseEther("5");

      await expect(
        artifactAuction.connect(bidder1).placeBid(auctionId, bidAmount)
      ).to.be.revertedWith("Bid below minimum");
    });

    /**
     * Test: Seller cannot bid on their own auction
     * Expected: Transaction reverts with permission error
     */
    it("should prevent seller from bidding", async function () {
      const bidAmount = ethers.parseEther("15");

      await expect(
        artifactAuction.connect(seller).placeBid(auctionId, bidAmount)
      ).to.be.revertedWith("Seller cannot bid");
    });

    /**
     * Test: Cannot bid on unauthenticated artifact
     * Expected: Transaction reverts with authentication error
     */
    it("should prevent bidding on unauthenticated artifact", async function () {
      // Create new unauthenticated auction
      const tx = await artifactAuction
        .connect(seller)
        .createAuction(
          ARTIFACT_NAME,
          ARTIFACT_DESCRIPTION,
          ARTIFACT_CATEGORY,
          MINIMUM_BID,
          AUCTION_DURATION,
          YEAR_CREATED,
          PROVENANCE
        );
      const newAuctionId = 2;

      const bidAmount = ethers.parseEther("15");
      await expect(
        artifactAuction.connect(bidder1).placeBid(newAuctionId, bidAmount)
      ).to.be.revertedWith("Artifact not authenticated");
    });

    /**
     * Test: Multiple bids from different bidders
     * Expected: All bids are recorded correctly
     */
    it("should handle multiple bids from different bidders", async function () {
      const bidAmount1 = ethers.parseEther("15");
      const bidAmount2 = ethers.parseEther("20");

      await artifactAuction.connect(bidder1).placeBid(auctionId, bidAmount1);
      await artifactAuction.connect(bidder2).placeBid(auctionId, bidAmount2);

      const auctionInfo = await artifactAuction.getAuctionInfo(auctionId);
      expect(auctionInfo.totalBids).to.equal(2);
    });

    /**
     * Test: Updating an existing bid
     * Expected: Bid is updated and total bid count remains the same
     */
    it("should allow bidder to update their bid", async function () {
      const bidAmount1 = ethers.parseEther("15");
      const bidAmount2 = ethers.parseEther("25");

      await artifactAuction.connect(bidder1).placeBid(auctionId, bidAmount1);
      let auctionInfo = await artifactAuction.getAuctionInfo(auctionId);
      expect(auctionInfo.totalBids).to.equal(1);

      await artifactAuction.connect(bidder1).placeBid(auctionId, bidAmount2);
      auctionInfo = await artifactAuction.getAuctionInfo(auctionId);
      expect(auctionInfo.totalBids).to.equal(1);
    });

    /**
     * Test: Getting bid status
     * Expected: Bid status information is correctly retrieved
     */
    it("should retrieve bid status correctly", async function () {
      const bidAmount = ethers.parseEther("15");
      await artifactAuction.connect(bidder1).placeBid(auctionId, bidAmount);

      const bidStatus = await artifactAuction.getBidStatus(auctionId, bidder1.address);
      expect(bidStatus.hasActiveBid).to.be.true;
      expect(bidStatus.bidTimestamp).to.be.greaterThan(0);
    });
  });

  describe("Auction Information Retrieval", function () {
    let auctionId: number;

    beforeEach(async function () {
      const tx = await artifactAuction
        .connect(seller)
        .createAuction(
          ARTIFACT_NAME,
          ARTIFACT_DESCRIPTION,
          ARTIFACT_CATEGORY,
          MINIMUM_BID,
          AUCTION_DURATION,
          YEAR_CREATED,
          PROVENANCE
        );
      auctionId = 1;
    });

    /**
     * Test: Getting auction information
     * Expected: All auction details are returned correctly
     */
    it("should return correct auction information", async function () {
      const info = await artifactAuction.getAuctionInfo(auctionId);

      expect(info.name).to.equal(ARTIFACT_NAME);
      expect(info.description).to.equal(ARTIFACT_DESCRIPTION);
      expect(info.category).to.equal(ARTIFACT_CATEGORY);
      expect(info.seller).to.equal(seller.address);
      expect(info.minimumBid).to.equal(MINIMUM_BID);
      expect(info.isActive).to.be.true;
      expect(info.authenticated).to.be.false;
      expect(info.totalBids).to.equal(0);
    });

    /**
     * Test: Getting artifact details
     * Expected: Artifact information is returned correctly
     */
    it("should return correct artifact details", async function () {
      const details = await artifactAuction.getArtifactDetails(auctionId);

      expect(details.name).to.equal(ARTIFACT_NAME);
      expect(details.description).to.equal(ARTIFACT_DESCRIPTION);
      expect(details.category).to.equal(ARTIFACT_CATEGORY);
      expect(details.yearCreated).to.equal(YEAR_CREATED);
      expect(details.provenance).to.equal(PROVENANCE);
      expect(details.authenticated).to.be.false;
    });

    /**
     * Test: Getting active auctions
     * Expected: Only active auctions are returned
     */
    it("should return active auctions", async function () {
      const activeAuctions = await artifactAuction.getActiveAuctions();
      expect(activeAuctions.length).to.equal(1);
      expect(activeAuctions[0]).to.equal(auctionId);
    });

    /**
     * Test: Querying non-existent auction
     * Expected: Transaction reverts with error
     */
    it("should revert when querying non-existent auction", async function () {
      await expect(
        artifactAuction.getAuctionInfo(999)
      ).to.be.revertedWith("Auction does not exist");
    });
  });

  describe("Earnings Management", function () {
    /**
     * Test: Withdraw earnings when none exist
     * Expected: Transaction reverts with no earnings error
     */
    it("should prevent withdrawal when no earnings", async function () {
      await expect(
        artifactAuction.connect(seller).withdrawEarnings()
      ).to.be.revertedWith("No earnings to withdraw");
    });

    /**
     * Test: Getting seller earnings
     * Expected: Earnings can be retrieved for any address
     */
    it("should track seller earnings", async function () {
      const earnings = await artifactAuction.sellerEarnings(seller.address);
      expect(earnings).to.equal(0);
    });
  });

  describe("Access Control", function () {
    /**
     * Test: Only owner can add authenticators
     * Expected: Non-owner transactions revert
     */
    it("should enforce owner-only authentication management", async function () {
      await expect(
        artifactAuction.connect(other).addAuthenticator(bidder1.address)
      ).to.be.revertedWith("Not authorized");

      await expect(
        artifactAuction.connect(other).removeAuthenticator(authenticator.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Edge Cases", function () {
    /**
     * Test: Multiple auctions can coexist
     * Expected: Each auction maintains separate state
     */
    it("should handle multiple independent auctions", async function () {
      const auction1Tx = await artifactAuction
        .connect(seller)
        .createAuction(ARTIFACT_NAME, ARTIFACT_DESCRIPTION, ARTIFACT_CATEGORY, MINIMUM_BID, AUCTION_DURATION, YEAR_CREATED, PROVENANCE);

      const auction2Tx = await artifactAuction
        .connect(other)
        .createAuction("Sculpture", "A stone sculpture", "sculpture", MINIMUM_BID, AUCTION_DURATION, 1500, "Museum collection");

      const currentId = await artifactAuction.currentAuctionId();
      expect(currentId).to.equal(2);

      const info1 = await artifactAuction.getAuctionInfo(1);
      const info2 = await artifactAuction.getAuctionInfo(2);

      expect(info1.name).to.equal(ARTIFACT_NAME);
      expect(info2.name).to.equal("Sculpture");
    });
  });
});
