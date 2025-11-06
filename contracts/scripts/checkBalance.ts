import { ethers } from "hardhat";
import hre from "hardhat";

/**
 * Script para verificar saldo em diferentes redes
 * Uso: npx hardhat run scripts/checkBalance.ts --network <network>
 * Ou execute para cada rede separadamente
 */

const address = process.env.DEPLOYER_ADDRESS || "0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F";

async function checkBalance(networkName: string, rpcUrl: string, chainId: number) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    console.log(`\n${networkName} (chainId: ${chainId}):`);
    console.log(`  Saldo: ${balanceInEth} POL`);
    console.log(`  Endereço: ${address}`);
    return { networkName, balance: balanceInEth, hasFunds: parseFloat(balanceInEth) > 0 };
  } catch (error) {
    console.log(`\n${networkName}: ❌ Erro ao conectar`);
    return { networkName, balance: "0", hasFunds: false };
  }
}

async function main() {
  console.log("🔍 Verificando saldo em diferentes redes...\n");
  console.log(`Endereço: ${address}\n`);

  const networks = [
    {
      name: "Polygon Mainnet",
      rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      chainId: 137,
    },
    {
      name: "Polygon Mumbai",
      rpcUrl: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
    },
    {
      name: "Polygon Amoy",
      rpcUrl: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      chainId: 80002,
    },
  ];

  const results = [];
  for (const network of networks) {
    const result = await checkBalance(network.name, network.rpcUrl, network.chainId);
    results.push(result);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 RESUMO:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const networksWithFunds = results.filter((r) => r.hasFunds);
  if (networksWithFunds.length === 0) {
    console.log("❌ Nenhum saldo encontrado em nenhuma rede");
  } else {
    networksWithFunds.forEach((r) => {
      console.log(`✅ ${r.networkName}: ${r.balance} POL`);
    });
  }

  const amoyResult = results.find((r) => r.networkName === "Polygon Amoy");
  if (amoyResult && !amoyResult.hasFunds) {
    console.log("\n⚠️  Polygon Amoy está sem saldo!");
    console.log("💡 Opções:");
    console.log("   1. Solicitar no faucet: https://faucet.polygon.technology/");
    console.log("   2. Ver guia: docs/TRANSFERIR_POL_MAINNET_AMOY.md");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

