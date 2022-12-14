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
  addNetwork,
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
    } else if (!netWorkInfo.isConnected) {
      alert.show("Failure", <p>this network is not supported on staking, please <a onClick={addNetwork} style={{cursor: "pointer", textDecoration: "underline"}}>switch networks</a></p>)
    } else if (Number(netWorkInfo.balance) < 3.5 && Number(netWorkInfo.balance) > 0) {
      alert.show(
        "Warning",
        <p>you may not have enough CANTO to claim rewards, we recommend at least 3.5 CANTO to avoid transaction failure</p>
      );
    } else {
      alert.close();
    }
  }, [netWorkInfo.hasPubKey, netWorkInfo.balance, netWorkInfo.isConnected]);

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

  const pageList = [
    {
      name: "bridge",
      link: "https://bridge.v1.canto.io",
    },
    {
      name: "convert coin",
      link: "https://convert.v1.canto.io",
    },
    {
      name: "staking",
      link: "https://staking.v1.canto.io",
    },
    {
      name: "lp interface",
      link: "https://lp.v1.canto.io",
    },
    {
      name: "lending",
      link: "https://lending.v1.canto.io",
    },
    {
      name: "governance",
      link: "https://governance.v1.canto.io",
    },
  ];

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
          currency={"CANTO"}
          balance={netWorkInfo.balance}
          isConnected={netWorkInfo.account != null}
          onClick={() => connect()}
          currentPage={"staking"}
          pageList={pageList}
        />
        <Staking />
      </Container>
    </Router>
  );
}
export default App;
