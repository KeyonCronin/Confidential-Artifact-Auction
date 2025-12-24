import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("counter:get", "Get current counter value")
  .setAction(async (_taskArgs: unknown, hre: HardhatRuntimeEnvironment) => {
    const [signer] = await hre.ethers.getSigners();
    const FHECounter = await hre.ethers.getContractFactory("FHECounter");

    // Placeholder - in real usage would connect to deployed contract
    const counter = FHECounter.attach("0x0000000000000000000000000000000000000000");

    try {
      const count = await counter.connect(signer).getCount();
      console.log("Current counter (encrypted):", count);
    } catch (error) {
      console.error("Error fetching counter:", error);
    }
  });
