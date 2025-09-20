import {network} from "hardhat";

async function main() {
  const {viem} = await network.connect({
    network: "sepolia",
  });
  const [owner] = await viem.getWalletClients();

  // Replace with your deployed contract address
  const contractAddress = process.env.PACK_CONTRACT as `0x${string}`;

  if (!contractAddress) {
    throw new Error("Please set PACK_CONTRACT env var to the deployed contract address");
  }

  // Amount of packs to mint
  const amount = BigInt(process.env.MINT_AMOUNT || "1");

  // Attach to deployed contract
  const AHPack = await viem.getContractAt("AHPack", contractAddress, {
    client: {wallet: owner},
  });

  console.log(`Minting ${amount} pack(s) to owner ${owner.account.address}...`);

  const hash = await AHPack.write.mintPacks([owner.account.address, amount]);
  console.log("tx hash:", hash);

  // Read balances
  const balance = await AHPack.read.balanceOf([owner.account.address, 0n]);
  console.log("Owner packs balance:", balance.toString());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
