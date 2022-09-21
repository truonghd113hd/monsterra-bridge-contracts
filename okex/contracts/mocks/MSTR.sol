// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract MSTRToken is ERC20, Ownable {    
    address public minter;
    constructor(address minter_) ERC20("MSTR Token", "MSTR") {
        minter = minter_;    
    }

    modifier onlyMinter() {
        require(minter == msg.sender, "ROLE: require minter");
        _;
    }

    function mint(address to, uint256 amount) external onlyMinter{
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external virtual {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public virtual {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }

    
}