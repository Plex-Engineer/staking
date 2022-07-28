import { generateEndpointAccount, generateEndpointBroadcast, generatePostBodyBroadcast } from '@tharsis/provider';
import { createTxRawEIP712, signatureToWeb3Extension } from '@tharsis/transactions';
import { ethers } from "ethers";
import { signatureToPubkey } from '@hanchon/signature-to-pubkey';
import { Buffer } from 'buffer';

/**
 * Signs msg using metamask and broadcasts to node
 * @param {object} msg msg object
 * @param {object} senderObj sender object
 * @param {object} chain chain object
 * @param {string} nodeAddress ip address and port of node
 * @param {string} account eth hex address
 */
export async function signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddress, account) {
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
    return response;
}

/**
 * Uses the eth hex address, converts it to a canto address, 
 * then gets the sender object. 
 * @param {string} address The eth address
 * @param {string} nodeAddress The address of the node: xxx.xxx.x.xx:1317
 * @return {string} The sender object
 */
export async function getSenderObj(address, nodeAddress) {
    const accountCanto = await ethToCanto(address, nodeAddress);
    const endPointAccount = generateEndpointAccount(accountCanto);

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }

    const addressRawData = await fetch(
        nodeAddress + endPointAccount,
        options
    );

    const addressData = await addressRawData.json();
    const senderObj = await reformatSender(addressData['account']['base_account']);
    return senderObj;
}

/**
 * Reformats the addressData into senderObj
 * @param {object} addressData The eth address
 * @return {string} The sender object
 */
async function reformatSender(addressData) {
    let pubkey;
    if (addressData['pub_key'] == null) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        await provider.send("eth_requestAccounts", [1]);
        const signer = provider.getSigner();
        const signature = await signer.signMessage('generate_pubkey');
    
        pubkey = signatureToPubkey(
            signature,
            Buffer.from([
            50, 215, 18, 245, 169, 63, 252, 16, 225, 169, 71, 95, 254, 165, 146, 216,
            40, 162, 115, 78, 147, 125, 80, 182, 25, 69, 136, 250, 65, 200, 94, 178,
            ]),
        );
    } else {
        pubkey = addressData['pub_key']['key'];
    }
    return {
        accountNumber: addressData['account_number'],
        pubkey: pubkey,
        sequence: addressData['sequence'],
        accountAddress: addressData['address'],
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
function generateRawTx(chain, senderObj, signature, msg) {
    let extension = signatureToWeb3Extension(chain, senderObj, signature)
    let rawTx = createTxRawEIP712(msg.legacyAmino.body, msg.legacyAmino.authInfo, extension)
    return rawTx;
}

/**
 * Convert an eth hex address to bech32 canto address.
 * @param {string} address The eth address to convert into a canto address
 * @return {string} The converted address
 */
export async function ethToCanto(address, nodeAddress) {
    return fetch(nodeAddress + "/ethermint/evm/v1/cosmos_account/" + address, {
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
        .catch(error => {
            console.log("error inside of ethToCanto")
            return '';
        });
}
