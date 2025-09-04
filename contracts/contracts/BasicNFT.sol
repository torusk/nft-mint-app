// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BasicNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
        Ownable(msg.sender)
    {}

    function safeMint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(to, tokenId);
        return tokenId;
    }
}

