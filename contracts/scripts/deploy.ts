import { readFileSync } from "fs";
import path from "path";
import { ethers } from "hardhat";
import hre from "hardhat";

type DistributionEntry = {
  allocation: string;
  amount: number | string;
  address?: string;
};

type DistributionData = {
  token: {
    name: string;
    symbol: string;
    decimals: number;
  };
  distribution: Record<string, DistributionEntry>;
};

const distributionPath = path.resolve(
  __dirname,
  "..",
  "..",
  "WODToken_Initial_Distribution.json"
);

function loadDistributionData(): DistributionData {
  const fileRaw = readFileSync(distributionPath, "utf-8");
  return JSON.parse(fileRaw) as DistributionData;
}

function normalizeAmount(value: number | string): string {
  if (typeof value === "number") {
    return value.toString();
  }

  return value.replace(/_/g, "").split(" ")[0];
}

async function distributeInitialSupply(wodToken: any, tokenData: DistributionData) {
  const decimals = tokenData.token?.decimals ?? 18;
  const symbol = tokenData.token?.symbol ?? "TOKEN";
  const allocations = Object.entries(tokenData.distribution);
  const minted: Array<{ label: string; amount: string; address: string }> = [];

  for (const [label, details] of allocations) {
    if (!details.address) {
      console.log(
        `ℹ️  ${label}: sem endereço definido no JSON, pulando distribuição automática.`
      );
      continue;
    }

    if (!ethers.isAddress(details.address)) {
      console.warn(
        `⚠️  ${label}: endereço ${details.address} inválido, pulando esta alocação.`
      );
      continue;
    }

    const amountLabel = normalizeAmount(details.amount);
    const mintAmount = ethers.parseUnits(amountLabel, decimals);
    console.log(
      `\n💸 Distribuindo ${amountLabel} ${symbol} para ${label} (${details.address})`
    );
    const tx = await wodToken.mint(
      details.address,
      mintAmount,
      `Initial allocation: ${label}`
    );
    await tx.wait();
    minted.push({
      label,
      amount: amountLabel,
      address: details.address,
    });
  }

  return minted;
}

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

  // 1.b Distribuição imediata conforme JSON
  console.log("\n📦 Iniciando distribuição inicial com base no WODToken_Initial_Distribution.json...");
  const distributionData = loadDistributionData();
  const distributed = await distributeInitialSupply(wodToken, distributionData);
  if (distributed.length > 0) {
    console.log("\n✅ Distribuições realizadas:");
    distributed.forEach((entry) => {
      console.log(
        `   - ${entry.label}: ${entry.amount} ${distributionData.token.symbol} -> ${entry.address}`
      );
    });
  } else {
    console.log("⚠️  Nenhuma distribuição automática foi executada.");
  }

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
