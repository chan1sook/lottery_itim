import { formatEther } from "viem";
import { useNativeTokenSymbol, useTokenSymbol, useTokenTotalSupply } from "~~/hooks/useTokenData";
import { useTokenExchangeBalance, useTokenExchangeConfig } from "~~/hooks/useTokenExchange";

export const ExchangeToTokenInfoContainer = () => {
  const tokenSymbol = useTokenSymbol();
  const etherSymbol = useNativeTokenSymbol();

  const exchangeData = useTokenExchangeConfig();
  const exchangeRate = exchangeData.rate;
  const feeTokenTo = exchangeData.feeExchangeTo;

  const exchangeToWithFee =
    typeof exchangeRate === "bigint" && typeof feeTokenTo == "bigint"
      ? exchangeRate - (exchangeRate * feeTokenTo) / BigInt(10) ** BigInt(18)
      : undefined;

  const tokenTotalSupply = useTokenTotalSupply();

  return (
    <>
      <table className="table table-zebra table-sm">
        <tbody>
          <tr>
            <th>Total Supply</th>
            <td className="text-right">
              {typeof tokenTotalSupply === "bigint" ? (
                <>
                  {formatEther(tokenTotalSupply)} {tokenSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table table-zebra table-sm">
        <thead>
          <tr>
            <th></th>
            <th className="text-right">Rate</th>
            <th className="text-right w-20">Per</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover">
            <th>Base Rate</th>
            <td className="text-right">
              {typeof exchangeRate === "bigint" ? (
                <>
                  {formatEther(exchangeRate)} {tokenSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
            <td className="text-right">/1 {etherSymbol}</td>
          </tr>
          <tr className="hover">
            <th>Fee</th>
            <td className="text-right">
              {typeof feeTokenTo === "bigint" ? (
                <>
                  {formatEther(feeTokenTo)} {tokenSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
            <td className="text-right">/1 {tokenSymbol}</td>
          </tr>
          <tr className="hover">
            <th>Actual Rate</th>
            <td className="text-right">
              {typeof exchangeToWithFee === "bigint" ? (
                <>
                  {formatEther(exchangeToWithFee)} {tokenSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
            <td className="text-right">/1 {etherSymbol}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export const ExchangeBackInfoContainer = () => {
  const tokenSymbol = useTokenSymbol();
  const etherSymbol = useNativeTokenSymbol();

  const exchangeData = useTokenExchangeConfig();
  const exchangeRate = exchangeData.rate;
  const exchangeBackRate = typeof exchangeRate === "bigint" ? BigInt(10) ** BigInt(36) / exchangeRate : undefined;

  const feeTokenBack = exchangeData.feeExchangeBack;

  const exchangeBackWithFee =
    typeof exchangeBackRate === "bigint" && typeof feeTokenBack == "bigint"
      ? exchangeBackRate - (exchangeBackRate * feeTokenBack) / BigInt(10) ** BigInt(18)
      : undefined;

  const contractBalance = useTokenExchangeBalance();

  return (
    <>
      <table className="table table-zebra table-sm">
        <tbody>
          <tr>
            <th>Contract Balance</th>
            <td className="text-right">
              {typeof contractBalance === "bigint" ? (
                <>
                  {formatEther(contractBalance)} {etherSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table table-zebra table-sm">
        <thead>
          <tr>
            <th></th>
            <th className="text-right">Rate</th>
            <th className="text-right w-20">Per</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover">
            <th>Base Rate</th>
            <td className="text-right">
              {typeof exchangeBackRate === "bigint" ? (
                <>
                  {formatEther(exchangeBackRate)} {etherSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
            <td className="text-right">/1 {tokenSymbol}</td>
          </tr>
          <tr className="hover">
            <th>Fee</th>
            <td className="text-right">
              {typeof feeTokenBack === "bigint" ? (
                <>
                  {formatEther(feeTokenBack)} {tokenSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
            <td className="text-right">/1 {tokenSymbol}</td>
          </tr>
          <tr className="hover">
            <th>Actual Rate</th>
            <td className="text-right">
              {typeof exchangeBackWithFee === "bigint" ? (
                <>
                  {formatEther(exchangeBackWithFee)} {etherSymbol}
                </>
              ) : (
                <span className="skeleton w-16"></span>
              )}
            </td>
            <td className="text-right">/1 {tokenSymbol}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
