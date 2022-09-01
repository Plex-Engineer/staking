import { CantoMainnet } from "cantoui";
import { useEffect, useState } from "react";
import { useNetworkInfo } from "stores/networkinfo";
import { addNetwork } from "stores/utils/addCantoToWallet";
import { generatePubKey } from "utils/transactions";

export const GenPubKey = () => {
  const [pubKeySuccess, setPubKeySuccess] = useState("");
  const [wasNotConnected, setWasNotConnected] = useState(false);
  const networkInfo = useNetworkInfo();

  useEffect(() => {
    if (
      Number(networkInfo.chainId) == CantoMainnet.chainId &&
      wasNotConnected
    ) {
      setPubKeySuccess(
        "connected to canto network! click above to generate a public key"
      );
    }
  }, [networkInfo.chainId]);

  return (
    <p
      hidden={networkInfo.hasPubKey}
      style={{
        color: "#b73d3d",
        fontWeight: "bold",
        paddingTop: "15px",
        textShadow: "0px 0px black",
      }}
    >
      please{" "}
      <a
        style={{ color: "red", textDecoration: "underline", cursor: "pointer" }}
        onClick={() => {
          if (!networkInfo.account) {
            setPubKeySuccess("please connect wallet");
          } else if (Number(networkInfo.chainId) != CantoMainnet.chainId) {
            addNetwork();
            setPubKeySuccess("switch to canto network");
            setWasNotConnected(true);
          } else {
            generatePubKey(networkInfo.account, setPubKeySuccess);
          }
        }}
      >
        generate a public key
      </a>{" "}
      before staking
      <div>{pubKeySuccess}</div>
    </p>
  );
};
