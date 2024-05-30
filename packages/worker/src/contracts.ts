import deployedContracts from "./contracts/deployedContracts";
import { sepolia, jbc } from "viem/chains";
import { getClient } from "./account";
import { getContract } from "viem";

function _getTestContracts() {
  const client = getClient();
  const testDeployedContract = deployedContracts[sepolia.id];

  return {
    ItimLotteryToken: getContract({
      address: testDeployedContract.ItimLotteryToken.address,
      abi: testDeployedContract.ItimLotteryToken.abi,
      client: client,
    }),
    ItimLottery2Digits: getContract({
      address: testDeployedContract.ItimLottery2Digits.address,
      abi: testDeployedContract.ItimLottery2Digits.abi,
      client: client,
    }),
    ItimLottery3Digits: getContract({
      address: testDeployedContract.ItimLottery3Digits.address,
      abi: testDeployedContract.ItimLottery3Digits.abi,
      client: client,
    }),
    ItimLottery4Digits: getContract({
      address: testDeployedContract.ItimLottery4Digits.address,
      abi: testDeployedContract.ItimLottery4Digits.abi,
      client: client,
    }),
    ItimLottery12NumbersRoom10: getContract({
      address: testDeployedContract.ItimLottery12NumbersRoom10.address,
      abi: testDeployedContract.ItimLottery12NumbersRoom10.abi,
      client: client,
    }),
    ItimLottery12NumbersRoom20: getContract({
      address: testDeployedContract.ItimLottery12NumbersRoom20.address,
      abi: testDeployedContract.ItimLottery12NumbersRoom20.abi,
      client: client,
    }),
    ItimLottery12NumbersRoom50: getContract({
      address: testDeployedContract.ItimLottery12NumbersRoom50.address,
      abi: testDeployedContract.ItimLottery12NumbersRoom50.abi,
      client: client,
    }),
    ItimLottery12NumbersRoom100: getContract({
      address: testDeployedContract.ItimLottery12NumbersRoom100.address,
      abi: testDeployedContract.ItimLottery12NumbersRoom100.abi,
      client: client,
    }),
    ItimLottery12NumbersRoom500: getContract({
      address: testDeployedContract.ItimLottery12NumbersRoom500.address,
      abi: testDeployedContract.ItimLottery12NumbersRoom500.abi,
      client: client,
    }),
    ItimLotteryOddEven: getContract({
      address: testDeployedContract.ItimLotteryOddEven.address,
      abi: testDeployedContract.ItimLotteryOddEven.abi,
      client: client,
    }),
  };
}
function _getContracts() {
  return _getTestContracts();
}

export type ContractSet = ReturnType<typeof _getContracts>;

let cachedContracts: ContractSet | undefined;

export function getContracts() {
  if (!cachedContracts) {
    cachedContracts = _getContracts();
  }
  return cachedContracts;
}
