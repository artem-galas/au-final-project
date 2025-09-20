import { describe, test} from "node:test";
import assert from "node:assert/strict";
import {
  getContract,
} from "viem";
import {network} from "hardhat";

const {viem} = await network.connect();

async function deployContract() {
  return viem.deployContract("AHPack", [
    "ipfs://pack-base-uri/",
    5n, // max supply
  ]);
}

describe("AHPack", async function () {
  const publicClient = await viem.getPublicClient();
  const [deployer, user] = await viem.getWalletClients();

  describe('Positive flow', () => {
    test('mint + reveal by owner', async () => {
      const contract = await deployContract();

      // Mint 2 packs to user
      const address = user.account?.address;
      await contract.write.mintPacks([address, 2n]);

      let balance = await contract.read.balanceOf([address, 0n]);
      assert.equal(balance, 2n);

      // Owner reveals 1 pack for user
      await contract.write.reveal([address, "ipfs://revealed-item-1"]);

      balance = await contract.read.balanceOf([address, 0n]);
      assert.equal(balance, 1n, "user should have 1 pack left");

      const revealedBalance = await contract.read.balanceOf([address, 1n]);
      assert.equal(revealedBalance, 1n, "user should have 1 revealed NFT");

      const uri = await contract.read.uri([1n]);
      assert.equal(uri, "ipfs://revealed-item-1");
    });
    test('set max supply by owner', async () => {
      const contract = await deployContract();

      await contract.write.setMaxPackSupply([10n]);
      const maxSupply = await contract.read.maxPackSupply();

      assert.equal(maxSupply, 10n, "max supply should be updated to 10");
    })
  });

  describe('Negative flow', () => {
    test('user cannot call reveal', async () => {
      const contract = await deployContract();

      const userContract = getContract({
        address: contract.address,
        abi: contract.abi,
        client: {wallet: user, public: publicClient},
      });

      // Mint 1 pack to user
      await contract.write.mintPacks([user.account.address, 1n]);

      await assert.rejects(
        userContract.write.reveal([user.account.address, "ipfs://should-fail"]),
        /OwnableUnauthorizedAccount/,
        "user should not be allowed to reveal"
      );
    })

    test("cannot reveal without packs", async () => {
      const contract = await deployContract();

      await assert.rejects(
        contract.write.reveal([user.account.address, "ipfs://no-pack"]),
        /No packs to reveal/,
        "should not allow reveal when user has no packs"
      );
    });
  });
});
