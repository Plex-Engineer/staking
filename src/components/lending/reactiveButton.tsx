import { useEffect } from "react";
import { TrasanctionType } from "components/lending/BorrowLimits";
import { TransactionStatus } from "@usedapp/core";
import styled from "styled-components";
import { BigNumber } from "ethers";
import {
  useSupply,
  useBorrow,
  useReedem,
  useRepay,
  useEnableToken,
  useReedemToken,
  useSupplyEth,
  useRepayEth,
  Details,
} from "hooks/useTransaction";
import { toWei } from "utils";
import { Mixpanel } from "./../../mixpanel";
import {
  useTransactionStatusUpdate,
} from "providers/transactionContext";

//ENUM
enum InputState {
  ENABLE,
  NOFUNDS,
  ENTERAMOUNT,
  CONFIRM,
  INVALID,
}

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  margin: 3rem auto;
  margin-bottom: 0;
  display: flex;
  align-self: center;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

export const DisabledButton = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: #939393;
  padding: 0.2rem 2rem;
  border: 1px solid #939393;
  margin: 3rem auto;
  margin-bottom: 0;
  display: flex;
  align-self: center;
`;

interface IButton {
  state: InputState;
  token: any;
  amount: string;
  transactionType: TrasanctionType;
  max: boolean;
  isEth: boolean;
  onTransaction: (transaction: TransactionStatus) => void;
}

const ReactiveButton = ({
  state,
  token,
  amount,
  transactionType,
  onTransaction,
  max,
  isEth,
}: IButton) => {
  // const addTransaction = useTransactionStatusUpdate();
  const details: Details = {
    name: token.data.underlying_symbol,
    address: token.data.address,
    icon: token.data.icon,
    amount: amount,
    type: showText(),
  };
  const { state: supplyState, send: supplySend } = useSupply(details);
  const { sendTransaction: supplySendEth, state: supplyStateEth } =
    useSupplyEth(details);
  const { sendTransaction: repaySendEth, state: repayStateEth } =
    useRepayEth(details);
  const { state: borrowState, send: borrowSend } = useBorrow(details);
  const { state: repayState, send: repaySend } = useRepay(details);
  const { state: redeemState, send: redeemSend } = useReedem(details);

  const { state: enableState, send: enableSend } = useEnableToken(
    {  name: token.data.underlying_symbol,
      address: token.data.underlying_address,
      icon: token.data.icon,
      amount: amount,
      type: showText(),}
  );

  let transaction: TransactionStatus = initTransaction();

  // useEffect(() => {
  //   addTransaction([transaction]);
  // }, []);

  onTransaction(transaction);

  function initTransaction() {
    switch (transactionType) {
      case TrasanctionType.SUPPLY:
        if (isEth) return supplyStateEth;
        else return supplyState;
      case TrasanctionType.BORROW:
        return borrowState;
      case TrasanctionType.REPAY:
        if (isEth) return repayStateEth;
        else return repayState;
      case TrasanctionType.WITHDRAW:
        return redeemState;
      case TrasanctionType.ENABLE:
        return enableState;
    }
  }
  function showText() {
    switch (transactionType) {
      case TrasanctionType.SUPPLY:
        return "Supply";
      case TrasanctionType.BORROW:
        return "Borrow";
      case TrasanctionType.REPAY:
        return "Repay";
      case TrasanctionType.WITHDRAW:
        return "Withdraw";
      case TrasanctionType.ENABLE:
        return "Enable";
    }
  }

  switch (state) {
    case InputState.ENABLE:
      return (
        <Button
          onClick={() => {
            enableSend(
              token.data.address,
              BigNumber.from(
                "115792089237316195423570985008687907853269984665640564039457584007913129639935"
              )
            );
          }}
        >
          {" "}
          enable{" "}
        </Button>
      );
    case InputState.ENTERAMOUNT:
      return <DisabledButton> enter amount </DisabledButton>;
    case InputState.CONFIRM:
      if (
        (transactionType == TrasanctionType.BORROW ||
          transactionType == TrasanctionType.WITHDRAW) &&
        token.liquidity < amount
      ) {
        return <DisabledButton>not enough liquidity</DisabledButton>;
      }
      return (
        <Button
          onClick={() => {
            switch (transactionType) {
              case TrasanctionType.SUPPLY:
                if (isEth) {
                  supplySendEth({
                    to: token.data.address,
                    value: toWei(amount, 18),
                  });
                } else {
                  supplySend(toWei(amount, token.data.underlying_decimals));
                }
                Mixpanel.events.lendingMarketActions.supply(
                  token.wallet,
                  token.data.symbol,
                  toWei(amount, 18),
                  token.price
                );

                break;
              case TrasanctionType.BORROW:
                borrowSend(toWei(amount, token.data.underlying_decimals));
                Mixpanel.events.lendingMarketActions.borrow(
                  token.wallet,
                  token.data.symbol,
                  toWei(amount, 18),
                  token.price
                );
                break;
              case TrasanctionType.REPAY:
                if (isEth) {
                  repaySendEth({
                    to: token.data.address,
                    data: "0x4e4d9fea",
                    value: max ? toWei(amount, 18) : toWei(amount, 18),
                  });
                } else {
                  repaySend(
                    max && token.balanceOf > token.borrowBalance + 0.001
                      ? "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                      : toWei(amount, token.data.underlying_decimals)
                  );
                }
                Mixpanel.events.lendingMarketActions.repay(
                  token.wallet,
                  token.data.symbol,
                  toWei(amount, 18),
                  token.price
                );
                break;
              case TrasanctionType.WITHDRAW:
                redeemSend(toWei(amount, token.data.underlying_decimals));
                Mixpanel.events.lendingMarketActions.withdraw(
                  token.wallet,
                  token.data.symbol,
                  toWei(amount, 18),
                  token.price
                );
            }
          }}
        >
          {" "}
          <div>
            {/* {transaction?.status} */}
            {showText()}
          </div>{" "}
        </Button>
      );
    case InputState.NOFUNDS:
      return <DisabledButton> no funds </DisabledButton>;
    case InputState.INVALID:
      return <DisabledButton> enter valid value</DisabledButton>;
    default:
      return <Button> enable </Button>;
  }
};

export { ReactiveButton, InputState };
