import Row from "./Row";
import styled from "styled-components";
import { Validator, DelegationResponse, UndelegationMap } from "./utils";
import LendingTable from "components/lending/lendingTable";
import { BigNumber } from "ethers";

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  margin: 3rem auto;
  display: flex;
  align-self: center;

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

type props = {
  setIsOpen: (isOpen: boolean) => void;
  validators: Validator[];
  delegations: DelegationResponse[];
  setValidatorModal: (validator: Validator) => void;
  fetchNewData: () => void;
  undelegations: UndelegationMap;
};

const ValidatorTable = (props: props) => {
  const {
    setIsOpen,
    validators,
    delegations,
    setValidatorModal,
    fetchNewData,
    undelegations,
  } = props;

  validators.sort((a, b) => {
    const delegatorATokens = BigNumber.from(a.tokens);
    const delegatorBTokens = BigNumber.from(b.tokens);
    return delegatorATokens.gt(delegatorBTokens) ? -1 : 1;
  });

  function find_matched_address(
    op_address: string,
    undelegations: UndelegationMap
  ) {
    const operator_address = op_address;
    return undelegations.validators?.find((o) => o.name === operator_address);
  }
  if (validators.length) {
    return (
      <LendingTable
        isLending={false}
        columns={[
          "rank",
          "name",
          "validator total",
          "my stake",
          "undelegations",
          "commission",
          "",
        ]}
      >
        {validators.map((validator, key) => {
          const matched_addy_object = find_matched_address(
            validator["operator_address"],
            undelegations
          );
          return (
            <Row
              key={key}
              setIsOpen={setIsOpen}
              delegations={delegations}
              setValidatorModal={setValidatorModal}
              validator={validator}
              fetchNewData={fetchNewData}
              rank={key}
              undelegationInfo={matched_addy_object}
            />
          );
        })}
      </LendingTable>
    );
  }

  return (
    <LendingTable
      isLending={false}
      columns={[
        "rank",
        "name",
        "validator total",
        "my stake",
        "undelegations",
        "commission",
      ]}
    >
      <tr>
        <td>n/a</td>
        <td>n/a</td>
        <td>n/a</td>
        <td>n/a</td>
        <td>n/a</td>
        <td>n/a</td>
        <td></td>
      </tr>
    </LendingTable>
  );
};

export default ValidatorTable;
