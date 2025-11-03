import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy WODToken
  console.log("\n🚀 Deploying WODToken...");
  const WODToken = await ethers.getContractFactory("WODToken");
  const wodToken = await WODToken.deploy(deployer.address);
  await wodToken.waitForDeployment();
  const wodTokenAddress = await wodToken.getAddress();
  console.log("✅ WODToken deployed to:", wodTokenAddress);

  // 2. Deploy ValidatorRegistry
  console.log("\n🚀 Deploying ValidatorRegistry...");
  const ValidatorRegistry = await ethers.getContractFactory("ValidatorRegistry");
  const minStake = ethers.parseEther("1000"); // 1000 WOD mínimo
  const validatorRegistry = await ValidatorRegistry.deploy(
    wodTokenAddress,
    deployer.address,
    minStake
  );
  await validatorRegistry.waitForDeployment();
  const validatorRegistryAddress = await validatorRegistry.getAddress();
  console.log("✅ ValidatorRegistry deployed to:", validatorRegistryAddress);

  // 3. Deploy Arena
  console.log("\n🚀 Deploying Arena...");
  const Arena = await ethers.getContractFactory("Arena");
  const arena = await Arena.deploy(
    wodTokenAddress,
    validatorRegistryAddress,
    deployer.address
  );
  await arena.waitForDeployment();
  const arenaAddress = await arena.getAddress();
  console.log("✅ Arena deployed to:", arenaAddress);

  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("WODToken:", wodTokenAddress);
  console.log("ValidatorRegistry:", validatorRegistryAddress);
  console.log("Arena:", arenaAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Salvar endereços em arquivo (opcional)
  const network = await hre.network;
  const deploymentInfo = {
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contracts: {
      WODToken: wodTokenAddress,
      ValidatorRegistry: validatorRegistryAddress,
      Arena: arenaAddress,
    },
    deployer: deployer.address,
  };

  console.log("💾 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

