import styled from "styled-components";
import { useState } from "react";
import LendingSwitch from "../lendingSwitch";
import { noteSymbol } from "utils";



interface SupplyProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  wallet: number;
  symbol ?: string;
  collateral?: boolean;
  onClick?: () => void;
  onToggle: (state : boolean) => void;

}

interface BorrowProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  wallet: number;
  symbol ?: string;
  liquidity: number;
  onClick: () => void;
  onToggle: (state : boolean) => void;

}
interface BorrowingProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  wallet: number;
  symbol ?: string;
  balance: string;
  liquidity: number;
  onClick: () => void;
  onToggle: (state : boolean) => void;

}
interface SupplyingProps {
  assetName: string;
  assetIcon: string;
  apy: number;
  wallet: number;
  symbol ?: string;
  collateral?: boolean;
  balance: string;
  onToggle: (state : boolean) => void;
  onClick?: () => void;
}

interface ITransactionProps {
  name: string;
  icon: string;
  status: string;
  onClick ?: () => void;
  date : Date;
}

const SupplyRow = (props: SupplyProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td>{props.apy} %</td>
      <td>{props.wallet} {props.symbol}</td>
      <td>
        <LendingSwitch
          checked={props.collateral??false}
          onChange={() => {
            props.onToggle(!props.collateral);
          }}
        />
      </td>
    </tr>
  );
};



function formatLiquidity(liquidity: number) {
  if (liquidity < 2) {
    return liquidity.toFixed(4);
  }
  if (liquidity < 10000) {
    return liquidity.toFixed(2);
  }
  if (liquidity < 1000000) {
    return (liquidity / 1000).toFixed(1) + "k";
  }
  if(liquidity < 100000000)
  return (liquidity / 1000000).toFixed(1) + "M";

  //TODO : temp fix
  const fm = (liquidity / 1000000).toPrecision(3);
  return fm.substring(0,fm.length-4)
}

const BorrowingRow = (props: BorrowProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td>{props.apy} %</td>
      <td>{props.wallet} {props.symbol}</td>
      <td>{noteSymbol}{formatLiquidity(props.liquidity)}</td>
    </tr>
  );
};

interface Iitems {
  top: string;
  bottom: string;
}
const DualRow = ({ top, bottom }: Iitems) => {
  return (
    <div style={{
     display: "flex",
      flexDirection: "column",
      lineHeight: "1.5rem"
    }}>
      <p>{top}</p>
      <p  style={{
        opacity: 0.5,
      }}>{bottom}</p>
    </div>
  );
};
//TODO: figure out what do to with the props
const BorrowedRow = (props: BorrowingProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td><DualRow top={props.apy + " %"} bottom={"TBD"}></DualRow></td>
      <td><DualRow top={noteSymbol+props.balance} bottom={props.wallet + " " + props.symbol?.toLocaleLowerCase()}></DualRow></td>

      <td>{props.liquidity.toFixed(0) + " %"}</td>
    </tr>
  );
};


const SupplyingRow = (props: SupplyingProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td><DualRow top={props.apy + " %"} bottom={"TBD"}></DualRow></td>
      <td><DualRow top={noteSymbol+props.balance} bottom={props.wallet + " " + props.symbol?.toLocaleLowerCase()}></DualRow></td>

      <td>
        <LendingSwitch
           checked={props.collateral??false}
           onChange={() => {
             props.onToggle(!props.collateral);
           }}
        />
      </td>
    </tr>
  );
};


const TransactionRow = (props: ITransactionProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.icon}/> <span>{props.name}</span>
      </td>
      <td>{props.status}</td>
      <td>{props.date.toDateString()}</td>
    </tr>
  );
};



export { SupplyRow, SupplyingRow, BorrowingRow ,BorrowedRow, TransactionRow};
