import { createWalletClient, getContract, http, publicActions } from "viem";
import { sepolia, jbc } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

function _getAccount() {
  return privateKeyToAccount(`0x${process.env.WORKER_ACCOUNT_PRIVATE_KEY}`);
}

export type BlockchainAccount = ReturnType<typeof _getAccount>;

let cachedAccount: BlockchainAccount | undefined;

export function getAccount() {
  if (!cachedAccount) {
    cachedAccount = _getAccount();
  }
  return cachedAccount;
}

function _getClient() {
  const account = getAccount();
  return createWalletClient({
    account: account,
    chain: sepolia,
    transport: http(),
  }).extend(publicActions);
}

export type BlockchainClient = ReturnType<typeof _getClient>;

let cachedClient: BlockchainClient | undefined;

export function getClient() {
  if (!cachedClient) {
    cachedClient = _getClient();
  }
  return cachedClient;
}
