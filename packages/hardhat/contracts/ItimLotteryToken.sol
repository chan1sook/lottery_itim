//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * Itim Lottery Token Contract
 * Author: chan1sook
 * Revision: 2
 * Last Updated: 2024-05-21 13:00
 */
contract ItimLotteryToken is ERC20, AccessControl {
	address public immutable owner;
	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
	
	constructor(address _owner, address[] memory _minters) ERC20("Itim Lottery Token", "ITIM") {
		owner = _owner;
        _grantRole(MINTER_ROLE, _owner);
		uint256 _mintersLength = _minters.length;
		for(uint256 i = 0; i < _mintersLength; i++) {
        	_grantRole(MINTER_ROLE, _minters[i]);
		}
	}

	modifier isMinterOrOwner {
		require(msg.sender == owner || hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter or owner");
		_;
	}

	function mintTo(address target, uint256 amount) public isMinterOrOwner {
        _mint(target, amount);
    }
}
