import { Helmet } from "react-helmet-async"
import { useBlockNumber, useEtherBalance, useEthers } from "@usedapp/core"
import { useEffect } from "react"
import { useTokens } from "hooks/useTokens"
const Developers = () => {
const {account} = useEthers();
const blockNumber = useBlockNumber()
// console.log(blockNumber)
  useEffect(
    ()=>{
      console.log(blockNumber + "useEffect")

    }, [blockNumber]
  )
  return (
   <div>
     <Helmet>
       <title>for Developers</title>
       
     </Helmet>

     <div style={{
        display: "grid",
        gridTemplateColumns: "500px 500px 500px",
        gap: "2rem",
        color: "white",
     }}
     >
       
       
     </div>
     

     <p>{}</p>
   </div>
  )
}

export default Developers