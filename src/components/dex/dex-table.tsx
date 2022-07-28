import { Children } from "react";
import styled from "styled-components";

const Table = styled.table`
  & {
    border: none;
    /* border: var(--primary-color) solid 1px; */
    margin: 5px auto;
    width: 1204px;
    color: var(--primary-color);
    text-align: center;
    border-collapse: collapse;
    border-spacing: 0;
  }
  thead {
    text-transform: lowercase;
    font-size: 14px;
    background-color: #06fc9a1b;

  }
  th {
    padding: 8px;
    font-weight: 400;
    line-height: 1rem;
  }

  tr {
    font-size: 14px;
    font-weight: 400;
    line-height: 4rem;
    border-bottom: var(--primary-color) solid 1px;
  }

  tbody {
    border: var(--primary-color) solid 1px;

    tr:hover {
      
      background-color: #06fc9a1b;
      cursor: pointer;
    
    }
  }
  @media (max-width: 1000px){
   width: 800px;
   margin: 0 2rem;
  }
 
`;
type Props = {
  children: React.ReactNode;
};

const DexTable: React.FC<Props> = (props) => {
  return (
    <div style={{
      overflowX: "auto",
    }}>
      <Table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>TVL</th>
          <th>APR</th>
          <th>Position</th>
          <th>% Share</th>
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </Table>
    </div>
  );
};

export default DexTable;
