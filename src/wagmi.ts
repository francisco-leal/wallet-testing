import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const projectId = import.meta.env.VITE_WC_PROJECT_ID;

console.log(projectId);
if (!projectId) {
  throw new Error("VITE_WC_PROJECT_ID is not set");
}

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
