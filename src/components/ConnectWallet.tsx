import { useDisconnect, useConnect, useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import EthIcon from "./EthIcon";

const ConnectWalletBtn = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  if (isConnected) {
    return (
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#00AB60] hover:[#022270]"
        onClick={() => disconnect()}
      >
        <>
          <EthIcon />
          {address?.slice(0, 8)}
        </>
      </button>
    );
  }

  return (
    <>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#00AB60] hover:[#022270]"
          onClick={() => connect({ connector })}
        >
          Connect via {connector.name}
          {isLoading && pendingConnector?.id === connector.id && "(connecting)"}
        </button>
      ))}
    </>
  );
};

export default ConnectWalletBtn;
