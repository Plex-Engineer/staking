import styled from 'styled-components';
import {nodeURL} from '../utils/nodeTransactions'
import { getSenderObj, signAndBroadcastTxMsg } from '../utils/nodeTransactions';
import { createTxMsgDelegate, createTxMsgVote } from '@tharsis/transactions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  width: 1124px;
  margin: 0 auto;
  .title {
    font-weight: 300;
    font-size: 184px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.13em;
    color: #06fc99;
    text-shadow: 0px 12.2818px 12.2818px rgba(6, 252, 153, 0.2);
  }

  & > button {
    background-color: var(--primary-color);
    border: none;
    border-radius: 0px;
    padding: 0.6rem 2.4rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.03em;
    width: fit-content;
    margin: 0 auto;
    margin-top: 2rem;

    margin-bottom: 3rem;

    &:hover {
      background-color: var(--primary-color-dark);
      cursor: pointer;
    }
  }

  
`;

// const { account, activateBrowserWallet, chainId } = useEthers();

/**
 * Transaction that votes on the given proposal using the proposal option
 * @param {number} proposalID proposal id 
 * @param {number} proposalOption the vote option (1 = yes, 2 = abstain, 3 = no, 4 = no with veto)
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */

 const fee = {
  amount: "1000",
  denom: "acanto",
  gas: '10000000',
};

const chain = {
    chainId: 9624,
    cosmosChainId: 'canto_9624-1'
};

const memo = '';

 export async function voteOnProposal(proposalID:number, proposalOption:number, nodeAddressIP:string, fee:any, chain:any, memo:string) {
  // check metamask
  //@ts-ignore
  if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      return;
  } else {
      console.log('Please install Metamask!');
  }

  // get metamask account address
  //@ts-ignore
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];

  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  const params = {
      proposalId: proposalID,
      option: proposalOption
  }

  console.log(senderObj);
  const msg = createTxMsgVote(chain, senderObj, fee, memo, params);

  console.log(msg);
  signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}

// await voteOnProposal(1, 1, nodeURL, fee, chain, memo)



const Proposal = () => {
  return (
   <Container>
    <p>governance / #32</p>
    <p>voting</p>
    <h1>Extend Rektdrop Claims Period by 21 days</h1>
    <RowCell type='TOTAL DEPOSIT:' value='64 EVMOS'/>
    <RowCell type='TYPE:' value='ParameterChangeProposal'/>
    <RowCell type='SUBMIT TIME:' value='05.03.22 · 13:03:58'/>
    <RowCell type='DEPOSIT END TIME:' value='05.23.22 · 03:03:58'/>
    <RowCell type='QUORUM:' value='33.40%'/>
    <RowCell type='THRESHOLD:' value='50.00%'/>
    <RowCell type='VETO THRESHOLD:' value='33.40%'/>
    <RowCell type='DURATION UNTIL DECAY:' value='81 days'/>
    <RowCell type='VETO THRESHOLD:' value='33.40%'/>
   </Container>
  )
}
interface Props {
    type : string;
    value : string;
}
const RowCell = (props : Props)=>{
    return <div style={{
        display : "flex",
        justifyContent : "space-between"
    }}>
        <p>{props.type}</p>
        <p>{props.value}</p>
    </div>
}

export default Proposal