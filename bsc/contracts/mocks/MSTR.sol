// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract MSTRToken is ERC20, Ownable {    
    constructor() ERC20("MSTR Token", "MSTR") {
    }

    function mint(address to, uint256 amount) external{
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual {
        _burn(msg.sender, amount);
    }

    
}