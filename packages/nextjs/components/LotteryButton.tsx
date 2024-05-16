type LotteryButtonProp = {
  label?: string;
  warning?: boolean;
  isError?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const LotteryButton = ({ label, warning, isError, loading, disabled, onClick }: LotteryButtonProp) => {
  const btnClasses = isError ? (warning ? "btn-warning" : "btn-error") : "btn-primary";

  function onBuyClick() {
    if (loading || disabled || !onClick) {
      return;
    }
    onClick();
  }

  return (
    <button
      className={`w-full transition duration-100 btn rounded ${btnClasses} ${
        disabled ? "no-animation cursor-default" : ""
      }`}
      disabled={loading}
      onClick={onBuyClick}
    >
      {loading && <span className="loading loading-spinner loading-xs"></span>}
      {label || "Write"}
    </button>
  );
};
