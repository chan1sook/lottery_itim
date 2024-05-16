//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryBase.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Itim Lottery 2 Digits
 * Author: chan1sook
 * Revision: 1
 * Last Updated: 2024-05-14 22:12
 */
contract ItimLottery2Digits is ItimLotteryBase {
	constructor(address _owner, address[] memory _admins, address _tokenContractAccount, address _treasuryAccount, uint256 _randomSeed) ItimLotteryBase(_owner, _admins, _tokenContractAccount, _treasuryAccount, _randomSeed) {
		setLotteryNumberRange(0, 99);
	}
	
	/// Prize
	/// 1st => exact
	/// it's has same behavior in [_calculateRewardOfLotteryNumber] 
}
