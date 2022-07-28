import { HelmetProvider } from "react-helmet-async";
import { DAppProvider, Config, Mainnet } from "@usedapp/core";
import React from "react";
import TokenProvider from "./activeTokenContext";
import OverallStatsProvider from "./overallStats";
import TransactionStatusProvider from "./transactionContext";
import { Chain, Localhost } from "@usedapp/core";

interface IProviderProps {
  children: React.ReactNode;
}

export const getAddressLink = (explorerUrl: string) => (address: string) => `${explorerUrl}/address/${address}`

export const getTransactionLink = (explorerUrl: string) => (txnId: string) => `${explorerUrl}/tx/${txnId}`

export const CantoTest: Chain = {
  chainId: 7722,
  chainName: 'Canto',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0x4307953845Dc771364F2E92F3bECCe22188ea3b2',
  multicall2Address: '0x210b88d5Ad4BEbc8FAC4383cC7F84Cd4F03d18c6',
  blockExplorerUrl: "www.nothing.com",
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
}

export const Gravity: Chain = {
  chainId: 15,
  chainName: 'Gravity',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0x7651bad1171048eBF9be9bF13cF1946DbD1973de',
  multicall2Address: '0x8539Ac34F57D2D5e0BD8dfFf956081aABe8Fba1a',
  blockExplorerUrl: "www.nothing.com",
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
}

// export const Canto: Chain = {
//   chainId: 9624,
//   chainName: 'Canto',
//   isTestChain: true,
//   isLocalChain: false,
//   multicallAddress: '0x7651bad1171048eBF9be9bF13cF1946DbD1973de',
//   multicall2Address: '0xce81Bb6371bAbf306712b40D3782954af518F1ED',
//   blockExplorerUrl: "www.nothing.com",
//   getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
//   getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
// }



const config: Config = {
  networks : [CantoTest, Gravity,Mainnet],
  readOnlyUrls: {
    [CantoTest.chainId]: "http://164.90.134.106:8545",
    [Gravity.chainId] : "http://testnet.gravitychain.io:8545",
    [Mainnet.chainId] : "https://mainnet.infura.io/v3/e5a334de8167419aaa717a990033db27",
  },
  noMetamaskDeactivate : true,
};

//All the providers are wrapped in this provider function
const Provider = ({ children }: IProviderProps) => {
  return (
    // <DAppProvider config={config}>
      <HelmetProvider>
        <TokenProvider>
          <OverallStatsProvider>
            <TransactionStatusProvider>{children}</TransactionStatusProvider>
          </OverallStatsProvider>
        </TokenProvider>
      </HelmetProvider>
    // </DAppProvider>
  );
};

export default Provider;
