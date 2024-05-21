//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryBase.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Itim Lottery 12 Numbers
 * Author: chan1sook
 * Revision: 2
 * Last Updated: 2024-05-21 13:00
 */
contract ItimLottery12Numbers is ItimLotteryBase {
	constructor(address _owner, address[] memory _admins, address _tokenContractAccount, address _treasuryAccount, uint256 _randomSeed) ItimLotteryBase(_owner, _admins, _tokenContractAccount, _treasuryAccount, _randomSeed) {
		setLotteryNumberRange(1, 12);
		setLotteryRoomCap(5);
		setLotteryCost(100 ether);
		setLotteryReward(lotteryCost * 6); // 6x of [lotteryCost]
	}
	
	/// Prize
	/// 1st => exact
	/// it's has same behavior in [_calculateRewardOfLotteryNumber] 
}
