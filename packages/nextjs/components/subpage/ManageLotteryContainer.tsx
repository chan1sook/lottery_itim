import { ChangeEvent, ReactNode, useState } from "react";
import { ConnectAddressContainer } from "../ConnectAddressContainer";
import { LotteryButton } from "../LotteryButton";
import { LotteryNumberRangeContainer } from "../lottery-containers/LotteryNumberRangeContainer";
import { AddressInput } from "../scaffold-eth";
import { ItimTokenInput } from "../scaffold-eth/Input/ItimTokenInput";
import dayjs from "dayjs";
import { formatEther, isAddress, parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useIsLotteryContractAdmin } from "~~/hooks/useLotteryContractData";
import { LotteryData, LotteryState } from "~~/hooks/useLotteryData";

type LabelFromAdminModifierProp = {
  admin?: string;
  isAdmin: boolean;
  label: string;
};

function labelFromAdminModifier({ admin, isAdmin, label }: LabelFromAdminModifierProp) {
  return !admin ? "Not Connected" : !isAdmin ? "Not Admin" : label;
}

type GameActionButtonProp = {
  isWaitWriting: boolean;
  adminAccount?: string;
  lotteryData: LotteryData;
  onDeclareLotteryGame: (id: bigint) => void;
  onStartLotteryGame: (id: bigint) => void;
  onEndLotteryGame: (id: bigint) => void;
  onRollNumber: (id: bigint) => void;
};

const GameActionButton = ({
  lotteryData,
  adminAccount,
  isWaitWriting,
  onDeclareLotteryGame,
  onStartLotteryGame,
  onEndLotteryGame,
  onRollNumber,
}: GameActionButtonProp) => {
  const contractName = lotteryData.contractData.contractName;
  const isAdmin = useIsLotteryContractAdmin(contractName, adminAccount);

  function _getLabel(label: string) {
    return labelFromAdminModifier({ admin: adminAccount, isAdmin, label });
  }

  return (
    <>
      {lotteryData.state == LotteryState.NOT_STARTED && (
        <LotteryButton
          label={_getLabel("Create game")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onDeclareLotteryGame(lotteryData.id)}
        />
      )}
      {lotteryData.state == LotteryState.DECLARED && (
        <LotteryButton
          label={_getLabel("Start Lottery")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onStartLotteryGame(lotteryData.id)}
        />
      )}
      {lotteryData.state == LotteryState.OPENING && (
        <LotteryButton
          label={_getLabel("Close Lottery")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onEndLotteryGame(lotteryData.id)}
        />
      )}
      {lotteryData.state == LotteryState.EXPIRED && (
        <LotteryButton
          label={_getLabel("Roll Number")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onRollNumber(lotteryData.id)}
        />
      )}
      {lotteryData.state == LotteryState.DRAWED && (
        <LotteryButton
          label={_getLabel("New game")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onDeclareLotteryGame(lotteryData.id + BigInt(1))}
        />
      )}
    </>
  );
};

type GameActionButton2Prop = {
  isWaitWriting: boolean;
  adminAccount?: string;
  lotteryData: LotteryData;
  onFastStartLotteryGame: (id: bigint) => void;
  onFastStopLotteryGame: (id: bigint) => void;
};

const GameActionButton2 = ({
  lotteryData,
  adminAccount,
  isWaitWriting,
  onFastStartLotteryGame,
  onFastStopLotteryGame,
}: GameActionButton2Prop) => {
  const contractName = lotteryData.contractData.contractName;
  const isAdmin = useIsLotteryContractAdmin(contractName, adminAccount);

  function _getLabel(label: string) {
    return labelFromAdminModifier({ admin: adminAccount, isAdmin, label });
  }

  return (
    <>
      {lotteryData.state == LotteryState.NOT_STARTED && (
        <LotteryButton
          label={_getLabel("Start game")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onFastStartLotteryGame(lotteryData.id)}
        />
      )}
      {lotteryData.state == LotteryState.OPENING && (
        <LotteryButton
          label={_getLabel("Close Lottery")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onFastStopLotteryGame(lotteryData.id)}
        />
      )}
      {lotteryData.state == LotteryState.DRAWED && (
        <LotteryButton
          label={_getLabel("New game")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onFastStartLotteryGame(lotteryData.id + BigInt(1))}
        />
      )}
    </>
  );
};

type ManageLotteryContainerProps = {
  children?: ReactNode;
  adminAccount?: string;
  lotteryData: LotteryData;
};

export const ManageLotteryContainer = ({ children, adminAccount, lotteryData }: ManageLotteryContainerProps) => {
  const contractData = lotteryData.contractData;
  const contractName = contractData.contractName;
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);

  const isAdmin = useIsLotteryContractAdmin(contractName, adminAccount);

  const [lotteryCost, setLotteryCost] = useState("1.0");
  const [lotteryReward, setLotteryReward] = useState("10.0");
  const [lotteryReward2nd, setLotteryReward2nd] = useState("2.0");
  const [lotteryReward3rd, setLotteryReward3rd] = useState("1.5");
  const [tokenContractAccount, setTokenContractAccount] = useState("");
  const [treasuryAccount, setTreasuryAccount] = useState("");
  const [datetimeStr, setDatetimeStr] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));

  const [waitContactData, setWaitContractData] = useState(false);

  if (!waitContactData && contractData.ready) {
    setWaitContractData(true);
    setLotteryCost(formatEther(contractData.lotteryCost || BigInt(0)));
    setLotteryReward(formatEther(contractData.lotteryReward || BigInt(0)));
    setTokenContractAccount(contractData.tokenContractAccount || "");
    setTreasuryAccount(contractData.treasuryAccount || "");
  }

  const isSetLotteryCostInvalid = !isAdmin;
  const isSetLotteryRewardInvalid = !isAdmin;
  const isSetAccountCostInvalid = !(isAdmin && isAddress(treasuryAccount) && isAddress(tokenContractAccount));
  const isWaitWriting = !contractData.ready || isPending || isMining;

  function updateDateTimeStr(e: ChangeEvent<HTMLInputElement>) {
    setDatetimeStr(e.target.value as unknown as string);
  }

  async function updateLotteryCost(cost: bigint) {
    await writeContractAsync({
      functionName: "setLotteryCost",
      args: [cost],
    });
  }

  async function updateLotteryReward(reward: bigint) {
    await writeContractAsync({
      functionName: "setLotteryReward",
      args: [reward],
    });
  }

  async function updateLotteryReward2nd(reward: bigint) {
    if (contractName === "ItimLottery3Digits") {
      await writeContractAsync({
        functionName: "setLottery2ndReward",
        args: [reward],
      });
    } else if (contractName === "ItimLottery4Digits") {
      await writeContractAsync({
        functionName: "setLotteryOthersReward",
        args: [reward, BigInt(lotteryReward3rd)],
      });
    }
  }

  async function updateLotteryReward3rd(reward: bigint) {
    if (contractName === "ItimLottery4Digits") {
      await writeContractAsync({
        functionName: "setLotteryOthersReward",
        args: [BigInt(lotteryReward2nd), reward],
      });
    }
  }

  async function updateAccounts(tokenAccount: string, treasuryAccount: string) {
    await writeContractAsync({
      functionName: "setAccounts",
      args: [tokenAccount, treasuryAccount],
    });
  }

  async function declareLotteryGame(gameid: bigint) {
    await writeContractAsync({
      functionName: "declareLottery",
      args: [gameid],
    });
  }

  async function startLotteryGame(gameid: bigint, ts: number) {
    await writeContractAsync({
      functionName: "startBuyingLottery",
      args: [gameid, BigInt(ts)],
    });
  }

  async function endLotteryGame(gameid: bigint) {
    await writeContractAsync({
      functionName: "stopBuyingLottery",
      args: [gameid],
    });
  }

  async function rollNumber(gameid: bigint) {
    await writeContractAsync({
      functionName: "drawRandomNumber",
      args: [gameid],
    });
  }

  async function fastStartLotteryGame(gameid: bigint, ts: number) {
    await writeContractAsync({
      functionName: "fastStartLottery",
      args: [gameid, BigInt(ts)],
    });
  }

  async function fastStopLotteryGame(gameid: bigint) {
    await writeContractAsync({
      functionName: "fastStopLottery",
      args: [gameid],
    });
  }

  function _getLabel(label: string) {
    return labelFromAdminModifier({ admin: adminAccount, isAdmin, label });
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">Manage Lottery</span>
        </h1>
        <ConnectAddressContainer />
      </div>
      <div className="my-8 w-full px-8 py-8 bg-base-300 flex flex-col gap-y-4 items-center justify-center">
        <LotteryNumberRangeContainer contractData={contractData} />
        {children}
        {lotteryData.state == LotteryState.DECLARED && (
          <div className="w-full max-w-screen-sm flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
            <input
              type="datetime-local"
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-700 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-700"
              value={datetimeStr}
              onChange={updateDateTimeStr}
            />
          </div>
        )}
        <div className="w-full max-w-52">
          {false && (
            <GameActionButton
              adminAccount={adminAccount}
              lotteryData={lotteryData}
              isWaitWriting={isWaitWriting}
              onDeclareLotteryGame={declareLotteryGame}
              onStartLotteryGame={id => startLotteryGame(id, Math.floor(dayjs(datetimeStr).valueOf() / 1000))}
              onEndLotteryGame={endLotteryGame}
              onRollNumber={rollNumber}
            />
          )}

          <GameActionButton2
            adminAccount={adminAccount}
            lotteryData={lotteryData}
            isWaitWriting={isWaitWriting}
            onFastStartLotteryGame={id => fastStartLotteryGame(id, Math.floor(dayjs(datetimeStr).valueOf() / 1000))}
            onFastStopLotteryGame={fastStopLotteryGame}
          />
        </div>
      </div>
      <div className="w-full px-6 max-w-screen-md flex flex-col gap-y-2 items-stretch">
        <div>Lottery Cost:</div>
        <div>
          <ItimTokenInput value={lotteryCost} onChange={setLotteryCost}></ItimTokenInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={_getLabel("Set Cost")}
              loading={isWaitWriting}
              isError={isSetLotteryCostInvalid}
              disabled={isSetLotteryCostInvalid}
              onClick={() => updateLotteryCost(parseEther(lotteryCost))}
            />
          </div>
        </div>
        <div> Lottery Reward:</div>
        <div>
          <ItimTokenInput value={lotteryReward} onChange={setLotteryReward}></ItimTokenInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={_getLabel("Set Reward")}
              loading={isWaitWriting}
              isError={isSetLotteryRewardInvalid}
              disabled={isSetLotteryRewardInvalid}
              onClick={() => updateLotteryReward(parseEther(lotteryReward))}
            />
          </div>
        </div>
        {contractData.lotteryReward2nd && (
          <>
            <div> Lottery 2nd Reward:</div>
            <div>
              <ItimTokenInput value={lotteryReward2nd} onChange={setLotteryReward2nd}></ItimTokenInput>
            </div>

            <div className="flex flex-row justify-center">
              <div className="w-full max-w-52">
                <LotteryButton
                  label={_getLabel("Set Reward")}
                  loading={isWaitWriting}
                  isError={isSetLotteryRewardInvalid}
                  disabled={isSetLotteryRewardInvalid}
                  onClick={() => updateLotteryReward2nd(parseEther(lotteryReward2nd))}
                />
              </div>
            </div>
          </>
        )}
        {contractData.lotteryReward3rd && (
          <>
            <div> Lottery 3rd Reward:</div>
            <div>
              <ItimTokenInput value={lotteryReward3rd} onChange={setLotteryReward3rd}></ItimTokenInput>
            </div>

            <div className="flex flex-row justify-center">
              <div className="w-full max-w-52">
                <LotteryButton
                  label={_getLabel("Set Reward")}
                  loading={isWaitWriting}
                  isError={isSetLotteryRewardInvalid}
                  disabled={isSetLotteryRewardInvalid}
                  onClick={() => updateLotteryReward3rd(parseEther(lotteryReward3rd))}
                />
              </div>
            </div>
          </>
        )}
        <div>Treasury Account:</div>
        <div>
          <AddressInput
            value={treasuryAccount}
            placeholder="Treasury Account"
            onChange={setTreasuryAccount}
          ></AddressInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={_getLabel("Set")}
              loading={isWaitWriting}
              isError={isSetAccountCostInvalid}
              disabled={isSetAccountCostInvalid}
              onClick={() => updateAccounts(tokenContractAccount, treasuryAccount)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
