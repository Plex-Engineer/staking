import styled from "styled-components";
import {
  DelegationResponse,
  Validator,
  fee,
  chain,
  memo,
  multiple,
  formatNumber,
  unbondingFee,
  TRANSACTION_WAIT_PERIOD,
  nodeAddress,
  calculateTotalStaked,
} from "pages/staking/utils";
import { txStake, txUnstake } from "utils/transactions";
import { useState } from "react";
import { BigNumber, ethers } from "ethers";

const Container = styled.div`
  background-color: #040404;
  height: 40rem;
  width: 33rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  /* padding: 1rem; */
  .title {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    text-transform: lowercase;
    color: var(--primary-color);
    margin-bottom: 2rem;
    /* margin-top: 0.3rem; */
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
  }

  .dual-h-row {
    font-size: 18px;
    width: 28rem;
    display: flex;
    justify-content: space-between;
  }
  .balances {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: end;
    width: 18rem;
  }
  .bal {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }
  .type {
    color: #8b8b8b;
  }
  .value {
    color: var(--primary-color);
  }
  .line {
    border-bottom: 1px solid #222;
  }
  .logo {
    /* padding: 1rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-color);
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-bottom: 1.2rem;
  }

  h2 {
    color: #777;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    text-align: left;
    line-height: 120%;
    margin-bottom: 0.4rem;
  }
  .secondaryBalance {
    font-weight: 300;
    font-size: 16px;
    line-height: 120%;
    color: #cdcdcd;
  }

  .btn-grp {
    display: flex;
  }

  .desc {
    margin: 0 6rem;
    margin-bottom: 2rem;
    max-width: 85%;
  }
  .textField {
    margin: 0.1rem 0;
    padding: 0.4rem 0;
    width: 28rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    border-bottom: 1px solid var(--primary-color);
  }

  input[type="text"] {
    background-color: black;
    width: 100%;
    border: none;
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0 2rem;
    &:focus {
      outline: none;
    }
  }
  footer {
    margin: 0 2rem;
    p {
      font-size: 14px;
    }
  }
`;

const Button = styled.button`
  font-weight: 400;
  width: 10rem;
  font-size: 18px;
  color: black;
  background-color: var(--primary-color);
  padding: 0.6rem;
  border: 1px solid var(--primary-color);
  margin: 2rem;
  /* margin: 3rem auto; */

  &:hover {
    background-color: #028a39;
    color: black;
    cursor: pointer;
  }
`;

const DeButton = styled.button`
  font-weight: 400;
  width: 10rem;
  font-size: 18px;
  color: var(--primary-color);
  background-color: black;
  padding: 0.6rem;
  border: 1px solid var(--primary-color);
  margin: 2rem;
  /* margin: 3rem auto; */

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

type props = {
  validator: Validator;
  balance: BigNumber;
  delegations: DelegationResponse[];
  nodeAddress: string;
  setIsOpen: (isOpen: boolean) => void;
  fetchNewData: () => void;
  isTransactionSuccessful: (
    validatorAddress: string,
    parsedAmount: BigNumber,
    balance: BigNumber,
    transactionType: number
  ) => void;
  setConfirmation: (message: string) => void;
};

const StakeModal = (props: props) => {
  const {
    validator,
    balance,
    delegations,
    nodeAddress,
    setIsOpen,
    isTransactionSuccessful,
    setConfirmation,
  } = props;

  const [amount, setAmount] = useState<string>("0");

  const name = validator.description.moniker;
  const description = validator.operator_address;
  const commision =
    parseFloat(validator.commission.commission_rates.rate) * 100;
  const validatorAddress = validator.operator_address;

  let delegatedTo = BigNumber.from("0");
  delegations.forEach((delegation) => {
    if (
      delegation.delegation.validator_address.includes(
        validator.operator_address
      )
    ) {
      delegatedTo = BigNumber.from(delegation.balance.amount);
      return;
    }
  });

  const handleDelegate = async () => {
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    if (!parsedAmount.eq(BigNumber.from("0")) && parsedAmount.lte(balance)) {
      setConfirmation("waiting for the metamask transaction to be signed...");
      setIsOpen(false);
      await txStake(
        validatorAddress,
        parsedAmount.toString(),
        nodeAddress,
        fee,
        chain,
        memo
      );
      setConfirmation("waiting for the transaction to be verified...");
      setTimeout(
        () => isTransactionSuccessful(name, parsedAmount, balance, 0),
        7000
      );
    }
  };

  const handleUndelegate = async () => {
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    if (
      !parsedAmount.eq(BigNumber.from("0")) &&
      parsedAmount.lte(delegatedTo)
    ) {
      setConfirmation("waiting for the metamask transaction to be signed...");
      setIsOpen(false);
      await txUnstake(
        validatorAddress,
        parsedAmount.toString(),
        nodeAddress,
        unbondingFee,
        chain,
        memo
      );
      setConfirmation("waiting for the transaction to be verified...");
      setTimeout(
        () =>
          isTransactionSuccessful(
            name,
            parsedAmount,
            calculateTotalStaked(delegations),
            1
          ),
        7000
      );
    }
  };

  return (
    <Container>
      <div className="title">{name}</div>
      <div className="desc">
        <h2
          style={{
            textAlign: "center",
          }}
        >
          description
        </h2>
        <h4
          style={{
            color: "#D3D3D3",
            wordWrap: "break-word",
          }}
        >
          canto validator address
        </h4>
        <p
          style={{
            color: "#D3D3D3",
            wordWrap: "break-word",
          }}
        >
          {description}{" "}
        </p>
      </div>
      <div className="dual-h-row">
        <p className="type">delegation</p>
        <p className="value">{formatNumber(delegatedTo)} canto</p>
      </div>
      <div className="dual-h-row">
        <p className="type">available balance</p>
        <p className="value">{formatNumber(balance)} canto</p>
      </div>
      <div className="dual-h-row">
        <p className="type">commission</p>
        <p className="value">{commision.toFixed(3)} %</p>
      </div>
      <div className="textField">
        <p>amount:</p>
        <input
          type="text"
          name="amoubt"
          id="amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <p>canto</p>
      </div>
      <div className="btn-grp">
        <DeButton onClick={() => handleUndelegate()}>undelegate</DeButton>
        <Button onClick={() => handleDelegate()}>delegate</Button>
      </div>
      <footer>
        <p
          style={{
            color: "#EF4444",
          }}
        >
          staking will lock up your funds for at least 21 days
        </p>
        <p
          style={{
            color: "#8b8b8b",
          }}
        >
          once you undelegate your staked canto, you will need to wait 21 days
          for your tokens to be liquid
        </p>
      </footer>
    </Container>
  );
};

export default StakeModal;
