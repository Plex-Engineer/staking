import {
  createTxMsgDelegate,
  createMessageSend,
  createTxMsgUndelegate,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxMsgBeginRedelegate,
} from "@tharsis/transactions";
import {
  generateEndpointDistributionRewardsByAddress,
  generateEndpointGetDelegations,
  generateEndpointGetValidators,
  generateEndpointGetUndelegations,
  generateEndpointBalances,
  createTxMsgWithdrawValidatorCommission,
  generateEndpointAccount,
} from "@tharsis/provider";
import { getSenderObj, signAndBroadcastTxMsg, ethToCanto } from "./utils";
import { BigNumber } from "ethers";
import { CantoMainnet } from "cantoui";
import { chain, estimateGas, fee, memo } from "pages/staking/utils";

/**
 * Transaction that stakes given amount to the designataed validator
 * @param {string} validator validator address string beginning with 'cantovaloper'
 * @param {string} amount amount to stake in string format e.g. '30000000000000000'
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txStake(
  account,
  validator,
  amount,
  nodeAddressIP,
  fee,
  chain,
  memo
) {
  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  const params = {
    validatorAddress: validator,
    amount: amount,
    denom: "acanto",
  };

  // create the msg to delegate
  const msg = createTxMsgDelegate(chain, senderObj, fee, memo, params);
  const result = await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
  return result;
}

/**
 * Transaction that unstakes given amount to the designated validator
 * @param {string} validator validator address string beginning with 'cantovaloper'
 * @param {string} amount amount to stake in string format e.g. '30000000000000000'
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txUnstake(
  account,
  validator,
  amount,
  nodeAddressIP,
  fee,
  chain,
  memo
) {
  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  const params = {
    validatorAddress: validator,
    amount: amount,
    denom: "acanto",
  };

  // create the msg to delegate
  const msg = createTxMsgUndelegate(chain, senderObj, fee, memo, params);
  const result = await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
  return result;
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
export async function txRedelegate(
  account,
  amount,
  nodeAddressIP,
  fee,
  chain,
  memo,
  source,
  dest
) {
  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  const params = {
    validatorSrcAddress: source,
    validatorDstAddress: dest,
    amount: amount,
    denom: "acanto",
  };

  // create the msg to delegate
  const msg = createTxMsgBeginRedelegate(chain, senderObj, fee, memo, params);
  const result = await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
  return result;
}

/**
 * Transaction that claims rewards for all of the validators user delegated to
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txClaimRewards(
  account,
  nodeAddressIP,
  fee,
  chain,
  memo,
  validators
) {
  const params = {
    validatorAddresses: Array.from(
      validators.map((validator) => {
        return validator["operator_address"];
      })
    ),
  };

  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  // create the msg to delegate
  const msg = createTxMsgMultipleWithdrawDelegatorReward(
    chain,
    senderObj,
    fee,
    memo,
    params
  );
  // console.log(msg)
  // console.log( await fetch(CantoMainnet.cosmosAPIEndpoint + "/cosmos/tx/v1beta1/simulate", {body: msg}).then(resp => await resp.json()).then(resp => resp))
  // console.log(msg.signDirect.body.array[0][1][1])
  // estimateGas(msg.signDirect.body.array[0][1][1]);
  await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}

/**
 * Transaction that claims rewards a validator
 * @param {string} validatorAddress address of the validator
 * @param {string} nodeAddressIP node ip with port 1317
 * @param {object} fee fee object
 * @param {object} chain chain object
 * @param {string} memo memo in string format (defautl to empty)
 */
export async function txClaimValidatorCommisions(
  validatorAddress,
  nodeAddressIP,
  fee,
  chain,
  memo
) {
  // get metamask account address
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];

  const params = {
    validatorAddress: validatorAddress,
  };

  // get sender object using eth address
  const senderObj = await getSenderObj(account, nodeAddressIP);

  // create the msg to delegate
  const msg = createTxMsgWithdrawValidatorCommission(
    chain,
    senderObj,
    fee,
    memo,
    params
  );
  signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L66-L82
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getDelegationsForAddress(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url = nodeAddressIP + generateEndpointGetDelegations(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const result = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result.delegation_responses;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
  return result;
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L89-L109
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getUndelegationsForAddress(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url = nodeAddressIP + generateEndpointGetUndelegations(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const result = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      let undelegation_map = {};
      let validators = [];

      let totalUnbonding = BigNumber.from("0");
      result.unbonding_responses.forEach((undelegation) => {
        let validator_info = {};
        let validator_unbonding = BigNumber.from("0");
        const { entries, validator_address } = undelegation;
        validator_info["name"] = validator_address;

        let lockouts = [];
        entries.forEach((entry) => {
          let lockout_object_info = {};
          lockout_object_info["complete_time_stamp"] = entry.completion_time;
          lockout_object_info["value_of_coin"] = BigNumber.from(entry.balance);
          lockouts.push(lockout_object_info);
          validator_unbonding = validator_unbonding.add(
            BigNumber.from(entry.balance)
          );
          totalUnbonding = totalUnbonding.add(BigNumber.from(entry.balance));
        });
        validator_info["lockouts"] = lockouts;
        validator_info["validator_unbonding"] = validator_unbonding;
        validators.push(validator_info);
      });

      undelegation_map["total_unbonding"] = totalUnbonding;
      undelegation_map["validators"] = validators;
      return undelegation_map;
    })
    .catch((err) => {
      console.log(err);
      let undelegation_map = {
        total_unbonding: BigNumber.from("0"),
      };
      return undelegation_map;
    });
  return result;
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L22-L59
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getValidators(nodeAddressIP) {
  const url = nodeAddressIP + "/cosmos/staking/v1beta1/validators?pagination.limit=200";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const result = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      return result.validators;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
  return result;
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/balances.ts#L9-L15
 */
export async function getCantoBalance(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url = nodeAddressIP + generateEndpointBalances(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const result = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      const balances = result.balances;
      let cantoBalance = BigNumber.from("0");
      balances.forEach((coin) => {
        if (coin.denom === "acanto") {
          cantoBalance = BigNumber.from(coin.amount);
        }
      });
      return cantoBalance;
    })
    .catch((err) => {
      console.log(err);
      return BigNumber.from("0");
    });
  return result;
}

/**
 * https://github.com/evmos/evmosjs/blob/193244306f544eea6b2070e3f9563cb48ca21094/packages/provider/src/rest/staking.ts#L3-L19
 * @param {string} nodeAddressIP node ip with port 1317
 */
export async function getDistributionRewards(nodeAddressIP, address) {
  const cantoAddress = await ethToCanto(address, nodeAddressIP);
  const url =
    nodeAddressIP + generateEndpointDistributionRewardsByAddress(cantoAddress);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const result = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      let cantoRewards = BigNumber.from("0");
      result.total.forEach((reward) => {
        if (reward.denom.includes("acanto")) {
          cantoRewards = BigNumber.from(reward.amount.split(".")[0]);
          return;
        }
      });
      return cantoRewards;
    })
    .catch((err) => {
      console.log(err);
      return BigNumber.from("0");
    });
  return result;
}

//Added for genPubKey

export async function checkPubKey(bech32Address) {
  const endPointAccount = generateEndpointAccount(bech32Address);

  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  try {
    const addressRawData = await fetch(
      "https://mainnode.plexnode.org:1317" + endPointAccount,
      options
    );
    const addressData = await addressRawData.json();
    return addressData["account"]["base_account"]["pub_key"] != null;
  } catch {
    return false;
  }
}
export async function getCantoAddressFromMetaMask(address) {
  const nodeURLMain = "https://mainnode.plexnode.org:1317";
  const result = await fetch(
    nodeURLMain + "/ethermint/evm/v1/cosmos_account/" + address,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  console.log("setting canto address");
  let cosmosAddress = (await result.json()).cosmos_address;
  return cosmosAddress;
}

async function checkCantoBalance(bech32Address) {
  const nodeURLMain = CantoMainnet.cosmosAPIEndpoint;
  const result = await fetch(
    nodeURLMain + "/cosmos/bank/v1beta1/balances/" + bech32Address + "/by_denom?denom=acanto",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  let balance = BigNumber.from((await result.json()).balance.amount);
  console.log(balance);
  
  if (balance.lt(BigNumber.from("300000000000000000"))) {
    console.log("0 balance")
    return false;
  }
  return true;
}

export async function generatePubKey(hexAddress, setIsSuccess) {
  const botAddress = "canto1efrhdukv096tmjs7r80m8pqkr3udp9g0uadjfv";
  if (hexAddress === undefined) {
    setIsSuccess("please connect your metamask to this page...");
    return;
  }
  setIsSuccess("please wait...");

  const bech32Address = await getCantoAddressFromMetaMask(hexAddress);
  const hasCanto = await checkCantoBalance(bech32Address);

  const hasPubKey = await checkPubKey(bech32Address);
  if (hasPubKey) {
    setIsSuccess("user already has a public key for account: " + hexAddress);
    return;
  }

  if (!hasCanto) {
    try {
      // await bot call only if user has no canto
      const botResponse = await callBot(bech32Address, hexAddress);
      console.log(botResponse);
    } catch {
      console.log("no response from bot")
      setIsSuccess("account must have ETH balance on ethereum mainnet or CANTO balance on canto network")
      return;
    }
  }
  // await generate pub key
  setIsSuccess("waiting for the metamask transaction to be signed...");
  const response = await txSend(botAddress, hexAddress, bech32Address, "1"); // await txSend to bot
  setIsSuccess("generating account...");
  const wrapper = async () => {
    const hasPubKey = await checkPubKey(bech32Address);
    if (hasPubKey) {
      setIsSuccess("account successfully generated!");
      window.location.reload();
    } else {
      setIsSuccess("public key generatation was unsuccessful");
    }
  };
  setTimeout(wrapper, 8000);
}

async function callBot(cantoAddress, hexAddress) {
  const CANTO_BOT_URL = "https://bot.plexnode.wtf/";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "true",
    },
    body: JSON.stringify({
      cantoAddress: cantoAddress,
      hexAddress: hexAddress,
    }),
  };

  const result = await fetch(CANTO_BOT_URL, options);
  return result;
}

export async function txSend(
  destinationBech32,
  senderHexAddress,
  senderBech32address,
  amount
) {
  const senderObj = await getSenderObj(
    senderHexAddress,
    "https://mainnode.plexnode.org:1317"
  );
  const params = {
    destinationAddress: destinationBech32,
    amount: amount,
    denom: "acanto",
  };
  const sendFee = {
    amount: "25000000000000000",
    denom: "acanto",
    gas: "250000",
  };
  const msg = createMessageSend(chain, senderObj, sendFee, memo, params);
  return signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    "https://mainnode.plexnode.org:1317",
    senderHexAddress
  );
}
