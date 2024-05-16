//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * Itim Lottery Base Contract
 * Author: chan1sook
 * Revision: 1
 * Last Updated: 2024-05-14 22:12
 */
contract ItimLotteryBase is AccessControl {
	address public immutable owner;
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
	
	address public tokenContractAccount;
	address public treasuryAccount;

	uint256 public lotteryCost = 1 ether;
	uint256 public lotteryMinNumber = 0;
	uint256 public lotteryMaxNumber = 9999;
	uint256 private randomSeed;
	uint256 public lotteryReward = lotteryCost * 10;

	enum ItimLotteryState { NOT_STARTED, DECLARED, OPENING, EXPIRED, DRAWED}
	struct ItimLotteryData {
		ItimLotteryState state;
		uint256 expiredTime;
		uint256 drawTime;
		uint256 drawNumber;
	}
	uint256 public lastestLotteryId;
	mapping(uint256 => ItimLotteryData) public lotteryData;
	struct ItimLotteryBuyData {
		bool owned;
		address buyer;
		uint256 buyTime;
		bool claimed;
	}
	mapping(uint256 => mapping(uint256 => ItimLotteryBuyData)) public lotteryBuyData;
	mapping(uint256 => mapping(address => uint256)) public lotteryBuyerCount;
	mapping(uint256 => mapping(address => uint256[])) public lotteryBuyerData;

	constructor(address _owner, address[] memory _admins, address _tokenContractAccount, address _treasuryAccount, uint256 _randomSeed) {
		owner = _owner;
		randomSeed = _randomSeed;
		setAccounts(_tokenContractAccount, _treasuryAccount);
		
        _grantRole(ADMIN_ROLE, _owner);
		uint256 _adminsLength = _admins.length;
		for(uint256 i = 0; i < _adminsLength; i++) {
        	_grantRole(ADMIN_ROLE, _admins[i]);
		}
	}

	modifier isAdminOrOwner {
		require(msg.sender == owner || hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin or owner");
		_;
	}
	
	/// Admin Setter Section

	function setAccounts(address _tokenContract, address _treasuryAccount) public isAdminOrOwner {
		tokenContractAccount = _tokenContract;
		treasuryAccount = _treasuryAccount;

		console.log("Token Contract Account", tokenContractAccount);
		console.log("Treasury Account", treasuryAccount);
	}

	function setLotteryCost(uint256 _cost) public isAdminOrOwner {
		lotteryCost = _cost;
	}

	function setLotteryReward(uint256 _reward) public isAdminOrOwner {
		lotteryReward = _reward;
	}

	/// Change Lottery Section

	function declareLottery(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.NOT_STARTED, "Invalid lottery state");
		lotteryData[_id].state = ItimLotteryState.DECLARED;

		if(_id > lastestLotteryId) {
			lastestLotteryId = _id;
		}
	}
	
	function startBuyingLottery(uint256 _id, uint256 _expiredTime) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.DECLARED, "Invalid lottery state");
		lotteryData[_id].state = ItimLotteryState.OPENING;
		lotteryData[_id].expiredTime = _expiredTime;
	}
	
	function stopBuyingLottery(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		lotteryData[_id].state = ItimLotteryState.EXPIRED;
	}

	function drawRandomNumber(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.EXPIRED, "Invalid lottery state");
		lotteryData[_id].state = ItimLotteryState.DRAWED;
		lotteryData[_id].drawTime = block.timestamp;
		lotteryData[_id].drawNumber = _RollRng();
	}

	/// Fast Method

	function fastStartLottery(uint256 _id, uint256 _expiredTime) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.NOT_STARTED, "Invalid lottery state");
		lotteryData[_id].state = ItimLotteryState.OPENING;
		lotteryData[_id].expiredTime = _expiredTime;
		
		if(_id > lastestLotteryId) {
			lastestLotteryId = _id;
		}
	}

	function fastStopLottery(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		lotteryData[_id].state = ItimLotteryState.DRAWED;
		lotteryData[_id].drawTime = block.timestamp;
		lotteryData[_id].drawNumber = _RollRng();
	}


	/// Lottery Number Section
	
	function setLotteryNumberRange(uint256 _min, uint256 _max) public isAdminOrOwner {
		require(_min < _max, "Invalid Number Range");
		lotteryMinNumber = _min;
		lotteryMaxNumber = _max;
	}
	
	function isValidNumber(uint256 _number) public view returns (bool) {
		return _number >= lotteryMinNumber && _number <= lotteryMaxNumber;
	}

	function _RollRng() private returns (uint256) {
		randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, randomSeed)));
		uint256 value = lotteryMinNumber + (randomSeed % (lotteryMaxNumber - lotteryMinNumber));
		console.log("Actual Number:", value);
		return value;
	}

	/// Buyer Section

	function buyLottery(uint256 _id, uint256 _number) public {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		require(isValidNumber(_number), "Invalid number");
		require(!lotteryBuyData[_id][_number].owned, "Lottery owned");
		lotteryBuyData[_id][_number].owned = true;
		lotteryBuyData[_id][_number].buyer = msg.sender;
		lotteryBuyData[_id][_number].buyTime = block.timestamp;
		lotteryBuyerCount[_id][msg.sender] += 1;
		lotteryBuyerData[_id][msg.sender].push(_number);
		
		IERC20(tokenContractAccount).transferFrom(msg.sender, treasuryAccount, lotteryCost);
	}

	function _calculateRewardOfLotteryNumber(uint256 _id, uint256 _number) virtual public view returns (uint256) {
		if(lotteryData[_id].drawNumber == _number) {
			return lotteryReward;
		}

		return 0;
	}

	function getRewardOfLottery(uint256 _id, uint256 _number) public view returns (uint256) {
		require(lotteryData[_id].state == ItimLotteryState.DRAWED, "Invalid lottery state");
		require(isValidNumber(_number), "Invalid number");

		return _calculateRewardOfLotteryNumber(_id, _number);
	}

	function claimLottery(uint256 _id, uint256 _number) public {
		require(lotteryData[_id].state == ItimLotteryState.DRAWED, "Invalid lottery state");
		require(isValidNumber(_number), "Invalid number");
		require(lotteryBuyData[_id][_number].owned, "Lottery not owned");
		require(lotteryBuyData[_id][_number].buyer == msg.sender, "Not your lottery");
		require(!lotteryBuyData[_id][_number].claimed, "Already claimed");

		lotteryBuyData[_id][_number].claimed = true;
		
		uint256 reward = getRewardOfLottery(_id, _number);
		if(reward > 0) {
			IERC20(tokenContractAccount).transferFrom(treasuryAccount, msg.sender, reward);
		}
	}
}