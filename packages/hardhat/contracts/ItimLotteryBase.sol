//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryToken.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * Itim Lottery Base Contract
 * Author: chan1sook
 * Revision: 4
 * Last Updated: 2024-05-30 9:00
 */
contract ItimLotteryBase is AccessControl {
	address public immutable owner;
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
	
	address public tokenContractAccount;

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
		uint256 buyCount;
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
	mapping(uint256 => mapping(address => uint256[])) public lotteryBuyerData;

	uint256 public lotteryRoomCapacity = 1;
	uint256[] public lotteryRoomActives;

	event LotteryStateChange(uint256 indexed id, ItimLotteryState indexed state);
	event LotteryBuy(uint256 indexed id, address indexed buyer, uint256 number);
	event LotteryRoll(uint256 indexed id, uint256 number);
	event LotteryClaim(uint256 indexed id, address indexed claimer, uint256 number, uint256 amount);

	constructor(address _owner, address[] memory _admins, address _tokenContractAccount, uint256 _randomSeed) {
		owner = _owner;
		randomSeed = _randomSeed;
		setTokenContractAccount(_tokenContractAccount);
		
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
	
	function lotteryRoomActivesLength() public view returns (uint256) {
		return lotteryRoomActives.length;
	}
	
	/// Admin Setter Section

	function setAdminRole(address _address, bool _isAdmin) public isAdminOrOwner {
		require(msg.sender != _address, "Not self");
		require( _address != owner, "Owner always admin");
		
		if(_isAdmin) {
        	_grantRole(ADMIN_ROLE, _address);
		} else {
        	_revokeRole(ADMIN_ROLE, _address);
		}
	}
	
	function setTokenContractAccount(address _tokenContract) public isAdminOrOwner {
		tokenContractAccount = _tokenContract;

		console.log("Token Contract Account", tokenContractAccount);
	}

	function setLotteryCost(uint256 _cost) public isAdminOrOwner {
		lotteryCost = _cost;
	}

	function setLotteryReward(uint256 _reward) public isAdminOrOwner {
		lotteryReward = _reward;
	}
	
	function setLotteryRoomCap(uint256 _capacity) public isAdminOrOwner {
		lotteryRoomCapacity = _capacity;
	}

	/// Change Lottery Section helper function
	function _updateLotteryState(uint256 _id, ItimLotteryState state) private {
		lotteryData[_id].state = state;
		emit LotteryStateChange(_id, state);
	}

	function _setRollNumber(uint256 _id, uint256 number) private {
		require(isValidNumber(number), "Invalid roll number");
		lotteryData[_id].drawNumber = number;
		emit LotteryRoll(_id, number);
	}

	function _startLotteryCmd(uint256 _id, uint256 _expiredTime) private {
		_updateLotteryState(_id, ItimLotteryState.OPENING);
		lotteryData[_id].expiredTime = _expiredTime;

		require(lotteryRoomActives.length < lotteryRoomCapacity, "Reach maximum room capacity");
		lotteryRoomActives.push(_id);
	}

	function _closeLotteryCmd(uint256 _id) private {
		uint256 length = lotteryRoomActives.length;
		bool arrShifted = false;
        for (uint256 i = 0; i < length - 1; i++) {
			if(!arrShifted && lotteryRoomActives[i] == _id) {
				// mark arr shifted
				arrShifted = true;
			}
			if(arrShifted) {
				lotteryRoomActives[i] = lotteryRoomActives[i + 1];
			}
        }
        lotteryRoomActives.pop();
	}

	/// Change Lottery Section
	function declareLottery(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.NOT_STARTED, "Invalid lottery state");
		_updateLotteryState(_id, ItimLotteryState.DECLARED);

		if(_id > lastestLotteryId) {
			lastestLotteryId = _id;
		}
	}
	
	function startBuyingLottery(uint256 _id, uint256 _expiredTime) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.DECLARED, "Invalid lottery state");
		_startLotteryCmd(_id, _expiredTime);
	}
	
	function stopBuyingLottery(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		_updateLotteryState(_id, ItimLotteryState.EXPIRED);
		_closeLotteryCmd(_id);
	}

	function drawRandomNumber(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.EXPIRED, "Invalid lottery state");
		_updateLotteryState(_id, ItimLotteryState.DRAWED);
		lotteryData[_id].drawTime = block.timestamp;
		_setRollNumber(_id, _rollRng());
	}

	function drawRandomNumberWithResult(uint256 _id, uint256 number) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.EXPIRED, "Invalid lottery state");
		_updateLotteryState(_id, ItimLotteryState.DRAWED);
		lotteryData[_id].drawTime = block.timestamp;
		_setRollNumber(_id, number);
	}

	/// Fast Method

	function fastStartLottery(uint256 _id, uint256 _expiredTime) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.NOT_STARTED, "Invalid lottery state");
		_startLotteryCmd(_id, _expiredTime);
		
		if(_id > lastestLotteryId) {
			lastestLotteryId = _id;
		}
	}

	function fastStopLottery(uint256 _id) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		_updateLotteryState(_id, ItimLotteryState.DRAWED);
		lotteryData[_id].drawTime = block.timestamp;
		_setRollNumber(_id, _rollRng());
		_closeLotteryCmd(_id);
	}

	function fastStopLotteryWithResult(uint256 _id, uint256 number) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		_updateLotteryState(_id, ItimLotteryState.DRAWED);
		lotteryData[_id].drawTime = block.timestamp;
		_setRollNumber(_id, number);
		_closeLotteryCmd(_id);
	}

	function fastStopLotteryAndRestart(uint256 _id, uint256 _expiredTime) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		fastStopLottery(_id);
		fastStartLottery(lastestLotteryId + 1, _expiredTime);
	}

	function fastStopLotteryWithResultAndRestart(uint256 _id, uint256 number, uint256 _expiredTime) public isAdminOrOwner {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		fastStopLotteryWithResult(_id, number);
		fastStartLottery(lastestLotteryId + 1, _expiredTime);
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

	function _rollRng() private returns (uint256) {
		randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, randomSeed)));
		uint256 value = lotteryMinNumber + (randomSeed % (lotteryMaxNumber - lotteryMinNumber));
		console.log("Actual Number:", value);
		return value;
	}

	/// Misc
	function isLotteryRoomFull(uint256 _id) virtual public view returns (bool) {
		return lotteryData[_id].buyCount >= (lotteryMaxNumber -  lotteryMinNumber + 1);
	}

	/// Buyer Section
	function lotteryBuyCount(uint256 _id) public view returns (uint256) {
		return lotteryBuyerData[_id][msg.sender].length;
	}

	function buyLottery(uint256 _id, uint256 _number) public {
		require(lotteryData[_id].state == ItimLotteryState.OPENING, "Invalid lottery state");
		require(isValidNumber(_number), "Invalid number");
		require(!lotteryBuyData[_id][_number].owned, "Lottery owned");
		lotteryData[_id].buyCount++;
		lotteryBuyData[_id][_number].owned = true;
		lotteryBuyData[_id][_number].buyer = msg.sender;
		lotteryBuyData[_id][_number].buyTime = block.timestamp;
		lotteryBuyerData[_id][msg.sender].push(_number);
		
		// use burn instend treasuryAccount
		ItimLotteryToken(tokenContractAccount).burnTo(msg.sender, lotteryCost);
		emit LotteryBuy(_id, msg.sender, _number);
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
			// use mint instend treasuryAccount
			ItimLotteryToken(tokenContractAccount).mintTo(msg.sender, reward);
		}
		emit LotteryClaim(_id, msg.sender, _number, reward);
	}
}
