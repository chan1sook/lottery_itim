//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * Itim Lottery Token Contract
 * Author: chan1sook
 * Revision: 4
 * Last Updated: 2024-05-30 9:00
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

	function setMinterRole(address _address, bool _isAdmin) public isMinterOrOwner {
		require(msg.sender != _address, "Not self");
		require( _address != owner, "Owner always minter");
		
		if(_isAdmin) {
        	_grantRole(MINTER_ROLE, _address);
		} else {
        	_revokeRole(MINTER_ROLE, _address);
		}
	}

	function mintTo(address target, uint256 amount) public isMinterOrOwner {
        _mint(target, amount);
    }

	
	function burnTo(address target, uint256 amount) public isMinterOrOwner {
        _burn(target, amount);
    }
}
