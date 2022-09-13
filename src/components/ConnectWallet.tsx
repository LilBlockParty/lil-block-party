import { useDisconnect, useConnect, useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import EthIcon from "./EthIcon";



const ConnectWalletBtn = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  return (
    <>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#00AB60] hover:[#022270]"
          onClick={() => {
            if (address?.length === 42) return disconnect();
            return connect({ connector });
          }}
        >
          {address?.length === 42 ? (
            <>
              <EthIcon />
              {address.slice(0, 8)}
            </>
          ) : (
            `Connect via ${connector.name}`
          )}
          {isLoading && pendingConnector?.id === connector.id && "(connecting)"}
        </button>
      ))}
    </>
  );
};

export default ConnectWalletBtn;
