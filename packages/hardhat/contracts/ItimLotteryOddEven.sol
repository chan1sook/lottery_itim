//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryBase.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Itim Lottery Odd-Even Game
 * Author: chan1sook
 * Revision: 2
 * Last Updated: 2024-05-21 13:00
 */
contract ItimLotteryOddEven is ItimLotteryBase {
	constructor(address _owner, address[] memory _admins, address _tokenContractAccount, address _treasuryAccount, uint256 _randomSeed) ItimLotteryBase(_owner, _admins, _tokenContractAccount, _treasuryAccount, _randomSeed) {
		setLotteryNumberRange(1, 12); // Still 1-12 Number
		setLotteryRoomCap(5);
		setLotteryCost(1000 ether);
		setLotteryReward(lotteryCost * 7 / 10); // 70% of [lotteryCost]
	}
	
	/// Prize
	/// 1st => odd/even match [1-12]

	function _isNumberOdd(uint256 _number) public pure returns (bool) {
		return _number % 2 != 0;
	}
	
	function _calculateRewardOfLotteryNumber(uint256 _id, uint256 _number) override public view returns (uint256) {
		if(_isNumberOdd(lotteryData[_id].drawNumber) == _isNumberOdd(_number)) {
			return lotteryReward;
		}

		return 0;
	}
}
