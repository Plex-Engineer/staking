import { generateEndpointAccount, generateEndpointBroadcast, generatePostBodyBroadcast } from '@tharsis/provider';
import { createTxRawEIP712, signatureToWeb3Extension, createTxMsgDelegate } from '@tharsis/transactions';

export const nodeURL = "http://159.65.160.29:1317";

/**
 * Signs msg using metamask and broadcasts to node
 * @param {object} msg msg object
 * @param {object} senderObj sender object
 * @param {object} chain chain object
 * @param {string} nodeAddress ip address and port of node
 * @param {string} account eth hex address
 */
 export async function signAndBroadcastTxMsg(msg:any, senderObj:any, chain:any, nodeAddress:string, account:string) {
    // @ts-ignore
    const signature = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msg.eipToSign)],
    });
    
    const raw = generateRawTx(chain, senderObj, signature, msg);

    const postOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: generatePostBodyBroadcast(raw),
    };

    const broadcastPost = await fetch(
        nodeAddress + generateEndpointBroadcast(),
        postOptions
    );
    const response = await broadcastPost.json();
    console.log(response);
}

/**
 * Uses the eth hex address, converts it to a canto address, 
 * then gets the sender object. 
 * @param {string} address The eth address
 * @param {string} nodeAddress The address of the node: xxx.xxx.x.xx:1317
 * @return {string} The sender object
 */
export async function getSenderObj(address:string, nodeAddress:string) {
    const accountCanto = await ethToCanto(address, nodeAddress);
    //console.log(accountCanto);
    const endPointAccount = generateEndpointAccount(accountCanto??"");
    
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    
    const addressRawData = await fetch(
        nodeAddress + endPointAccount,
        options
    );
    
    const addressData = await addressRawData.json();
    const senderObj = reformatSender(addressData['account']['base_account']);

    return senderObj;
}

/**
 * Convert an eth hex address to bech32 canto address.
 * @param {string} address The eth address to convert into a canto address
 * @return {string} The converted address
 */
 async function ethToCanto(address:string, nodeAddress:string) {
    return fetch(nodeAddress+ "/ethermint/evm/v1/cosmos_account/" + address, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => response.json())
        .then(result => {
            address = result.cosmos_address
            return address;
        })
        .catch(error => console.log("error", error));
}

/**
 * Reformats the addressData into senderObj
 * @param {object} addressData The eth address
 * @return {string} The sender object
 */
function reformatSender(addressData:any) {
    return {
        accountNumber : addressData['account_number'],
        pubkey : addressData['pub_key']['key'],
        sequence : addressData['sequence'],
        accountAddress : addressData['address'],
    }
}

/**
 * Generates the raw tx string to broadcast
 * @param {object} chain Chain object
 * @param {object} senderObj Sender object
 * @param {object} signature Signature object
 * @param {object} msg Msg object
 * @return {string} The raw tx string
 */
function generateRawTx(chain:any, senderObj:any, signature:any, msg:any) {
    let extension = signatureToWeb3Extension(chain, senderObj, signature)
    let rawTx = createTxRawEIP712(msg.legacyAmino.body, msg.legacyAmino.authInfo, extension)
    return rawTx;
}

/**
 * Transaction that stakes given amount to the designataed validator
 * @param {string} validator validator address string beginning with 'cantovaloper'
 * @param {string} amount amount to stake in string format e.g. '30000000000000000'
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
 export async function txStake(validator:string, amount:string, nodeAddressIP:string, fee:any, chain:any, memo:string) {
    // check metamask
    // @ts-ignore
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    } else {
        console.log('Please install Metamask!');
    }

    // get metamask account address
    // @ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    console.log(account);

    // get sender object using eth address
    const senderObj = await getSenderObj(account, nodeAddressIP);

    const params = {
        validatorAddress: validator,
        amount: amount,
        denom: "acanto"
    }
    
    // create the msg to delegate
    const msg = createTxMsgDelegate(chain, senderObj, fee, memo, params);
    signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}