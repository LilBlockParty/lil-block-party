import { useDisconnect, useConnect, useAccount } from "wagmi";
import EthIcon from "./EthIcon";

const ConnectWalletBtn = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  if (isConnected) {
    return (
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent font-balsamiq rounded-full shadow-sm text-white bg-[#00AB60] hover:[#022270]"
        onClick={() => disconnect()}
      >
        <>
          <span>
            <span className="font-bold text-md">Ξ</span> {address?.slice(0, 4)}...
            {address?.slice(-5, -1)}
          </span>
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
          className="inline-flex items-center px-4 py-2 border border-transparent font-balsamiq rounded-full shadow-sm text-white bg-[#00AB60] hover:[#022270]"
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
