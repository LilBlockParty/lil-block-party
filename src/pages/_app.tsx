import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";

import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { provider, chains } = configureChains(
  [chain.mainnet],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY })]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
  ],
  provider,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default MyApp;
