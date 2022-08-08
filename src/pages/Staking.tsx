import StakeModal from "components/modals/stakeModal";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import styled from "styled-components";
import { StyledPopup } from "./bridge";
import ValidatorTable from "./staking/ValidatorTable";
import {
  Validator,
  nodeAddress,
  calculateTotalStaked,
  fee,
  chain,
  memo,
  formatNumber,
  REFRESH_RATE,
  UndelegationMap,
} from "./staking/utils";
import {
  getValidators,
  getCantoBalance,
  getDelegationsForAddress,
  getDistributionRewards,
  txClaimRewards,
  getUndelegationsForAddress,
} from "utils/transactions";
import { useEffect } from "react";
import { DelegationResponse } from "@tharsis/provider";
import StakingTab from "./staking/StakingTab";
import { BigNumber } from "ethers";
import { useNetworkInfo } from "stores/networkinfo";
import { Button } from "cantoui";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  margin: 0 8rem; //TODO: make this dynamic
  margin-bottom: 10%;
  margin-top: 5%;
  .hero-box {
    border: 2px solid var(--primary-color);
    display: flex;
    justify-content: space-around;
    background-color: #072807;
    padding: 2rem;
  }

  .dual-item {
    color: var(--primary-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;

    p:last-child {
      font-size: 30px;
    }
  }
  .selected {
    background: var(--primary-color);
    border-radius: 1px;
    color: black;
    /* z-index: 1000; */
  }

  /* .tablist {
    display: flex;
    list-style: none;
    border: 2px sold var(--primary-color);
    padding: 1rem;
    background-color: red;

    div {
        flex: 1;
    }
} */
  .tabs {
    margin-top: 2rem;
    height: 100%;
    /* margin: 16px; */
  }
  .tablist {
    list-style: none;
    display: flex;
    justify-content: space-between;
    border: 1px solid var(--primary-color);
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
      }
    }
  }
`;

const StakeContainer = styled.div`
  margin-top: 5%;
  gap: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ValidatorContainer = styled.div``;

const ConfirmationContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 30px;
  padding: 0.4rem 0;
  width: 50rem;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 18px;
  padding: 1rem 2rem;
  background-color: #1e2c1d;
  border: 1px solid var(--primary-color);
  text-shadow: none;
  .message {
    margin: auto;
  }
`;

const CloseNotificationButton = styled.button`
  align-self: center;
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 1px 10px;
  border: 1px solid var(--primary-color);
  margin: 0px;
  align-self: center;

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const Staking = () => {
  // FRONTEND USESTATES
  // used to store the validator for the modal
  const [validatorModal, setValidatorModal] = useState<Validator>();
  // this is used to check and set the validator modal is open or not
  const [isOpen, setIsOpen] = useState(false);
  // this is used to display all of the users delegations in a table
  const [viewAllDelegations, setViewAllDelegations] = useState(false);
  // used to refresh the page in a given refresh rate
  const [sent, setSent] = useState(false);
  // used to notify the user if their staking transactions were successful or not
  const [confirmation, setConfirmation] = useState<React.ReactNode>(null);

  // DATA USESTATES (request for user data)
  // get all of the validators
  const [validators, setValidators] = useState<Validator[]>(new Array());
  // get the canto balance of the user
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from("0"));
  // get all of the validators the user has staked to
  const [delegations, setDelegations] = useState<DelegationResponse[]>(
    new Array()
  );
  // get all of the undelegations for the user
  const [undelegations, setUndelegations] = useState<UndelegationMap>({
    total_unbonding: BigNumber.from("0"),
  });
  // get all of the rewards for the user
  const [rewards, setRewards] = useState<BigNumber>(BigNumber.from("0"));

  const { account } = useNetworkInfo();

  // wrapper to request new data every 6 seconds;
  const fetchNewData = () => {
    setSent(!sent);
  };

  const isTransactionSuccessful = async (
    validatorAddress: string,
    parsedAmount: BigNumber,
    prevBalance: BigNumber,
    transactionType: number
  ) => {
    const currentBalance = await getCantoBalance(nodeAddress, account);
    const currentDelegations = calculateTotalStaked(
      await getDelegationsForAddress(nodeAddress, account)
    );
    const amount = formatNumber(parsedAmount, 18);
    let message: React.ReactNode = "";

    // if the balance did not change, the transaction was unsuccessful
    if (
      (transactionType !== 1 && prevBalance.eq(currentBalance)) ||
      (transactionType === 1 && currentDelegations.eq(prevBalance))
    ) {
      // change the message based on transaction type
      switch (transactionType) {
        case 0:
          message = (
            <>
              your delegation was unsuccessful. read more about why{" "}
              <a
                style={{ color: "white" }}
                href="https://canto.gitbook.io/canto/user-guides/staking"
              >
                here
              </a>
            </>
          );
          break;
        case 1:
          message = (
            <>
              your undelegation was unsuccessful. read more about why{" "}
              <a
                style={{ color: "white" }}
                href="https://canto.gitbook.io/canto/user-guides/staking"
              >
                here
              </a>
            </>
          );
          break;
        case 2:
          message = "you did not claim rewards successfully";
          break;
      }
    } else {
      // change the message based on transaction type
      switch (transactionType) {
        case 0:
          message =
            "you have successfully delegated " +
            amount +
            " canto to " +
            validatorAddress;
          break;
        case 1:
          message =
            "you have successfully undelegated " +
            amount +
            " canto from " +
            validatorAddress;
          break;
        case 2:
          message = "you successfully claimed " + amount + " in canto rewards";
          break;
      }
    }
    setConfirmation(message);
    fetchNewData();
  };

  // request all of the data
  const requestData = async () => {
    setValidators(await getValidators(nodeAddress));
    if (account != undefined) {
      setBalance(await getCantoBalance(nodeAddress, account));
      setDelegations(await getDelegationsForAddress(nodeAddress, account));
      setRewards(await getDistributionRewards(nodeAddress, account));
      setUndelegations(await getUndelegationsForAddress(nodeAddress, account));
    }
  };
  useEffect(() => {
    requestData();
  }, [sent, account]);

  // get only the validators this user has delegated to
  const filteredValidators = Array.from(
    validators.filter((validator) => {
      for (let i = 0; i < delegations.length; i++) {
        const delegation = delegations[i];
        if (
          delegation.delegation.validator_address == validator.operator_address
        ) {
          return true;
        }
      }
      return false;
    })
  );

  const handleClaimRewards = async () => {
    setConfirmation("waiting for the metamask transaction to be signed...");
    await txClaimRewards(account, nodeAddress, fee, chain, memo);
    setConfirmation("waiting for the transaction to be verified...");
    setTimeout(
      () => isTransactionSuccessful("", rewards, balance, 2),
      REFRESH_RATE
    );
  };

  return (
    <Container>
      <div>
        <div className="hero-box">
          <div className="dual-item">
            <p>balance</p>
            <p>{formatNumber(balance, 18)}</p>
          </div>
          <div className="dual-item">
            <p>total staked</p>
            <p>{formatNumber(calculateTotalStaked(delegations), 18)}</p>
          </div>
          <div className="dual-item">
            <p>total unbonding</p>
            <p>{formatNumber(undelegations.total_unbonding, 18)}</p>
          </div>
          <div className="dual-item">
            <p>rewards</p>
            <p>{formatNumber(rewards, 18)}</p>
          </div>
        </div>
      </div>
      {confirmation != null ? (
        <ConfirmationContainer>
          <div className="message">
            <p>{confirmation}</p>
          </div>
          <CloseNotificationButton onClick={() => setConfirmation(null)}>
            x
          </CloseNotificationButton>
        </ConfirmationContainer>
      ) : null}

      <Tabs
        disabledTabClassName="disabled"
        selectedTabClassName="selected"
        className={"tabs"}
      >
        <TabList className={"tablist"}>
          <Tab className={"tab"} selectedClassName="tab-selected">
            staking
          </Tab>
          <Tab className={"tab"} selectedClassName="tab-selected">
            all validators
          </Tab>
        </TabList>
        <TabPanel>
          <StakeContainer>
            <Button onClick={() => handleClaimRewards()} style={{width: "40%"}}>claim rewards</Button>
            <StakingTab
              setIsOpen={setIsOpen}
              setValidatorModal={setValidatorModal}
              setViewAllDelegations={setViewAllDelegations}
              viewAllDelegations={viewAllDelegations}
              delegations={delegations}
              validators={filteredValidators}
              fetchNewData={fetchNewData}
              undelegations={undelegations}
            />
          </StakeContainer>
        </TabPanel>
        <TabPanel>
          <ValidatorContainer>
            <ValidatorTable
              setIsOpen={setIsOpen}
              setValidatorModal={setValidatorModal}
              validators={validators}
              delegations={delegations}
              fetchNewData={fetchNewData}
              undelegations={undelegations}
            />
          </ValidatorContainer>
        </TabPanel>
      </Tabs>

      <StyledPopup
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        {validatorModal && account != undefined && (
          <StakeModal
            account={account}
            validator={validatorModal}
            balance={balance}
            delegations={delegations}
            nodeAddress={nodeAddress}
            setIsOpen={setIsOpen}
            fetchNewData={fetchNewData}
            isTransactionSuccessful={isTransactionSuccessful}
            setConfirmation={setConfirmation}
          />
        )}
      </StyledPopup>
    </Container>
  );
};

export default Staking;
