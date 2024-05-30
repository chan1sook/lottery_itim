import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { randomBytes } from "crypto";
import wait from "wait";

// prevent REPLACEMENT_UNDERPRICED problem
async function waitSepolia() {
  const sec = 45;
  console.log(`Wait block update: ${sec} secs`);
  await wait(sec * 1000);
}

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */

  const chainId = await hre.getChainId();
  const { deployer, developer, aon, worker } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const isSepoliaChain = chainId === "11155111";

  const itimTokenContractName = "ItimLotteryToken";
  const minters = [developer, aon];

  const { address: tokenAddress } = await deploy(itimTokenContractName, {
    from: deployer,
    args: [deployer, minters],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const itimTokenContract = await hre.ethers.getContract<Contract>(itimTokenContractName, deployer);
  console.log("address:", await itimTokenContract.getAddress());
  console.log("Minters:", minters);

  const exchangeAdmins = minters;
  const itimExchangeContract = "ItimLotteryExchange";

  let justDeployed = false;
  const { address: exchangeAddress, newlyDeployed: exchangeDeployed } = await deploy(itimExchangeContract, {
    from: deployer,
    args: [deployer, exchangeAdmins, tokenAddress],
    log: true,
    autoMine: true,
  });
  justDeployed = exchangeDeployed;

  const MINTER_ROLE = await itimTokenContract.MINTER_ROLE();

  if (!(await itimTokenContract.hasRole(MINTER_ROLE, exchangeAddress))) {
    if (justDeployed && isSepoliaChain) {
      await waitSepolia();
    }

    console.log("setMinterRole:", exchangeAddress);
    await itimTokenContract.setMinterRole(exchangeAddress, true);
    justDeployed = true;
  }

  const contractNames = [
    "ItimLottery2Digits",
    "ItimLottery3Digits",
    "ItimLottery4Digits",
    "ItimLottery12NumbersRoom10",
    "ItimLottery12NumbersRoom20",
    "ItimLottery12NumbersRoom50",
    "ItimLottery12NumbersRoom100",
    "ItimLottery12NumbersRoom500",
    "ItimLotteryOddEven",
  ];
  for (const name of contractNames) {
    const seed = BigInt(`0x${randomBytes(32).toString("hex")}`);
    console.log("Seed:", seed);

    if (justDeployed && isSepoliaChain) {
      await waitSepolia();
    }

    const lotteryAdmins = [worker].concat(minters);
    const { address: lotteryAddress, newlyDeployed: lotteryDeployed } = await deploy(name, {
      from: deployer,
      args: [deployer, lotteryAdmins, tokenAddress, seed],
      log: true,
      autoMine: true,
    });
    justDeployed = lotteryDeployed;

    // Get the deployed contract to interact with it after deploying.
    const itimLotteryContract = await hre.ethers.getContract<Contract>(name, deployer);
    console.log("Owner:", await itimLotteryContract.owner());
    console.log("Admins:", lotteryAdmins);
    console.log("TokenAddress:", await itimLotteryContract.tokenContractAccount());

    if (!(await itimTokenContract.hasRole(MINTER_ROLE, lotteryAddress))) {
      if (justDeployed && isSepoliaChain) {
        await waitSepolia();
      }

      console.log("setMinterRole:", lotteryAddress);
      await itimTokenContract.setMinterRole(lotteryAddress, true);
      justDeployed = true;
    }
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ItimLottery
deployYourContract.tags = ["ItimLottery"];
