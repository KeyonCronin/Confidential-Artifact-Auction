import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying ArtifactAuction contract...");

  const artifactAuction = await deploy("ArtifactAuction", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`ArtifactAuction deployed to: ${artifactAuction.address}`);
};

export default func;
func.tags = ["ArtifactAuction"];
