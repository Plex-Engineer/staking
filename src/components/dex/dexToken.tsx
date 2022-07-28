import React from "react";
import { useState } from "react";
import styled from "styled-components";
import ReactModal from "react-modal";
import Popup from "reactjs-popup";
import TokenModal from "../modals/tokenModal";

interface Props {
  value?: String;
}

const Button = styled.div`
  background-color: #303030;
  padding: 0.3rem;
  font-size: 14px;
  text-align: center;

  &:hover {
    background-color: #404040;
    cursor: pointer;
  }
`;
const DexToken = (props: Props) => {
  const [value, setValue] = useState(props.value);
  const [isOpen, setIsOpen] = useState(false);

  console.log(value);
    return (
      <div>
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {value ? value : "Select"}
        </Button>
        <Popup
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
          nested
        >
          {/* <TokenModal onClose={(value )=>{
            setValue(value);
            setIsOpen(false);
          }}/> */}
        </Popup>
      </div>
    );
  

  
};

export default DexToken;
