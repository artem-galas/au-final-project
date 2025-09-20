import {network} from "hardhat";
import crypto from "node:crypto";

const items = [
  {name: "Blue shirt", url: 'ipfs://bafkreiczhypxfp7kq5ktk3ew3qh73cgehttppswoy7kzrtu6ulq5otvoi4', rarity: "rare"},
  {name: "Blue shirt", url: 'ipfs://bafkreiczhypxfp7kq5ktk3ew3qh73cgehttppswoy7kzrtu6ulq5otvoi4', rarity: "rare"},
  {name: "Blue shirt", url: 'ipfs://bafkreiczhypxfp7kq5ktk3ew3qh73cgehttppswoy7kzrtu6ulq5otvoi4', rarity: "rare"},
  {name: "Blue shirt", url: 'ipfs://bafkreiczhypxfp7kq5ktk3ew3qh73cgehttppswoy7kzrtu6ulq5otvoi4', rarity: "rare"},
  {name: "Blue shirt", url: 'ipfs://bafkreiczhypxfp7kq5ktk3ew3qh73cgehttppswoy7kzrtu6ulq5otvoi4', rarity: "rare"},
  {name: "Orange shirt", url: 'ipfs://bafkreihwlytf6czxaz2dx5x2zd6ktq3rs6jwbbxkgpihcudkrar76craki', rarity: "legendary"},
  {name: "Orange shirt", url: 'ipfs://bafkreihwlytf6czxaz2dx5x2zd6ktq3rs6jwbbxkgpihcudkrar76craki', rarity: "legendary"},
  {name: "Orange shirt", url: 'ipfs://bafkreihwlytf6czxaz2dx5x2zd6ktq3rs6jwbbxkgpihcudkrar76craki', rarity: "legendary"},
];

function cryptoRandom() {
  const typedArray = new Uint8Array(1);
  const randomValue = crypto.getRandomValues(typedArray)[0];
  return randomValue / Math.pow(2, 8);
}

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

  // Attach to deployed contract
  const AHPack = await viem.getContractAt("AHPack", contractAddress, {
    client: {wallet: owner},
  });

  const randomIndex = Math.floor(cryptoRandom() * items.length);

  const randomItem = items[randomIndex];

  const hash = await AHPack.write.reveal([owner.account.address, randomItem.url]);
  console.log("tx hash:", hash);

  console.log(`Pack Opens: ${randomItem.name}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
