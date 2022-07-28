import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    --primary-color : red;

    body {
        margin: 0;
        padding: 0;     
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        background-color: black;

        /* background: repeating-linear-gradient(
 0deg,
  #606dbc,
  #606dbc 10px,
  #465298 10px,
  #465298 20px
); */
    }
    `;

export default GlobalStyles;
