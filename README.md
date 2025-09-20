# Alchemy University Final Project

This project is a final project for the Alchemy University course. 
It demonstrates how to set up a Hardhat project with Solidity and TypeScript tests, as well as how to deploy a contract using Ignition.

Contract is deployed to **BaseSepolia** at: [0x3f2734DAb7346729dD1DD194b776DAC1465d4630](https://sepolia.basescan.org/address/0x3f2734DAb7346729dD1DD194b776DAC1465d4630)

## Project Overview
**AHPack** is a smart contract that allows users to create and manage "packs" of items. Each pack can contain one item.

Packs can be created, opened, and managed by OWNER.

The idea that users can buy packs, open them, and receive random items from the pack.

### Contract functions
**AHPack** contract extends ERC1155 and Ownable from OpenZeppelin.

Pack is a ERC1155 token with tokenID 0.

- `mintPacks`: Allows the OWNER to mint multiple new packs to a specified address;
- `reveal`: Allows the OWNER to open a pack and receive a random item from the pack;
  - When a pack is opened, the pack token is burned, and a new item token is minted to the provided address;

## Full stack future project
The full stack project will have a front-end interface where users can see and open their packs, and back-end services to interact with contract;

Since all interactions with the contract are required to be done by the OWNER.

Back End service will store list of available items, and randomly select an item and set it as a new item in the pack.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

### Make a deployment to Sepolia

To run the deployment to Sepolia, you need an account with funds to send the transaction.

The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY` and `SEPOLIA_RPC_URL`, which you can set using `.env` file.

Ignition module to deploy the contract.

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/AHPack.ts
```
