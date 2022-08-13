import { addNetwork } from "./utils/addCantoToWallet";
import { CantoMain, CantoTest } from "./utils/networks";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { checkPubKey, getCantoAddressFromMetaMask } from "utils/transactions";

interface NetworkProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  chainId: string | undefined;
  setChainId: (chainId: string | undefined) => void;
  account: string | undefined;
  setAccount: (account: string | undefined) => void;
  hasPubKey: boolean;
  balance: string;
  setBalance: (balance: string) => void;
}

export const useNetworkInfo = create<NetworkProps>()(
  devtools((set) => ({
    isConnected: true,
    setIsConnected: (connected) => set({ isConnected: connected }),
    chainId: undefined,
    setChainId: (chainId) => {
      set({ chainId: chainId });
      if (
        Number(chainId) == CantoTest.chainId ||
        Number(chainId) == CantoMain.chainId
      ) {
        set({ isConnected: true });
      } else {
        set({ isConnected: false });
        addNetwork();
      }
    },
    account: undefined,
    setAccount: async (account) => {
      let cantoAddress = await getCantoAddressFromMetaMask(account);
      let hasPubKey = await checkPubKey(cantoAddress);
      set({ account: account })
      set({hasPubKey : hasPubKey});
    },
    hasPubKey: true,
    balance: "0",
    setBalance: (balance) => set({ balance: balance }),
  }))
);