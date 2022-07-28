import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import DexTable from "../components/dex/dex-table";
import DexRow from "../components/dex/dex-row";
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from "react";
import DexModal from "../components/modals/dexModal";
import { ModalType , ModalManager } from "../components/modalManager";
import { Mixpanel } from './../mixpanel'
const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;

  h1 {
    font-size: 12rem;
    color: var(--primary-color);
    text-align: center;
    font-weight: 300;
    letter-spacing: -0.13em;
    position: relative;
    height: 26rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0px 14px 14px rgba(6, 252, 153, 0.2);

  }

  & > button {
    background-color: var(--primary-color);
    border: none;
    border-radius: 0px;
    padding: .6rem 2.4rem;
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: -0.03em;
    width: fit-content;
    margin: 0 auto;
    margin-bottom: 3rem;


    &:hover {
      background-color: var(--primary-color-dark);
    }
  }
  
  @media (max-width: 1000px){
   h1 {
    font-size: 20vw;
   }
  }
 
`;



const Dex = () => {
const [isOpen, setIsOpen] = useState(false);
Mixpanel.events.pageOpened("Dex Market", '');

function openModal(){
  setIsOpen(true);
}
  return (
    <Container>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dex Dashbaord</title>
      </Helmet>
      <div>

<ModalManager isOpen={isOpen} modalType={ModalType.DEX} onClose={()=>{
  setIsOpen(false)
}}/>
  </div> 
      <h1>&gt;_dex LP_</h1>
      <button onClick={openModal}>add liquidity</button>
     
  <DexTable>
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="ETH/BTC" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="DAI/DOGE" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        <DexRow assetName="NOTE/CANTO" totalValueLocked="$34.56M" apr="23.2" position="4567 LP Tokens"  share="67.3" />
        
        </DexTable> 
    </Container>
  );
};
export default Dex;
