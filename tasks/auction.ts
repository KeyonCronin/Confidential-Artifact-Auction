import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("auction:info", "Get auction information")
  .addParam("id", "The auction ID")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const [signer] = await hre.ethers.getSigners();
    const ArtifactAuction = await hre.ethers.getContractFactory("ArtifactAuction");
    const contract = ArtifactAuction.attach(taskArgs.id).connect(signer);

    try {
      const info = await contract.getAuctionInfo(taskArgs.id);
      console.log("Auction Information:");
      console.log("  Name:", info.name);
      console.log("  Description:", info.description);
      console.log("  Category:", info.category);
      console.log("  Seller:", info.seller);
      console.log("  Minimum Bid (wei):", info.minimumBid.toString());
      console.log("  Is Active:", info.isActive);
      console.log("  Is Authenticated:", info.authenticated);
      console.log("  Total Bids:", info.totalBids);
    } catch (error) {
      console.error("Error fetching auction info:", error);
    }
  });
