import React from "react";
import ReactModal from "react-modal";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";
import LendingField from "../dex/dexField";
const Container = styled.div`
  background-color: #040404;
  padding: 2rem;
  height: 100vh;
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    font-weight: 300;
    font-size: 26px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    color: var(--off-white-color);
  }
  .tabs {
    margin: 16px;
  }

  .tablist {
    list-style: none;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--primary-color);
    padding: 0;
    color: #efefef;
    font-weight: 400;
    .tab {
      flex: 1;
      cursor: pointer;
      padding: 0.5rem;
      text-align: center;
      transition: all 0.2s ease-in-out;
      &:hover:not(.selected) {
        background: #a7efd218;
      }
      &:focus {
        outline: none;
        /* border: 1px solid var(--primary-color); */
      }
    }
  }

  .selected {
    background: rgba(6, 252, 153, 0.15);
    border-radius: 1px;
    color: var(--primary-color);
  }
`;

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  /* margin: 3rem auto; */
  display: flex;
  align-self: center;

  &:hover {
    background-color: var(--primary-color-dark);
    color : black;
    cursor: pointer;
  }
`;

const APY = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #222;
  padding: 2rem 0;
  color: #666;
  width: 100%;
  p{
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  span {
    color: #efefef;
  }
`;

interface Props {
  onClose: () => void;
}

const DexModal = (props : Props) => {
  return (
    <Container>
      <h2>add liquidity</h2>
      <div
        style={{
          display: "flex",
          marginTop: "2rem",
        }}
      >
        {/* <DexField placeholder="0.00" type="ETH" balance={0.2248} hasToken />
        <DexField placeholder="0.00" balance={15.5} hasToken/> */}
      </div>
      <APY
        style={{
          marginTop: "3rem",
        }}
      >
        <p>
          rate : <span>1 pax = 0.0005 eth</span>
        </p>
      </APY>

      <APY
        
      >
        <p>
          share of pool: <span>100%</span>
        </p>
      </APY>
      <APY
        style={{
          marginTop: "0rem",
        }}
      >
        <Button onClick={()=>{
          props.onClose();
        }} style={{
          margin: "0rem auto",
        }}>approve pax</Button>
      </APY>
    </Container>
  );
};

export default DexModal;
