//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryBase.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Itim Lottery 4 Digits
 * Author: chan1sook
 * Revision: 1
 * Last Updated: 2024-05-14 22:12
 */
contract ItimLottery4Digits is ItimLotteryBase {
	uint256 public lotteryReward2nd = lotteryCost * 2;
	uint256 public lotteryReward3rd = lotteryCost * 3 / 2;
	
	constructor(address _owner, address[] memory _admins, address _tokenContractAccount, address _treasuryAccount, uint256 _randomSeed) ItimLotteryBase(_owner, _admins, _tokenContractAccount, _treasuryAccount, _randomSeed) {
		setLotteryNumberRange(0, 9999);
	}

	/// Prize
	/// 1st => exact
	/// 2nd => match last 3
	/// 3rd => match last 2
	
	function setLotteryOthersReward(uint256 _reward2nd, uint256 _reward3rd) public isAdminOrOwner {
		lotteryReward2nd = _reward2nd;
		lotteryReward3rd = _reward3rd;
	}
	
	/// Extended Reward Section

	function _splitNumber(uint256 _number) private pure returns (uint8[4] memory) {
		uint8[4] memory tokens = [0, 0, 0, 0];

		tokens[3] = (uint8) (_number % 10);
		tokens[2] = (uint8) ((_number / 10) % 10);
		tokens[1] = (uint8) ((_number / 100) % 10);
		tokens[0] = (uint8) (_number / 1000);

		return tokens;
	}

	function _isNumberMatch2ndPrize(uint256 _id, uint256 _number) private view returns (bool) {
		uint8[4] memory tokens1 = _splitNumber(_number);
		uint8[4] memory tokens2 = _splitNumber(lotteryData[_id].drawNumber);
		
		for(uint8 i = 1; i < 4; i++) {
			console.log("digits", i);
			console.log(tokens1[i], tokens2[i]);
			if(tokens1[i] != tokens2[i]) {
				return false;
			}
		}

		return true;
	}

	function _isNumberMatch3rdPrize(uint256 _id, uint256 _number) private view returns (bool) {
		uint8[4] memory tokens1 = _splitNumber(_number);
		uint8[4] memory tokens2 = _splitNumber(lotteryData[_id].drawNumber);
		
		for(uint8 i = 2; i < 4; i++) {
			console.log("digits", i);
			console.log(tokens1[i], tokens2[i]);
			if(tokens1[i] != tokens2[i]) {
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
		if(_isNumberMatch3rdPrize(_id, _number)) {
			return lotteryReward3rd;
		}

		return 0;
	}
}
