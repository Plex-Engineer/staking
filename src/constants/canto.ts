import Aqua from "assets/icons/aqua.png";
import Fiji from "assets/icons/fiji.png";
import Evian from "assets/icons/evian.png";
import WETH from "assets/icons/ETH.svg";
import NOTE from "assets/icons/note.png";
import CANTO from "assets/icons/canto.png";

export const icons = {
  Aqua: Aqua,
  Fiji: Fiji,
  Evian: Evian,
  WETH: WETH,
  Note: NOTE,
  CANTO: CANTO,
};

export const address = {
  testnetBackup: {
    PriceFeed: "0xa0ab4b24299851aAFa509CFc2bCE3CdCA2200de6",
    Comptroller: "0x7820971feb97f8f1C18A51d02058fEF92be57435",
    cCanto: "0x81f5e25eDee93b1C3C4E4FfB43EDBE89D8bB7a00",
    WETH: "0xb35D914B42D13EfFd802049A6610673402bBC513",
    Aqua: "0x907a4036909d0a940f032f916b180e8002065C79",
    Fiji: "0xE79e2c0d74d2778e7CceDC38ca075732d16916D2",
    Evian: "0xac2CCc249bbbfcA9f6F7eFBCFEE747fe88D7bFcA",
    Note: "0x7094125d250AF1FbD82640b1cA986f0b591508dc",
    cAqua: "0x58953D2E5D19c960cC7A45e8Bf40D44BeA0A696B",
    cFiji: "0x933dFA46Ce7cA5e441257a260c0F506cCdd73C32",
    cEvian: "0x29375E0135e50AEb96bBF23C578649B91A9C84b3",
    cNote: "0x7a35088BE5a6E42D9C44378E3Ba193c34Ff031D4",
  },
  testnet : {
    PriceFeed: "0x867a24A5Aeea55D10Fd20F2783967febbE529192",
    Comptroller: "0x61cD7e61e81FBe6fabEBAEb0557f756D260e65f8", 
    cCanto: "0x43F852304BbfeD0790F4F183EFF97ffDFBF3B58E", 
    WETH: "0xF67224535c15fCd0926DFFE71AA328db7DFED6E1", 
    Note: "0x937cbbCACA2ecF8EdFEfD30ABE4421e3d113B31C", 
    cNote: "0xEEe0aD21443a59E7836e70AbA5b645288e071156", 
    Aqua: "0x9EB8041Cb63C50C6169a641fb55480C17D52Fc86",
    Fiji: "0x94B0502F6aC1D935C04D3396f2E2A5AafFAA0a31",
    Evian: "0x819755cb4f08cd71fd98eCBc59Ed2972c3B2F888",
    cAqua: "0xCBEF1A86fC6A9f72C71215711D4948C8abc87588",
    cFiji: "0xEB93b62Ea40ABdF05af5a6B05f420de50D504D6F",
    cEvian: "0x859239bbc6dD38842b32674C357686eC1483e08A",
    USDC: "0x1604D9703da4EdDAeF89c5f2426A82663F1d05a2",
    cWETH: "0xD73FD833d4fE2F24063D8Cf63BD38f8ECD7dE0D7",
    BaseV1Factory: "0x1Cbc416aa709543A1D808c98BBDd36d3561675b5",
    AccountantDelegator: "0xc308202d5190Ff5a6e0BC1d9Cd34890EBbf5A39b",
  },
  cantoMainnet: {
    PriceFeed: "",
    Comptroller: "",
    Note: "",
    cNote: "",
    USDC: "",
    cUSDC: "",
    Atom: "",
    cAtom: "",
    USDT: "",
    cUSDT: "",
    ETH: "",
    cETH: "",
    cCanto: "",
    CantoNoteLP: "",
    cCantoNoteLP: "",
    CantoAtomLP: "",
    cCantoAtomLP: "",
    USDCNoteLP: "",
    cUSDCNoteLP: "",
    USDTNoteLP: "",
    cUSDTNoteLP: "",
    CantoETHLP: "",
    cCantoETHLP: "",
  }
};


export const decimals = {
  cAqua: 18,
  cFiji: 18,
  cEvian: 18,
  cNote: 18,
  cCANTO: 18,
  Aqua: 18,
  Fiji: 18,
  Evian: 18,
  Note: 18,
  CANTO: 18,
};

export const cTokensBase = [
  {
    name: "Canto Aqua",
    symbol: "cAqua",
    address: address.testnet.cAqua,
    decimals: decimals.cAqua,
    underlying_name: "Aqua",
    underlying_symbol: "AQUA",
    underlying_address: address.testnet.Aqua,
    underlying_decimals: decimals.Aqua,
    icon: icons.Aqua,
  },
  {
    name: "Canto Fiji",
    symbol: "cFiji",
    address: address.testnet.cFiji,
    decimals: decimals.cFiji,
    underlying_name: "Fiji",
    underlying_symbol: "FIJI",
    underlying_address: address.testnet.Fiji,
    underlying_decimals: decimals.Fiji,
    icon: icons.Fiji,
  },
  {
    name: "Canto Evian",
    symbol: "cEvian",
    address: address.testnet.cEvian,
    decimals: decimals.cEvian,
    underlying_name: "Evian",
    underlying_symbol: "EVIAN",
    underlying_address: address.testnet.Evian,
    underlying_decimals: decimals.Evian,
    icon: icons.Evian,
  },
  // {
  //   name: "Canto Note",
  //   symbol: "cNote",
  //   address: address.testnet.cNote,
  //   decimals: decimals.cNote,
  //   underlying_name: "Note",
  //   underlying_symbol: "NOTE",
  //   underlying_address: address.testnet.Note,
  //   underlying_decimals: decimals.Note,
  //   icon: icons.Note,
  // },
  {
    name: "Canto Canto",
    symbol: "cCanto",
    address: address.testnet.cCanto,
    decimals: decimals.cCANTO,
    underlying_name: "Canto",
    underlying_symbol: "CANTO",
    underlying_address: address.testnet.Evian, //TODO : fix underlying
    underlying_decimals: decimals.CANTO,
    icon: icons.CANTO,
  },
];

const mainNetDecimals = {
  Note: 18,
  cNote: 18,
  USDC: 18,
  cUSDC: 18,
  Atom: 18,
  cAtom: 18,
  USDT: 18,
  cUSDT: 18,
  ETH: 18,
  cETH: 18,
  cCanto: 18,
  CantoNoteLP: 18,
  cCantoNoteLP: 18,
  CantoAtomLP: 18,
  cCantoAtomLP: 18,
  USDCNoteLP: 18,
  cUSDCNoteLP: 18,
  USDTNoteLP: 18,
  cUSDTNoteLP: 18,
  CantoETHLP: 18,
  cCantoETHLP: 18,
  CANTO: 18
}



export const mainnetBasecTokens = [
  {
    name: "Canto Note",
    symbol: "cNote",
    address: address.cantoMainnet.cNote,
    decimals: mainNetDecimals.cNote,
    underlying_name: "Note",
    underlying_symbol: "NOTE",
    underlying_address: address.cantoMainnet.Note,
    underlying_decimals: mainNetDecimals.Note,
    icon: icons.Note,
  },
  {
    name: "Canto USDC",
    symbol: "cUSDC",
    address: address.cantoMainnet.cUSDC,
    decimals: mainNetDecimals.cUSDC,
    underlying_name: "USDC",
    underlying_symbol: "USDC",
    underlying_address: address.cantoMainnet.USDC,
    underlying_decimals: mainNetDecimals.USDC,
    icon: icons.Note,
  },
  {
    name: "Canto Atom",
    symbol: "cAtom",
    address: address.cantoMainnet.cAtom,
    decimals: mainNetDecimals.cAtom,
    underlying_name: "Atom",
    underlying_symbol: "Atom",
    underlying_address: address.cantoMainnet.Atom,
    underlying_decimals: mainNetDecimals.Atom,
    icon: icons.Note,
  },
  {
    name: "Canto USDT",
    symbol: "cUSDT",
    address: address.cantoMainnet.cUSDT,
    decimals: mainNetDecimals.cUSDT,
    underlying_name: "USDT",
    underlying_symbol: "USDT",
    underlying_address: address.cantoMainnet.USDT,
    underlying_decimals: mainNetDecimals.USDT,
    icon: icons.Note,
  },
  {
    name: "Canto ETH",
    symbol: "cETH",
    address: address.cantoMainnet.cETH,
    decimals: mainNetDecimals.cETH,
    underlying_name: "ETH",
    underlying_symbol: "ETH",
    underlying_address: address.cantoMainnet.ETH,
    underlying_decimals: mainNetDecimals.ETH,
    icon: icons.Note,
  },
  {
    name: "Canto Canto",
    symbol: "cCanto",
    address: address.cantoMainnet.cCanto,
    decimals: mainNetDecimals.cCanto,
    underlying_name: "Canto",
    underlying_symbol: "CANTO",
    underlying_address: address.cantoMainnet.ETH,
    underlying_decimals: mainNetDecimals.CANTO,
    icon: icons.Note,
  },
  {
    name: "Canto CantoNoteLP",
    symbol: "cCantoNoteLP",
    address: address.cantoMainnet.cCantoNoteLP,
    decimals: mainNetDecimals.cCantoNoteLP,
    underlying_name: "CantoNoteLP",
    underlying_symbol: "CantoNote",
    underlying_address: address.cantoMainnet.CantoNoteLP,
    underlying_decimals: mainNetDecimals.CantoNoteLP,
    icon: icons.Note,
  },
  {
    name: "Canto CantoAtomLP",
    symbol: "cCantoAtomLP",
    address: address.cantoMainnet.cCantoAtomLP,
    decimals: mainNetDecimals.cCantoAtomLP,
    underlying_name: "CantoAtomLP",
    underlying_symbol: "CantoAtom",
    underlying_address: address.cantoMainnet.CantoAtomLP,
    underlying_decimals: mainNetDecimals.CantoAtomLP,
    icon: icons.Note,
  },
  {
    name: "Canto USDCNoteLP",
    symbol: "cUSDCNoteLP",
    address: address.cantoMainnet.cUSDCNoteLP,
    decimals: mainNetDecimals.cUSDCNoteLP,
    underlying_name: "USDCNoteLP",
    underlying_symbol: "USDCNote",
    underlying_address: address.cantoMainnet.USDCNoteLP,
    underlying_decimals: mainNetDecimals.USDCNoteLP,
    icon: icons.Note,
  },
  {
    name: "Canto USDTNoteLP",
    symbol: "cUSDTNoteLP",
    address: address.cantoMainnet.cUSDTNoteLP,
    decimals: mainNetDecimals.cUSDTNoteLP,
    underlying_name: "USDTNoteLP",
    underlying_symbol: "USDTNote",
    underlying_address: address.cantoMainnet.USDTNoteLP,
    underlying_decimals: mainNetDecimals.USDTNoteLP,
    icon: icons.Note,
  },
  {
    name: "Canto CantoETHLP",
    symbol: "cCantoETHLP",
    address: address.cantoMainnet.cCantoETHLP,
    decimals: mainNetDecimals.cCantoETHLP,
    underlying_name: "CantoETHLP",
    underlying_symbol: "CantoETH",
    underlying_address: address.cantoMainnet.CantoETHLP,
    underlying_decimals: mainNetDecimals.CantoETHLP,
    icon: icons.Note,
  },
];


export const gravityTokenBase = [
  {
    icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/1.png",
    name: "E2H",
    address : "0x30dA8589BFa1E509A319489E014d384b87815D89"
  },
  {
    icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/2.png",
    name: "BYE",
    address : "0x9676519d99E390A180Ab1445d5d857E3f6869065"
  },
  {
    icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/3.png",
    name: "MAX",
    address : "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609"
  }
]

export const mainnetGravityTokensBase = [
  {
    icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/1.png",
    name: "USDT",
    address : "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  },
  {
    icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/2.png",
    name: "USDC",
    address : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  },
  {
    icon: "https://s2.coinmarketcap.com/static/img/coins/32x32/3.png",
    name: "ETH",
    address : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  }
]

export const networkProperties = [
  {
    name: "Canto Testnet",
    testnet: true,
    symbol: "CANTO",
    network : 7722,
    tokens : cTokensBase,
    address : address.testnet
  },
  {
    name: "Etheruem Mainnet",
    testnet: false,
    symbol: "ETH",
    network : 1,
    gravityTokens : mainnetGravityTokensBase,
    address : address.testnetBackup

  },
  {
    name: "Gravity Bridge Testnet",
    testnet: true,
    symbol: "DIODE",
    network : 15,
    gravityTokens: gravityTokenBase,
    address : address.testnet
  },
  {
    name: "Canto Mainnet",
    testnet: false,
    symbol: "CANTO",
    network: 0,
    tokens: mainnetBasecTokens,
    address: address.cantoMainnet
  }
]