import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {useNavigate} from 'react-router-dom';
interface ButtonProps {
    primary?: boolean;
  }

const Button = styled.button<ButtonProps>`
  background-color: ${(props) => (props.primary ? "black" : "var(--primary-color);")};
  font-size: 14px;

  border: none;
  color: ${(props) => (props.primary ? "var(--primary-color)" : "black")};
  border: ${(props) => (props.primary ? "var(--primary-color) solid 1px" : "none")};
  padding: .3rem;
  margin: .2rem;
  font-weight: 500;
  /* text-shadow: ${(props) => (props.primary ? "1px 1px 2px green, 0 0 1em green, 0 0 0.2em green" : "1px 1px 1px #00B665, 0 0 1px #00B665, 0 0 1px #00B665")}; */

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }
`;


interface DexProps {
    assetName : string,
    totalValueLocked: string,
    position: string,
    apr: string,
    share : string
}
const DexRow = (props : DexProps) => {
  let navigate = useNavigate();
    return (
    <tr onClick={()=>{
      //redirects to asset's details page
      let assetName = props.assetName.replace('/','+');
      navigate(`/dex/${assetName}`);      
    }}>
        <td>{props.assetName}</td>
        <td>{props.totalValueLocked}</td>
        <td>{props.apr} %</td>
        <td>{props.position}</td>
        <td>{props.share} %</td>
      </tr>);
}

export default DexRow;

