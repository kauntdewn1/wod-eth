// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WODToken
 * @dev Token ERC20 do protocolo WOD [X] PRO ($WOD)
 */
contract WODToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("WOD Token", "WOD") Ownable(initialOwner) {
        // Supply inicial pode ser mintado conforme necessário
        // ou distribuído via on-ramp (Alchemy Pay)
    }

    /**
     * @dev Mint tokens para um endereço (usado para on-ramp)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}

