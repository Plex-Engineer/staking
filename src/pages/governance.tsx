import GovBar from "components/governance/govBar";
import GovModal from "components/governance/govModal";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";
import { StyledPopup } from "./bridge";
import { nodeURL
 } from "utils/nodeTransactions";
import { generateEndpointProposals, generateEndpointProposalTally } from "@tharsis/provider";


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

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 1rem;
    column-gap: 0.8rem;
  }
`;
const Governance = () => {

    const [isOpen, setIsOpened] = useState(false)
    const [proposals, setProposals] = useState([]);
    // const nodeURL = "http://143.198.3.19:1317";

    async function getProposals() {
     
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    const proposals = await fetch(
        nodeURL + generateEndpointProposals(),
        options
    ).then(function(response) {
        return response.json();
      });

    setProposals(proposals.proposals);

    }

    async function queryTally(proposalID:string) {
      const options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      }
      
      const tally = await fetch(
          nodeURL + generateEndpointProposalTally(proposalID),
          options
      );
        //THIS TALLY CAN BE ADDED TO THE END OF PROPOSALS THAT ARE NOT YET FINISHED SO WE CAN CALCULATE PERCENTAGES OF VOTES
        // setProposals(proposals.find())
      console.log(await tally.json());
  }
  ///IF PROPOSAL IS NOT FINISHED, WE MUST USE QUERY TALLY TO GET CURRENT VOTES
    useEffect(() => {
      getProposals();
      queryTally('3')
    }, []);

    useEffect(() => {
      if (proposals) {
        let pending = proposals.map(async (proposal:any) => {
          if (!proposal.final_tally_result) {
            await queryTally(proposal.proposal_id)
          }
        })
      }
    }, [proposals])

    console.log(proposals)

    function AllGovBars() {
      return (
       <React.Fragment>
          {!proposals? "" :proposals.map((proposal: any) => {
            let yes = Number(proposal.final_tally_result.yes);
            let no = Number(proposal.final_tally_result.no);
            let abstain= Number(proposal.final_tally_result.abstain);
            let veto =  Number(proposal.final_tally_result.no_with_veto);
            let totalVotes = yes + no + abstain + veto;
            return (
            <GovBar
            key={proposal.proposal_id}
              name= {proposal.content.title}
              proposalID= {proposal.proposal_id}
              yesPecterage={100 * yes/totalVotes}
              noPecterage={100* no/totalVotes}
              vetoPecterage={100*veto/totalVotes}
              abstainPecterage={100*abstain/totalVotes}
              startDate={proposal.voting_start_time}
              endDate = {proposal.voting_end_time}
              didEnd = {proposal.final_tally_result}
            />
            )
          })}
       </React.Fragment>
      )
    }


  return (
    <Container>
      <div className="title">&gt;_governance_</div>
      <button onClick={()=>{
        setIsOpened(true);
      }}>create a new vote</button>
      <div className="grid">
        <AllGovBars/>
      {/* <GovBar
      
          yesPecterage={50}
          noPecterage={0}
          vetoPecterage={10}
          abstainPecterage={40}
        />
                <GovBar
          yesPecterage={30}
          noPecterage={20}
          vetoPecterage={10}
          abstainPecterage={40}
        />
                <GovBar
          yesPecterage={30}
          noPecterage={20}
          vetoPecterage={10}
          abstainPecterage={40}
        />
                <GovBar
          yesPecterage={30}
          noPecterage={20}
          vetoPecterage={10}
          abstainPecterage={40}
        />
                <GovBar
          yesPecterage={30}
          noPecterage={20}
          vetoPecterage={10}
          abstainPecterage={40}
        />
                <GovBar
          yesPecterage={30}
          noPecterage={20}
          vetoPecterage={10}
          abstainPecterage={40}
        />
                <GovBar
          yesPecterage={30}
          noPecterage={20}
          vetoPecterage={10}
          abstainPecterage={40}
        />
                <GovBar
          yesPecterage={30}
          noPecterage={20}
          vetoPecterage={10}
          abstainPecterage={40}
        /> */}
      </div>

      <StyledPopup open={isOpen} onClose={()=>{
            setIsOpened(false)
        }}>
        <GovModal/>
      </StyledPopup>
    </Container>
  );
};

export default Governance;
