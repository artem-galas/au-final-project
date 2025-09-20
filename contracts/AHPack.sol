// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract AHPack is ERC1155, Ownable {
    uint256 public totalPacksMinted;
    uint256 public totalPacksBurned;
    uint256 public maxPackSupply;
    uint256 public nextTokenId = 1; // start revealed items from 1 upwards

    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory baseURI, uint256 supply) ERC1155(baseURI) Ownable(msg.sender) {
        maxPackSupply = supply;
        _setTokenURI(0, baseURI); // Set URI for pack token (ID 0)
    }

    // --- Metadata ---
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function _setTokenURI(uint256 tokenId, string memory newuri) internal virtual {
        _tokenURIs[tokenId] = newuri;
    }

    // --- Packs ---
    function mintPacks(address to, uint256 amount) external onlyOwner {
        require(totalPacksMinted + amount <= maxPackSupply, "Exceeds max supply");
        _mint(to, 0, amount, "");
        totalPacksMinted += amount;
    }

    function reveal(address to, string memory tokenUri) external onlyOwner {
        require(balanceOf(to, 0) > 0, "No packs to reveal");

        // Burn one pack from target address
        _burn(to, 0, 1);
        totalPacksBurned++;

        // Mint new revealed token
        uint256 newId = nextTokenId++;
        _mint(to, newId, 1, "");
        _setTokenURI(newId, tokenUri);
    }

    // --- Admin Controls ---
    function setMaxPackSupply(uint256 supply) external onlyOwner {
        require(supply > 0, "Supply must be greater than zero");
        maxPackSupply = supply;
    }
}
