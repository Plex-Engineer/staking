import "App.css";
import styled from "styled-components";
import {
  GlobalStyle,
  NavBar,
  Overlay,
  ScanLine,
  ScanlinesOverlay,
  StaticNoiseOverlay,
  useAlert,
} from "cantoui";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import bgNoise from "assets/bg-noise.gif";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Staking from "pages/Staking";
import { GenPubKey } from "pages/genPubKey";

import { useNetworkInfo } from "stores/networkinfo";
import {
  getAccountBalance,
  getChainIdandAccount,
  connect,
} from "stores/utils/addCantoToWallet";
import logo from "./assets/logo.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 120vh;
  background-color: #111;
  text-shadow: 0 0 4px #2cffab, 0 0 20px var(--primary-color);
`;

function App() {
  const alert = useAlert();
  const netWorkInfo = useNetworkInfo();

  useEffect(() => {
    if (!netWorkInfo.hasPubKey) {
      alert.show("Failure", <GenPubKey />);
    } else {
      alert.close();
    }
  }, [netWorkInfo.hasPubKey]);

  async function setChainInfo() {
    const [chainId, account] = await getChainIdandAccount();
    netWorkInfo.setChainId(chainId);
    netWorkInfo.setAccount(account);
  }
  useEffect(() => {
    setChainInfo();
  }, []);

  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

    //@ts-ignore
    window.ethereum.on("networkChanged", () => {
      window.location.reload();
    });
  }

  async function getBalance() {
    if (netWorkInfo.account != undefined) {
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account));
    }
  }

  useEffect(() => {
    getBalance();
  }, [netWorkInfo.account]);

  return (
    <Router>
      <Container className="App">
        <GlobalStyle />
        <StaticNoiseOverlay />
        <ScanlinesOverlay />
        <ScanLine />
        <Overlay />
        <NavBar
          logo={logo}
          chainId={Number(netWorkInfo.chainId)}
          account={netWorkInfo.account || ""}
          title={"staking"}
          currency={"CANTO"}
          balance={netWorkInfo.balance}
          isConnected={netWorkInfo.isConnected && netWorkInfo.account != null}
          onClick={() => connect()}
          currentPage={"staking"}
        />
        <Staking />
      </Container>
    </Router>
  );
}
export default App;
