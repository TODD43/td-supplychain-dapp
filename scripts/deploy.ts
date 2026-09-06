import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SupplyChain contract...");

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  await supplyChain.waitForDeployment();

  const contractAddress = await supplyChain.getAddress();
  console.log("SupplyChain contract deployed to:", contractAddress);

  // Save contract address to .env for frontend
  console.log("\nAdd this to your .env.local:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
