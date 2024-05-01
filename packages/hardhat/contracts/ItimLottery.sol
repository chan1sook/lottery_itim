//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Item Lottery Contract
 */
contract ItimLottery {
	enum LotteryPhaseState{ NOT_START, BUYING, EXPIRED, DRAWED }

	address public immutable owner;
	uint256 public lastestGameId;
	mapping(uint256 => LotteryPhaseState) public state;
	mapping(uint256 => uint256) public number;
	mapping(uint256 => uint256) public drawTime;
	mapping(uint256 => uint256) public expiredTime;

	constructor(address _owner) {
		owner = _owner;
	}

	modifier isOwner() {
		require(msg.sender == owner, "Not the Owner");
		_;
	}
}
