//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryBase.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Itim Lottery 3 Digits
 * Author: chan1sook
 * Revision: 1
 * Last Updated: 2024-05-14 22:12
 */
contract ItimLottery3Digits is ItimLotteryBase {
	uint256 public lotteryReward2nd = lotteryCost * 2;
	constructor(address _owner, address[] memory _admins, address _tokenContractAccount, address _treasuryAccount, uint256 _randomSeed) ItimLotteryBase(_owner, _admins, _tokenContractAccount, _treasuryAccount, _randomSeed) {
		setLotteryNumberRange(0, 999);
	}

	/// Prize
	/// 1st => exact
	/// 2nd => total symbol match
	
	function setLottery2ndReward(uint256 _reward2nd) public isAdminOrOwner {
		lotteryReward2nd = _reward2nd;
	}
	
	/// Extended Reward Section

	function _histogramNumber(uint256 _number) private pure returns (uint8[10] memory) {
		uint8[10] memory histogram = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		uint256 digit3 = _number % 10;
		uint256 digit2 = (_number / 10) % 10 ;
		uint256 digit1 = _number / 100;
		histogram[digit1]++;
		histogram[digit2]++;
		histogram[digit3]++;

		return histogram;
	}

	function _isNumberMatch2ndPrize(uint256 _id, uint256 _number) private view returns (bool) {
		uint8[10] memory historgram1 = _histogramNumber(_number);
		uint8[10] memory historgram2 = _histogramNumber(lotteryData[_id].drawNumber);
		
		for(uint8 i = 0; i < 10; i++) {
			console.log("historgram", i);
			console.log(historgram1[i], historgram2[i]);
			if(historgram1[i] != historgram2[i]) {
				return false;
			}
		}

		return true;
	}

	function _calculateRewardOfLotteryNumber(uint256 _id, uint256 _number) override public view returns (uint256) {
		if(lotteryData[_id].drawNumber == _number) {
			return lotteryReward;
		}
		if(_isNumberMatch2ndPrize(_id, _number)) {
			return lotteryReward2nd;
		}

		return 0;
	}
}
