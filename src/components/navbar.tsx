import styled from "styled-components";
import logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import menu from "../assets/menu.svg";
import { formatBigNumber } from "utils";
import {
  connect,
  getAccountBalance,
  getChainIdandAccount,
} from "../stores/utils/addCantoToWallet";

import { useNetworkInfo } from "../stores/networkinfo";


interface propsStyle {
  didScroll: boolean;
}
const Container = styled.div<propsStyle>`
  display: flex;
  position: sticky;
  top: 0%;
  transition: all 0.1s ease-in-out;
  & > * {
    flex: 1;
  }
  border-bottom: ${(props) =>
    props.didScroll ? "1px solid var(--primary-color)" : "none"};
  background-color: ${(props) => (props.didScroll ? "#09221454" : "none")};
  backdrop-filter: ${(props) => (props.didScroll ? "blur(5px)" : "none")};
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  h1 {
    /* text-shadow: none; */
    color: var(--primary-color);
    font-weight: 400;
    text-align: center;
    flex-grow: 2;
  }
  #logo {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 24px;
    display: flex;
    align-items: center;
    margin: 0 2rem;
    text-align: center;
  }
  ul {
    display: flex;
    list-style: none;
    flex: 1;
    font-weight: bold;
    justify-content: center;
    align-items: center;
  }
  #nav-menu {
    display: none;
  }
  a {
    display: block;
    padding: 0 0 1rem 0;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    text-transform: lowercase;
    font-size: 16px;
    font-weight: 400;
    padding: 0 1rem;
    &:not(.active) > span:hover {
      background-color: #06fc9a29;
      transition: all 0.2s ease-in-out;
    }

    & > span {
      color: var(--primary-color);
      padding: 8px 8px;
    }
  }

  .active {
    & > span {
      background-color: #06fc9a2b;
    }
  }

  .off {
    color: grey !important;
    text-shadow: 0 0 4px grey, 0 0 20px grey;
  }
  label {
    display: flex;
    align-items: center;
  }
  button {
    background-color: black;
    font-size: 17px;
    border: 1px solid var(--primary-color);
    margin: 1.4rem;
    font-family: "IBM Plex Mono";
    font-weight: 400;
    padding: 0.3rem 0.6rem;
    /* margin-right: 2rem; */
    color: var(--primary-color);
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.05);
      cursor: pointer;
      background-color: var(--primary-color);
      color: black;
    }
  }

  #menu-checkbox {
    display: none;
  }

  //media queries for tablet
  @media (max-width: 1248px) {
    a {
      padding: 5px 5px;
    }
  }

  @media (max-width: 1000px) {
    ul.active {
      /* left: 0%; */
      top: 100px;
    }
    ul {
      position: absolute;
      flex-direction: column;
      top: 100vh;

      /* left: -100%; */
      border-top: 1px solid var(--primary-color);
      transition: all 0.2s ease-in-out;
      height: calc(100vh - 100px);
      width: 100vw;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 3rem 1rem 6rem 1rem;
      background-color: black;
      background: repeating-linear-gradient(
        0deg,
        #010000 0%,
        #010000 4px,
        #021911 4px,
        #021911 8px
      );

      gap: 0.4rem;

      a {
        font-size: 2.4rem;
        font-weight: 300;
        text-shadow: 0px 5.27163px 5.27163px rgba(6, 252, 153, 0.2),
          0px 3.24191px 3.24191px rgba(6, 252, 153, 0.2);
        letter-spacing: -0.1em;
      }
    }

    /* ul {
    display: flex;
    justify-content: center;
    align-items: center;
  } */
    justify-content: space-between;
    #logo {
      /* flex-grow: 1; */
      margin: 1rem;
      font-size: 18px;
    }
    #nav-menu {
      display: block;
      margin-right: 1rem;
    }

    button {
      /* display: none; */
      background-color: var(--primary-color);
      color: black;
      font-size: 1rem;
      /* width: 160px; */
    }
  }
`;

const Glitch = styled.p`
  & {
    color: var(--primary-color);
    font-family: "IBM Plex Mono";
    font-size: 26px;
    font-weight: 300;
    margin: 0 1rem;

    position: relative;
    text-shadow: 0.05em 0 0 #00ffd5, -0.03em -0.04em 0 #1d7407,
      0.025em 0.04em 0 #8bff9f;
    animation: glitch 725ms infinite;
  }

  & span {
    position: absolute;
    top: 0;
    left: 0;
  }

  & span:first-child {
    animation: glitch 500ms infinite;
    clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
    transform: translate(-0.04em, -0.03em);
    opacity: 0.75;
  }

  & span:last-child {
    animation: glitch 375ms infinite;
    clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
    transform: translate(0.04em, 0.03em);
    opacity: 0.75;
  }

  @keyframes glitch {
    0% {
      text-shadow: 0.05em 0 0 #00ffd5, -0.03em -0.04em 0 #1d7407,
        0.025em 0.04em 0 #8bff9f;
    }
    15% {
      text-shadow: 0.05em 0 0 #00ffd5, -0.03em -0.04em 0 #1d7407,
        0.025em 0.04em 0 #8bff9f;
    }
    16% {
      text-shadow: -0.05em -0.025em 0 #00ffd5, 0.025em 0.035em 0 #1d7407,
        -0.05em -0.05em 0 #8bff9f;
    }
    49% {
      text-shadow: -0.05em -0.025em 0 #00ffd5, 0.025em 0.035em 0 #1d7407,
        -0.05em -0.05em 0 #8bff9f;
    }
    50% {
      text-shadow: 0.05em 0.035em 0 #00ffd5, 0.03em 0 0 #1d7407,
        0 -0.04em 0 #8bff9f;
    }
    99% {
      text-shadow: 0.05em 0.035em 0 #00ffd5, 0.03em 0 0 #1d7407,
        0 -0.04em 0 #8bff9f;
    }
    100% {
      text-shadow: -0.05em 0 0 #00ffd5, -0.025em -0.04em 0 #1d7407,
        -0.04em -0.025em 0 #8bff9f;
    }
  }
`;

const NavBar = () => {
  const netWorkInfo = useNetworkInfo();

  useEffect(() => {
    const [chainId, account] = getChainIdandAccount();
    netWorkInfo.setChainId(chainId);
    netWorkInfo.setAccount(account);
  },[])
  
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
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account))
    }
  }

  useEffect(() => {
    getBalance();
  },[netWorkInfo.account])



  const [colorChange, setColorchange] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 2) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  window.addEventListener("scroll", changeNavbarColor);


  return (
    <Container didScroll={colorChange}>
      <div id="logo">
        <a
          href="https://canto.io"
          style={{
            display: "flex",
          }}
        >
          <img src={logo} alt="Canto" />

          <Glitch>
            <span aria-hidden="true">Canto</span>
            Canto
            <span aria-hidden="true">Canto</span>
          </Glitch>
        </a>
      </div>
      <h1>staking</h1>
      <input
        type="checkbox"
        name="nav-menu"
        id="menu-checkbox"
        checked={isNavOpen}
        onChange={() => {
          setIsNavOpen(!isNavOpen);
        }}
      />
      {netWorkInfo.account != undefined ? (
        <button
          onClick={() => {
            // setIsModalOpen(true)
          }}
        >
          {formatBigNumber(netWorkInfo.balance)}&nbsp;
          <span
            style={{
              fontWeight: "600",
            }}
          >
            CANTO
          </span>{" "}
          | {netWorkInfo.account?.substring(0, 5) + ".."}
        </button>
      ) : (
        <button onClick={() => connect()}>connect wallet</button>
      )}
      <label htmlFor="menu-checkbox" style={{ display: "none" }}>
        <img id="nav-menu" src={menu} />
      </label>
    </Container>
  );
};

export default NavBar;