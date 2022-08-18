import { Children } from "react";
import styled from "styled-components";

const Table = styled.table`
  border: none;
  border: var(--primary-color) solid 1px;
  box-shadow: 0px 0px 10px #94ffb241;
  margin: 5px auto;
  color: var(--primary-color);
  width: calc(100% - 10px);
  text-align: center;
  border-collapse: collapse;
  border-spacing: 0;
  text-shadow: none;
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
    background-color: black;
    border-bottom: var(--primary-color) solid 1px;
  }
  img {
    opacity: 0;
    transition: all 0.3s ease;
  }
  td:first-child,
  th:first-child {
    padding-left: 2rem;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  tbody {
    border: var(--primary-color) solid 1px;
    tr {
      transition: all 0.15s ease-in;
      img {
        opacity: 0;
      }
      &:hover {
        background-color: #14392a;
        cursor: pointer;
        img {
          opacity: 1;
        }
      }
    }
  }
  @media (max-width: 1000px) {
    width: 800px;
    margin: 0 2rem;
  }
`;
interface Props {
  columns: string[];
  children: React.ReactNode;
  isLending: boolean;
}

const LendingTable = (props: Props) => {
  return (
    <div
      style={{
        overflowX: "auto",
        width: "100%",
      }}
    >
      <Table>
        <thead>
          <tr>
            {props.columns.map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </Table>
    </div>
  );
};

export default LendingTable;
