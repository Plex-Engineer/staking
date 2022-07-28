import styled from "styled-components";
import { useState } from "react";
import { TrasanctionType } from "components/lending/BorrowLimits";
import { formatBalance } from "utils";

type styleProps = {
    focused : boolean;
}
const Container = styled.div<styleProps>`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.focused ? '#001A0E' : '#191919'};
  border: ${props => props.focused ? '1px solid #06FC99' : '1px solid #191919'};
  color: #efefef;
  height: 100px;
  flex: 1;
  padding: 0 1rem;
  margin: 1px;
  justify-content: space-around;

  &:hover {
    background-color: #001A0E;
    cursor: text;
    input {
        background-color: #001A0E !important;
    }
  }
  input[type="text"] {
    background-color: ${props => props.focused ? '#001A0E' : '#191919'};
    font-size: 24px;
    width: 100%;
    border: none;
    font-weight: 300;
    color: ${props => props.focused ? 'var(--primary-color)' : '#efefef'};
    &:focus {
      outline: none;
    }
  }

 

  p{
      color:#6F6F6F;
      letter-spacing: -0.03em;
      text-align: right;
      font-size: 16px;
  }
`;

const Max = styled.span`
  color : #6F6F6F;
  font-size: 22px;
  &:hover {
    color: var(--primary-color);
    cursor: pointer;
  }
`

type Props = {
  balance: number;
  type?: string;
  hasToken?: boolean;
  token?: any;
  limit ?:number
  transactionType : TrasanctionType
  onChange?: (value: string) => void;
  onMax: (value : number) => void;
  value : string
};

const LendingField = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  //used for showing whatever max value they can input
  const [remaining, setRemaining] = useState(props.balance);
  const [value, setValue] = useState(props.value);
  const InputValue = () => (<input
  type="text"
  placeholder={"0.00"}
  autoFocus={isFocused}
  value={value}
  onFocus={() => {
    setIsFocused(true);
  }}
  onChange={(e) => {
    setValue(e.target.value);

    if(Number(e.target.value) > props.balance || isNaN(Number(e.target.value))) {
      setRemaining(0);
    } else {
      setRemaining(props.balance - Number(e.target.value));
    }
    if(props.onChange != undefined){
      props.onChange(e.target.value);
    }
  }}
  onBlur={() => {
    setIsFocused(false);
    }}
/>);
  return (
    <Container onClick={()=>setIsFocused(true)} focused={isFocused}>
      <div
        style={{
          display: "flex",
        }}
      >
        <InputValue />
        
      </div>
 
      <div style={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <p>{formatBalance(remaining)}
        </p>
        <p>
          <Max onClick={()=>{
             if(props.limit != undefined){
              setValue(props.limit.toString());
            }else {
              setValue(props.balance.toString());
            }
            props.onMax(props.balance);
         
          setRemaining(0);
        }}>{(props.transactionType != TrasanctionType.BORROW ) && props.limit === undefined || (props.transactionType == TrasanctionType.REPAY) ? "max" : "80% limit"}</Max></p>
      </div>
    
    </Container>
  );
};

export default LendingField;
