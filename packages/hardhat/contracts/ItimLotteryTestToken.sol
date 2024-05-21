//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryToken.sol";

/**
 * Itim Lottery Test Token Contract
 * Author: chan1sook
 * Revision: 2
 * Last Updated: 2024-05-21 13:00
 */
contract ItimLotteryTestToken is ItimLotteryToken {
	constructor(address _owner, address[] memory _minters) ItimLotteryToken(_owner, _minters) {}
	
	function tapFaucet(uint256 amount) public {
		require(amount > 0, "Amount not zero");
		require(amount <= 100_000 ether, "Maximum 100,000 ethers/time");
        _mint(msg.sender, amount);
    }
}
