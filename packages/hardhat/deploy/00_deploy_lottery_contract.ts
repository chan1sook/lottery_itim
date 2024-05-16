import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { randomBytes } from "crypto";

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
  // const isJBCChain = chainId === "8899";
  const isHardhatChain = chainId === "31337";

  const { deployer, developer, aon, treasuryAccount } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const itimTokenContract = "ItimLotteryTestToken";
  const minters = [developer, aon];

  const { address: tokenAddress, newlyDeployed } = await deploy(itimTokenContract, {
    from: deployer,
    args: [deployer, minters],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const itemTokenContract = await hre.ethers.getContract<Contract>(itimTokenContract, deployer);
  console.log("address:", await itemTokenContract.getAddress());
  console.log("Minters:", minters);
  if (newlyDeployed) {
    await itemTokenContract.mintTo(treasuryAccount, BigInt(1000 * 10 ** 18));
  }
  console.log("TreasuryAccount balance:", await itemTokenContract.balanceOf(treasuryAccount));

  const contractNames = ["ItimLottery2Digits", "ItimLottery3Digits", "ItimLottery4Digits"];
  const lotteryAdmins = minters;
  for (const name of contractNames) {
    const seed = BigInt(`0x${randomBytes(32).toString("hex")}`);
    console.log("Seed:", seed);

    await deploy(name, {
      from: deployer,
      args: [deployer, lotteryAdmins, tokenAddress, treasuryAccount, seed],
      log: true,
      autoMine: true,
    });

    // Get the deployed contract to interact with it after deploying.
    const itimLotteryContract = await hre.ethers.getContract<Contract>(name, deployer);
    console.log("Owner:", await itimLotteryContract.owner());
    console.log("Admins:", lotteryAdmins);
    console.log("TokenAddress:", await itimLotteryContract.tokenContractAccount());
    console.log("TreasuryAccount:", await itimLotteryContract.treasuryAccount());

    if (isHardhatChain) {
      const itemTokenContract2 = await hre.ethers.getContract<Contract>(itimTokenContract, treasuryAccount);
      await itemTokenContract2.approve(
        itimLotteryContract.getAddress(),
        BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"),
      );
      console.log(
        "Contract Allowance:",
        await itemTokenContract2.allowance(treasuryAccount, itimLotteryContract.getAddress()),
      );
    }
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ItimLottery
deployYourContract.tags = ["ItimLottery"];
