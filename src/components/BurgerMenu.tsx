import { slide as Menu } from "react-burger-menu";

const BurgerStyles = {
  paddingTop: "-1000px",
  bmBurgerButton: {
    position: "sticky",
    width: "36px",
    height: "30px",
    left: "36px",
    top: "36px",
  },
  bmBurgerBars: {
    background: "var(--primary-color)",
  },
  bmBurgerBarsHover: {
    background: "var(--primary-color)",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "var(--primary-color)",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100vh",
    marginLeft: "-47px",
  },
  bmMenu: {
    background: "#000000",
    padding: "2.5em 1.5em 0",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "var(--primary-color)",
    padding: "0.8em",
  },
  bmItem: {
    display: "block",
    color: "var(--primary-color)",
    paddingTop: "40px",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
    width: "0px",
    height: "0px",
  },
};

export const BurgerMenu = () => {
  return (
    <Menu styles={BurgerStyles}>
      <h2>terminal</h2>
      <a id="bridge" className="menu-item" href="https://bridge.canto.io">bridge</a>
      <a id="convertCoin" className="menu-item" href="https://convert.canto.io">convert coin</a>
      <a id="generator" className="menu-item" href="https://generator.canto.io">generator</a>
      <a id="governance" className="menu-item" href="https://governance.canto.io">governance</a>
      <a id="lending" className="menu-item" href="https://lending.canto.io">lending</a>
      <a id="lpInterface" className="menu-item" href="https://lp.canto.io">lp interface</a>
      <a id="staking" className="menu-item" href="https://staking.canto.io">staking</a>
    </Menu>
  );
};