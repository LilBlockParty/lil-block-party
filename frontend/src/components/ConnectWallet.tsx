import { useDisconnect, useConnect, useAccount } from "wagmi";
import EthIcon from "../images/eth.png";
import { useEnsName } from "wagmi";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useRef } from "react";

const ConnectWalletBtn = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const {
    data: ensName,
    isError,
    isLoading: isEnsLoading,
  } = useEnsName({
    address,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  if (isConnected) {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={classNames(
                open ? "text-gray-900" : "text-gray-600",
                "group inline-flex items-center rounded-md bg-white text-lg font-medium hover:text-gray-900 py-1 px-4"
              )}
            >
              {ensName && ensName?.length > 0 ? (
                ensName
              ) : (
                <span>
                  Ξ {address?.slice(0, 4)}...{address?.slice(-5, -1)}
                </span>
              )}
              <ChevronDownIcon
                className={classNames(
                  open ? "text-gray-600" : "text-gray-400",
                  "ml-2 h-5 w-5 group-hover:text-gray-500"
                )}
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-50"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel
                className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0"
                ref={panelRef}
              >
                {({ close }) => (
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent font-balsamiq rounded-md shadow-sm text-white bg-[#00AB60] hover:[#022270]"
                        onClick={() => {
                          close();
                          disconnect();
                        }}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  }

  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={classNames(
                open && isConnected ? "text-gray-900" : "text-gray-600",
                "group inline-flex items-center rounded-md bg-white text-lg font-medium hover:text-gray-900 py-1 px-4"
              )}
            >
              <span>Connect</span>
              <ChevronDownIcon
                className={classNames(
                  open && isConnected ? "text-gray-600" : "text-gray-400",
                  "ml-2 h-5 w-5 group-hover:text-gray-500"
                )}
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-5"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0">
                {({ close }) => (
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                      {connectors.map((connector) => (
                        <button
                          disabled={!connector.ready}
                          key={connector.id}
                          className="inline-flex items-center px-4 py-2 border border-transparent font-balsamiq rounded-md shadow-sm text-white bg-[#00AB60] hover:[#022270]"
                          onClick={() => {
                            close();
                            connect({ connector });
                          }}
                        >
                          Connect via {connector.name}
                          {isLoading && pendingConnector?.id === connector.id && "(connecting)"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default ConnectWalletBtn;
