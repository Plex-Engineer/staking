import {useState} from 'react'
import { Typewriter } from "react-simple-typewriter";
import { Textfit } from "react-textfit";
const Typer = () => {
  const [refresh, setRefresh] = useState(0);

  const title = `>_without the freedom to participate in the global financial system,
  humans do not live free. The years leading up to the great depression
  democratized participation in the financial system, but technology was
  not sufficiently advanced for this democratiziation to be feasible. In
  response to the resulting economic collapse, the governments of the
  world imposed heavy restrictions of personal financial choices. As
  technology advanced, these regulations became less and less necessary.
  The final breakthrough was the adoption of transparent, decentralized
  and expressive blockchains, primarily pioneered by Vitalik Buterin. We
  have achieved the technology level required support broadly
  participatory capitalism. The Canto movement believes that liqudity in
  post traditional financial systems should be a free public good.
  Utilized by all, rentiered by none`;
  
  return (
    <Textfit className="typing" mode="multi" max={300} min={14}>
        <Typewriter
          typeSpeed={30}
          cursor
          cursorStyle="_"
          onType={(e) => {
            setRefresh(refresh + 1);
          }}
          words={[title]}
        />
      </Textfit>
  )
}

export default Typer