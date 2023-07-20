import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import NavBar from "@/components/NavBar";

const { chains, provider } = configureChains([sepolia], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "kromatika.finance - OP Airdrop",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>kromatika.finance - OP Airdrop</title>
      </Head>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Toaster />
          <NavBar />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
