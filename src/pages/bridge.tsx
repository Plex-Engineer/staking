import styled from "styled-components";
import down from "assets/down.svg";
import right from "assets/right.svg";
import canto from "assets/logo.svg";
import Popup from "reactjs-popup";
import { useEffect, useState } from "react";
import TokenModal from "components/modals/tokenModal";
import { icons } from "constants/canto";
import { Contract, ethers, utils } from "ethers";
import {abi } from "constants/abi"


import {
  useContractFunction,
  useEthers,
} from "@usedapp/core";
import { parseEther } from "ethers/lib/utils";
import { toWei } from "utils";
import { Mixpanel } from "./../mixpanel";
import { BigNumber } from "ethers";
import { useGravityTokens } from "hooks/useGravityTokens";

const Container = styled.div`
  background-color: black;
  width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 5rem);
  border: 1px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 30px;
    font-weight: 300;
    line-height: 39px;
    letter-spacing: -0.1em;
    color: var(--off-white-color);
  }
  .amount {
    background-color: black;
    border: none;
    width: 240px;
    font-size: 24px;
    text-align: right;
    color: white;
    &::placeholder {
      color: #999;
    }
    &:focus {
      outline: none;
    }
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
  }

  .row {
    display: flex;
    gap: 6rem;
  }

  .wallet-item {
    display: flex;
    p {
      margin: 1rem;
      font-size: 22px;
      color: white;
    }
  }
`;

const Balance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #333;
  padding: 1rem 1.2rem;
  width: 80%;
  margin-top: 2rem;
  p {
    color: white;
    font-size: 22px;
    font-weight: 300;
    line-height: 26px;
    letter-spacing: 0em;
    text-align: left;
  }
`;

const Button = styled.button`
  font-weight: 300;
  font-size: 22px;
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


const DestInput = styled.input`
  border: 1px solid #333;
  padding: 1rem;
  width: 30rem;
  background-color: black;
  border: none;
  font-size: 24px;
  text-align: center;
  color: white;
  &::placeholder {
    color: #999;
  }
  &:focus {
    outline: none;
  }
`;
const BridgePage = () => {
  const [amount, setAmount] = useState("");
  const { account, activateBrowserWallet, switchNetwork, chainId } =useEthers();
  const [cosmosAddress, setCosmosAddress] = useState();
  const [customAddress, setCustomAddress] = useState("");

  const gravityTokens = useGravityTokens(account, chainId??1);

  // useEffect(() => {
  //   console.log(gravityTokens);
  // }, [gravityTokens]);

  useEffect(() => {
    if (account) getCantoAddressFromMetaMask(account);
  }, [account]);
  const [token, setToken] = useState({
    data: {
      icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/8.png",
      name: "select token",
      address: "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609",
    },
    allowance: -1,
    balanceOf: -1,
  });

  async function getCantoAddressFromMetaMask(address: string | undefined) {
    const result = await fetch(
      "http://143.198.3.19:1317/ethermint/evm/v1/cosmos_account/" + address,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("setting");
    setCosmosAddress((await result.json()).cosmos_address);
  }

  Mixpanel.events.pageOpened("Bridge", account);

  // getCantoAddressFromMetaMask(account, setCosmosAddress);

  const ImageButton = ({ image, name, chainID }: IWallet) => (
    <div
      onClick={async () => {
        //1 for ethereum mainnet, 15 for gravity bridge testnet
        activateBrowserWallet();

        if (chainID != 1) switchNetwork(1);
      }}
      style={{
        backgroundColor: "#1C1C1C",
        padding: "1rem 1.4rem",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        width: "20rem",
        cursor: "pointer",
      }}
    >
      {image ? <img src={image} alt={name} height={24} width={24} /> : null}
      <span
        style={{
          flex: "2",
          textAlign: "center",
        }}
      >
        {account
          ? chainID != 15
            ? "switch network"
            : account.substring(0, 10) +
              "..." +
              account.substring(account.length - 10, account.length)
          : "connect"}
      </span>
    </div>
  );
  // =========================
  return (
    <Container>
      <h1
        style={{
          margin: "2rem",
        }}
      >
        add funds to canto
      </h1>
      <div
        className="row"
        style={{
          border: "1px solid #444",
          padding: ".1rem 1rem",
          marginBottom: "1rem",
          width: "40rem",
          justifyContent: "space-around",
        }}
      >
        <div className="wallet-item">
          <img src={icons.WETH} alt="eth" width={26} />
          <p>Ethereum</p>
        </div>
        <img
          src={right}
          height={30}
          style={{
            margin: "1rem 1rem 1rem 0rem",
          }}
        />
        <div className="wallet-item">
          <img src={canto} alt="eth" width={26} />
          <p>Canto</p>
        </div>
      </div>
      <ImageButton chainID={chainId} name="connect" />
      <Balance>
        <TokenWallet
          tokens={gravityTokens}
          activeToken={token}
          onSelect={(value) => {
            setToken(value);
          }}
        />
        <input
          className="amount"
          autoComplete="off"
          type="text"
          name="amount"
          id="amount"
          value={amount}
          placeholder="0.00"
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val)) {
              setAmount(e.target.value);
            }
          }}
        />
      </Balance>

      <DestInput
        autoComplete="off"
        type="text"
        name="amount"
        id="amount"
        value={customAddress}
        placeholder={"default address -> " + cosmosAddress ?? "retrieving wallet"}
        onChange={(e) => {
            setCustomAddress(e.target.value);
        }}
      />

      <ReactiveButton
        destination={customAddress != "" ? customAddress : cosmosAddress}
        amount={amount}
        account={account}
        token={token}
      />
    </Container>
  );
};
interface RBProps {
  amount: string;
  account: string | undefined;
  token: any | undefined;
  destination: string | undefined;
}

const ReactiveButton = ({ amount, destination, token }: RBProps) => {

  console.log(destination)
  let gravityBridgeTestnetAddress =
    "0x7580bFE88Dd3d07947908FAE12d95872a260F2D8";
  //destination hardcoded from canto testnet wallet into canto address
  // let destination = "canto1lyjyma0pzece8fh6qxrz2knux4cfmh7348z9hm";

  const { state: stateApprove, send: sendApprove } = useApprove(
    token.data.address
  );
  const { state: stateCosmos, send: sendCosmos } = useCosmos(
    gravityBridgeTestnetAddress
  );
  if (token == undefined) {
    return <Button>Loading</Button>;
  }
  return (
    <Button
      onClick={() => {
        if (
          Number(amount) > Number(token.balanceOf) ||
          token.allowance == -1 ||
          !destination
        )
          return;

        if (token.allowance < Number(amount) || token.allowance == 0) {
          sendApprove(
            gravityBridgeTestnetAddress,
            BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935")
          );
        } else {
          sendCosmos(token.data.address, destination, parseEther(amount));
        }
      }}
    >
      {token?.allowance == -1
        ? "select a token"
        : token.allowance == 0
        ? "approve"
        : Number(amount) > Number(token.balanceOf)
        ? "insufficient funds"
        : token.allowance < Number(amount)
        ? "increase allowance"
        : Number(amount) <= 0
        ? "please enter a valid amount"
        : "send token"}
    </Button>
  );
};
interface IWallet {
  chainID?: Number;
  image?: string;
  name: string;
  value?: any;
  onSelect?: (value: any) => void;
}

interface ITokenSelect {
  activeToken: any;
  tokens: any[] | undefined;
  onSelect: (value: any) => void;
}

export const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"

  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }

  &-content {
    background-color: black;
    border: 1px solid var(--primary-color);
  }
`;

const ChainLink = styled.div`
  color: white;
  display: flex;
  padding: 1rem;
  gap: 1rem;
  border: 1px solid black;
  cursor: pointer;
  &:hover {
    border: 1px solid var(--primary-color);
    background-color: #0c3f2a;
  }
`;

const TokenWallet = ({ activeToken, onSelect, tokens }: ITokenSelect) => {
  const [isOpen, setOpen] = useState(false);

  const Box = styled.div`
    background-color: #1c1c1c;
    padding: 1rem 1.4rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 15rem;
    cursor: pointer;
    border: 1px solid black;
    &:hover {
      border: 1px solid var(--primary-color);
    }
  `;
  return (
    <Box
      onClick={() => {
        setOpen(true);
      }}
    >
      <img
        src={activeToken.data.icon}
        alt={activeToken.data.name}
        height={30}
        width={30}
      />
      <span
        style={{
          flex: "2",
        }}
      >
        {tokens ? activeToken.data.name : "loading tokens"}
      </span>
      <img src={down} alt="" />
      {tokens ? (
        <StyledPopup
          open={isOpen}
          onClose={() => {
            setOpen(false);
          }}
        >
          <hr
            style={{
              border: "0px",
              borderBottom: "1px solid #00502C",
              marginBottom: "1rem",
            }}
          />
          <TokenModal
            tokens={tokens}
            onClose={(value) => {
              if (onSelect) onSelect(value);
              setOpen(false);
            }}
          />
        </StyledPopup>
      ) : null}
    </Box>
  );
};

export function useApprove(tokenAddress: string) {
  const erc20Interface = new utils.Interface(abi.Erc20);
  const contract = new Contract(tokenAddress, erc20Interface);

  const { state, send } = useContractFunction(contract, "approve", {
    transactionName: "Enable token",
  });
  return { state, send };
}

export function useCosmos(gravityAddress: string) {
  const cosmosInterface = new utils.Interface([
    {
      inputs: [
        { internalType: "bytes32", name: "_gravityId", type: "bytes32" },
        { internalType: "address[]", name: "_validators", type: "address[]" },
        { internalType: "uint256[]", name: "_powers", type: "uint256[]" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    { inputs: [], name: "BatchTimedOut", type: "error" },
    { inputs: [], name: "IncorrectCheckpoint", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "cumulativePower", type: "uint256" },
        { internalType: "uint256", name: "powerThreshold", type: "uint256" },
      ],
      name: "InsufficientPower",
      type: "error",
    },
    {
      inputs: [
        { internalType: "uint256", name: "newNonce", type: "uint256" },
        { internalType: "uint256", name: "currentNonce", type: "uint256" },
      ],
      name: "InvalidBatchNonce",
      type: "error",
    },
    { inputs: [], name: "InvalidLogicCallFees", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "newNonce", type: "uint256" },
        { internalType: "uint256", name: "currentNonce", type: "uint256" },
      ],
      name: "InvalidLogicCallNonce",
      type: "error",
    },
    { inputs: [], name: "InvalidLogicCallTransfers", type: "error" },
    { inputs: [], name: "InvalidSendToCosmos", type: "error" },
    { inputs: [], name: "InvalidSignature", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "newNonce", type: "uint256" },
        { internalType: "uint256", name: "currentNonce", type: "uint256" },
      ],
      name: "InvalidValsetNonce",
      type: "error",
    },
    { inputs: [], name: "LogicCallTimedOut", type: "error" },
    { inputs: [], name: "MalformedBatch", type: "error" },
    { inputs: [], name: "MalformedCurrentValidatorSet", type: "error" },
    { inputs: [], name: "MalformedNewValidatorSet", type: "error" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "_cosmosDenom",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_tokenContract",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_symbol",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "_decimals",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "ERC20DeployedEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "_invalidationId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_invalidationNonce",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_returnData",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "LogicCallEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_tokenContract",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_destination",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "SendToCosmosEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "_batchNonce",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "TransactionBatchExecutedEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "_newValsetNonce",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_rewardAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "_rewardToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "_validators",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "_powers",
          type: "uint256[]",
        },
      ],
      name: "ValsetUpdatedEvent",
      type: "event",
    },
    {
      inputs: [
        { internalType: "string", name: "_cosmosDenom", type: "string" },
        { internalType: "string", name: "_name", type: "string" },
        { internalType: "string", name: "_symbol", type: "string" },
        { internalType: "uint8", name: "_decimals", type: "uint8" },
      ],
      name: "deployERC20",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_erc20Address", type: "address" },
      ],
      name: "lastBatchNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "_invalidation_id", type: "bytes32" },
      ],
      name: "lastLogicCallNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_tokenContract", type: "address" },
        { internalType: "string", name: "_destination", type: "string" },
        { internalType: "uint256", name: "_amount", type: "uint256" },
      ],
      name: "sendToCosmos",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "state_gravityId",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      name: "state_invalidationMapping",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "state_lastBatchNonces",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "state_lastEventNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "state_lastValsetCheckpoint",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "state_lastValsetNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
        { internalType: "uint256[]", name: "_amounts", type: "uint256[]" },
        { internalType: "address[]", name: "_destinations", type: "address[]" },
        { internalType: "uint256[]", name: "_fees", type: "uint256[]" },
        { internalType: "uint256", name: "_batchNonce", type: "uint256" },
        { internalType: "address", name: "_tokenContract", type: "address" },
        { internalType: "uint256", name: "_batchTimeout", type: "uint256" },
      ],
      name: "submitBatch",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
        {
          components: [
            {
              internalType: "uint256[]",
              name: "transferAmounts",
              type: "uint256[]",
            },
            {
              internalType: "address[]",
              name: "transferTokenContracts",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "feeAmounts",
              type: "uint256[]",
            },
            {
              internalType: "address[]",
              name: "feeTokenContracts",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "logicContractAddress",
              type: "address",
            },
            { internalType: "bytes", name: "payload", type: "bytes" },
            { internalType: "uint256", name: "timeOut", type: "uint256" },
            {
              internalType: "bytes32",
              name: "invalidationId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "invalidationNonce",
              type: "uint256",
            },
          ],
          internalType: "struct LogicCallArgs",
          name: "_args",
          type: "tuple",
        },
      ],
      name: "submitLogicCall",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
        { internalType: "bytes32", name: "_theHash", type: "bytes32" },
        { internalType: "uint256", name: "_powerThreshold", type: "uint256" },
      ],
      name: "testCheckValidatorSignatures",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_valsetArgs",
          type: "tuple",
        },
        { internalType: "bytes32", name: "_gravityId", type: "bytes32" },
      ],
      name: "testMakeCheckpoint",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_newValset",
          type: "tuple",
        },
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
      ],
      name: "updateValset",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ]);
  const contract = new Contract(gravityAddress, cosmosInterface);

  const { state, send } = useContractFunction(contract, "sendToCosmos", {
    transactionName: "sending to cosmos",
  });
  return { state, send };
}

export default BridgePage;
