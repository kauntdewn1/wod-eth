import { run } from "hardhat";

/**
 * Script para verificar contratos no PolygonScan
 * 
 * Uso:
 * npx hardhat run scripts/verify.ts --network amoy
 * 
 * Ou para verificar um contrato específico:
 * npx hardhat verify --network amoy <endereço> <arg1> <arg2> ...
 */

async function main() {
  console.log("🔍 Verificando contratos no PolygonScan...\n");

  // Endereços dos contratos deployados
  const wodTokenAddress = process.env.WOD_TOKEN_ADDRESS || "0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d";
  const validatorRegistryAddress = process.env.VALIDATOR_REGISTRY_ADDRESS || "0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9";
  const arenaAddress = process.env.ARENA_ADDRESS || "0xfdFDB88617F39C2FC0ca31d6f4847E6c0D9513cf";

  const network = await import("hardhat").then((h) => h.network);
  console.log(`🌐 Rede: ${network.name}\n`);

  // Verificar WODToken
  console.log("📝 Verificando WODToken...");
  try {
    await run("verify:verify", {
      address: wodTokenAddress,
      constructorArguments: [process.env.DEPLOYER_ADDRESS || "0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F"],
    });
    console.log("✅ WODToken verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ WODToken já estava verificado\n");
    } else {
      console.log(`❌ Erro ao verificar WODToken: ${error.message}\n`);
    }
  }

  // Verificar ValidatorRegistry
  console.log("📝 Verificando ValidatorRegistry...");
  try {
    const minStake = process.env.MIN_STAKE_AMOUNT || "1000000000000000000000"; // 1000 WOD (18 decimals)
    await run("verify:verify", {
      address: validatorRegistryAddress,
      constructorArguments: [
        wodTokenAddress,
        process.env.DEPLOYER_ADDRESS || "0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F",
        minStake,
      ],
    });
    console.log("✅ ValidatorRegistry verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ ValidatorRegistry já estava verificado\n");
    } else {
      console.log(`❌ Erro ao verificar ValidatorRegistry: ${error.message}\n`);
    }
  }

  // Verificar Arena (se deployado)
  if (arenaAddress) {
    console.log("📝 Verificando Arena...");
    try {
      await run("verify:verify", {
        address: arenaAddress,
        constructorArguments: [
          wodTokenAddress,
          validatorRegistryAddress,
          process.env.DEPLOYER_ADDRESS || "0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F",
        ],
      });
      console.log("✅ Arena verificado!\n");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ Arena já estava verificado\n");
      } else {
        console.log(`❌ Erro ao verificar Arena: ${error.message}\n`);
      }
    }
  } else {
    console.log("⚠️  Arena não foi deployado ainda\n");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Verificação concluída!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

