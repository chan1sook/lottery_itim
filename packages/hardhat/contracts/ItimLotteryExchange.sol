//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./ItimLotteryToken.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * Itim Lottery Exchange
 * Author: chan1sook
 * Revision: 4
 * Last Updated: 2024-05-30 9:00
 */
contract ItimLotteryExchange is AccessControl {
	address public immutable owner;
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

	address public tokenContractAccount;
	uint256 public exchangeToRatePerEther = 1000 ether; // Coversation Rate Ether => Token

	uint256 public exchangeToFeeRatePerEther = 0.05 ether; // token 5% fee / ether
	uint256 public exchangeBackFeePerEther = 0.01 ether; // token 1% fee / ether
	
	constructor(address _owner, address[] memory _admins, address _tokenContractAccount) {
		owner = _owner;
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
	
	function setExchangeTokenRate(uint256 tokenRate) public isAdminOrOwner {
		exchangeToRatePerEther = tokenRate;
	}

	function setExchangeFeeRate(uint256 feeToPerEther, uint256 feeBackPerEther) public isAdminOrOwner {
		require(feeToPerEther < 1 ether && feeBackPerEther < 1 ether, "Too much fee");
		exchangeToFeeRatePerEther = feeToPerEther;
		exchangeBackFeePerEther = feeBackPerEther;
	}

	// admin tap ether
	function tapEther(uint256 amount) public isAdminOrOwner {
 		require(amount > 0);
		(bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Payment failed.");
	}

	/// expose compute functions
	function computeEtherToTokenExchange(uint256 value) public view returns (uint256) {
		uint256 itimTokenGain = value * exchangeToRatePerEther / 1 ether;
		uint256 itimFee = itimTokenGain * exchangeToFeeRatePerEther / 1 ether;
		console.log("Token Gain:", itimTokenGain);
		console.log("Fee:", itimFee);
		return itimTokenGain - itimFee;
	}

	function computeTokenToEtherExchange(uint256 value) public view returns (uint256) {
		uint256 itimFee = value * exchangeBackFeePerEther / 1 ether;
		uint256 itimRemain = value - itimFee;
		
		console.log("Fee:", itimFee);
		console.log("Token Remain:", itimRemain);

		return (itimRemain * 1 ether) / exchangeToRatePerEther;
	}

	// magical mint token from ether
	function exchangeEtherToToken() payable public {
		require(msg.value > 0, "Required Ether");
		
		console.log("Ether:", msg.value);
		
		uint256 actualItimGain = computeEtherToTokenExchange(msg.value);
		
		console.log("Total:", actualItimGain);

		ItimLotteryToken(tokenContractAccount).mintTo(msg.sender, actualItimGain);
	}

	// magical burn token for ether
	function exchangeTokenBackToEther(uint256 itimAmount) public {
		require(itimAmount > 0, "Required Ether");
		
		console.log("Token Amount:", itimAmount);

		uint256 etherRequired = computeTokenToEtherExchange(itimAmount);

		console.log("Required Ether:", etherRequired);
		ItimLotteryToken(tokenContractAccount).burnTo(msg.sender, itimAmount);

		(bool success, ) = payable(msg.sender).call{value: etherRequired}("");
        require(success, "Payment failed.");
	}

	receive() external payable {}
	fallback() external payable {}
}
