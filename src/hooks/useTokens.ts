import { formatEther } from "@ethersproject/units";
import { useCalls, useCall, useEtherBalance } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { cTokensBase, address as constAddress, networkProperties } from "constants/canto";
import {abi } from "constants/abi"

export function useTokens(account: string | undefined, chainId : number): any[] | undefined {

  
  const tokens = networkProperties.find((val)=> val.network == chainId)?.tokens;
  const address = networkProperties.find((val)=> val.network == chainId)?.address ?? constAddress.testnet;
    
  // if(typeof tokens != typeof cTokensBase){
  //   return []
  // }
  const blocksPerDay = 6570.342205323193916; // 13.15 seconds per block. but 4secs for?
  const daysPerYear = 365;
  function getSupplyAPY(blockRate: number): Number {
    const supplyApy =
      (Math.pow(Number(blockRate) * blocksPerDay + 1, daysPerYear) - 1) * 100;
    return supplyApy;
  }

  function getBorrowAPY(blockRate: Number): Number {
    const supplyApy =
      (Math.pow(Number(blockRate) * blocksPerDay + 1, daysPerYear) - 1) * 100;
    return supplyApy;
  }
  const bal = formatEther(useEtherBalance(account)??0);
    //comptroller contract
    const comptroller = new Contract(
      address?.Comptroller,
      abi.newComptroller
    );

    //canto contract
    const priceFeedContract = new Contract(
      address?.PriceFeed,
      abi.cantoPriceOracle
    );
console.log(tokens)
  const calls =
    tokens?.map((token) => {
      const ERC20Contract = new Contract(token.underlying_address, abi.Erc20);

      //canto contract
      const cERC20Contract = new Contract(token.address, abi.newCERC20);

    
      return [
        {
          contract: cERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
        {
          contract: cERC20Contract,
          method: "borrowBalanceStored",
          args: [account],
        },
        {
          contract: cERC20Contract,
          method: "getCash",
          args: [],
        },
        {
          contract: cERC20Contract,
          method: "exchangeRateStored",
          args: [],
        },
        {
          contract: cERC20Contract,
          method: "supplyRatePerBlock",
          args: [],
        },
        {
          contract: cERC20Contract,
          method: "borrowRatePerBlock",
          args: [],
        },
        {
          contract: ERC20Contract,
          method: "allowance",
          args: [account, token.address],
        },
        {
          contract: comptroller,
          method: "markets",
          args: [token.address],
        },
        {
          contract: comptroller,
          method: "checkMembership",
          args: [account, token.address],
        },
        {
          contract: priceFeedContract,
          method: "getUnderlyingPrice",
          args: [token.address],
        },
      ];
    }) ?? [];
  // console.log(calls.flat());
  // const results = useCalls(wallet&& calls) ?? [];

  const globalCalls = [...calls.flat(), {
    contract: comptroller,
    method: "compAccrued",
    args:[account]
  }]
  
  const results = useCalls(typeof tokens == typeof cTokensBase ?  globalCalls : []) ?? {};

  if (account == undefined) {
    return [];
  }
  const chuckSize = results.length / cTokensBase.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value)
    let chunks = [];
    
    for (let i = 0; i < array.length; i += chunk_size) {
        chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks
  };
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const val =  processedTokens.map((tokenData,idx) => {
      const cash = Number(formatEther(tokenData[3][0]));
      const price = Number(formatEther(tokenData[10][0]));
      // const price = 1;
      const liquidity = cash * price;
      const balanceOfC : number = Number(formatEther(tokenData[0][0]));
      const balanceOf = cTokensBase[idx].symbol === "cCanto" ? bal : Number(formatEther(tokenData[1][0]));
      const exchangeRate = tokenData[4][0]/Math.pow(10,18 + cTokensBase[idx].underlying_decimals - cTokensBase[idx].decimals);
      const allowance = cTokensBase[idx].symbol === "cCanto" ? true : Number(formatEther(tokenData[7][0])) > 0;
      const collateralFactor = Number(formatEther(tokenData[8][1]));
      const isListed = tokenData[8][0];
      const borrowBalance = Number(formatEther(tokenData[2][0]));
      const supplyBalance =Number(formatEther(BigNumber.from(tokenData[4][0]).mul(tokenData[0][0]).div(BigNumber.from(10).pow(18 + cTokensBase[idx].underlying_decimals - cTokensBase[idx].decimals))) )
      const inSupplyMarket = balanceOfC > 0;
      const inBorrowMarket = borrowBalance > 0;
      const supplyBalanceinNote = supplyBalance * price;
      const borrowBalanceinNote = borrowBalance * price;
      const supplyAPY = getSupplyAPY(Number(formatEther(tokenData[5][0])));
      const borrowAPY = getBorrowAPY(Number(formatEther(tokenData[6][0])));
     
      return {
        data: cTokensBase[idx],
        wallet: account,
        balanceOf,
        balanceOfC,
        borrowBalance,
        exchangeRate,
        supplyBalance,
        liquidity,
        allowance,
        collateralFactor,
        inSupplyMarket,
        inBorrowMarket,
        supplyBalanceinNote,
        borrowBalanceinNote,
        collateral: tokenData[9][0],
        price,
        supplyAPY,
        borrowAPY,
        isListed
      };
    });
    let totalSupply = 0;
    let totalBorrow = 0;
    let totalBorrowLimit = 0;
    let totalBorrowLimitUsed = 0;
    val?.forEach((token) => {
        if (token?.inSupplyMarket) {
          totalSupply += token.supplyBalanceinNote;
        }
        if (token?.inBorrowMarket) {
          totalBorrow += token.borrowBalanceinNote;
        }
      
        if(token?.collateral){
          totalBorrowLimit += token.collateralFactor * token.supplyBalanceinNote;
          if(token?.inBorrowMarket){
            totalBorrowLimitUsed += token.borrowBalanceinNote;
          }
        }

      });
      const cantoAccrued = formatEther(results[results.length-1]?.value[0] ?? 1);
      const canto = val.find((item=>item.data.symbol == "cCanto"))
      const balance = {
        walletBalance : canto?.balanceOf,
        price : canto?.price,
        accrued : cantoAccrued,
        cantroller : address.Comptroller,
        wallet : account
      }
    return [val, { totalSupply, totalBorrow , totalBorrowLimit,totalBorrowLimitUsed, balance }]
  }

  //   results.forEach((result, idx) => {
  //     if (result && result.error) {
  //       console.error(
  //         `Error encountered calling 'totalSupply' on ${calls[idx][0].contract.address}: ${result.error.message}`
  //       );
  //     }
  //   });
  //   console.log(results)
  return undefined;
}
