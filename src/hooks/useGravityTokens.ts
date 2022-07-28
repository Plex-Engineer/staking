import { formatEther } from "@ethersproject/units";
import { useCalls, useCall, ChainId, useEthers } from "@usedapp/core";
import { Contract } from "ethers";
import { gravityTokenBase, address, networkProperties } from "constants/canto";
import {abi } from "constants/abi"


export function useGravityTokens(
  account: string | undefined, chainId:number
): any[] | undefined {
  const tokens = networkProperties.find((val) => val.network == chainId)?.gravityTokens;
  // const tokens: typeof gravityTokenBase[0][] = gravityTokenBase;
  const gravityBridgeTestnetAddress = "0x7580bFE88Dd3d07947908FAE12d95872a260F2D8";
  const gravityBridgeMainnetAddress = "0xa4108aA1Ec4967F8b52220a4f7e94A8201F2D906";
  let gravityAddress = chainId == 1 ? gravityBridgeMainnetAddress : gravityBridgeTestnetAddress


//   const bal = formatEther(useEtherBalance(account) ?? 0);
  //Testing Grvity Bridge Functions
  // console.log("DSADSASDAS" +gravityTokenBase[0].address)
  // console.log("Account" +account)
  // const ERC20Contract = new Contract(gravityTokenBase[0].address, abi.Erc20);
  // const balanceCall = {contract: ERC20Contract, method:"balanceOf",args:[account]};
  // const {value, error} = useCall(balanceCall) ?? {}
  // console.log("TEST"+value)
  // console.log("ERROR"+error)

  
  
  const calls =
    tokens?.map((token) => {
      const ERC20Contract = new Contract(token.address, abi.Erc20);

      return [
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        {
          contract: ERC20Contract,
          method: "allowance",
          args: [account, gravityAddress],
        },
      ];
    }) ?? [];
  const results = useCalls(typeof tokens == typeof gravityTokenBase ? calls.flat(): []) ?? {};

  if (account == undefined) {
    return undefined;
  }
  if(tokens == undefined){
    return []
  }
  const chuckSize = results.length / tokens.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value);
    let chunks = [];

    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const val = processedTokens.map((tokenData, idx) => {
      const balanceOf = Number(formatEther(tokenData[0][0]));
      const allowance = Number(formatEther(tokenData[1][0]));
     
      return {
        data: tokens[idx],
        wallet: account,
        balanceOf,
        allowance,
      };
    });
    if(val[0].balanceOf == undefined)
    return undefined

    return val;
  }

  return undefined;
}
