import Row from "./Row";
import { Validator, DelegationResponse, UndelegationMap } from "./utils";
import LendingTable from "components/lending/lendingTable";
import { BigNumber } from "ethers";

type props = {
    setIsOpen: (isOpen: boolean) => void,
    validators: Validator[],
    delegations: DelegationResponse[],
    setValidatorModal: (validator : Validator) => void,
    fetchNewData: () => void,
    undelegations: UndelegationMap
}

const ValidatorTable = (props: props) => {
    const { setIsOpen, validators, delegations, setValidatorModal, fetchNewData, undelegations } = props;

    validators.sort((a, b) => {
        const delegatorATokens = BigNumber.from(a.tokens);
        const delegatorBTokens = BigNumber.from(b.tokens);
        return delegatorATokens.gt(delegatorBTokens) ? -1 : 1;
    });

    function find_matched_address(op_address: string, undelegations: UndelegationMap)  {
        const operator_address = op_address;
        return undelegations.validators?.find(o => o.name === operator_address);
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
                "",
            ]}
        >
            {validators.map((validator, key) => {
                const matched_addy_object = find_matched_address(validator['operator_address'], undelegations);
                return <Row
                    key={key}
                    setIsOpen={setIsOpen}
                    delegations={delegations}
                    setValidatorModal={setValidatorModal}
                    validator={validator}
                    fetchNewData={fetchNewData}
                    rank={key}
                    undelegationInfo={matched_addy_object}
                />;
            })}
        </LendingTable>
    );
};

export default ValidatorTable;
