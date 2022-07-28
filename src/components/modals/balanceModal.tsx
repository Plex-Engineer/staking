import styled from "styled-components";
import logo from "assets/logo.svg";
import { noteSymbol } from "utils";
import { useClaim } from "hooks/useTransaction";
const Container = styled.div`
  background-color: #040404;
  height: 36rem;
  width: 26rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  /* padding: 1rem; */
  .title {
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.1em;
    text-transform: lowercase;
    color: var(--primary-color);
    margin-bottom: 2rem;
    /* margin-top: 0.3rem; */
    width: 100%;
    background-color: #06fc991a;
    padding: 1rem;
    border-bottom: 1px solid var(--primary-color);
  }
  .balances {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: end;
    width: 18rem;
  }
  .bal {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }
  .type {
    color: #8b8b8b;
  }
  .value {
    color: var(--primary-color);
  }
  .line {
    border-bottom: 1px solid #222;
  }
  .logo {
    /* padding: 1rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-color);
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-bottom: 1.2rem;
  }
  .mainBalance {
    color: white;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 120%;
    margin-bottom: 0.4rem;
  }
  .secondaryBalance {
    font-weight: 300;
    font-size: 16px;
    line-height: 120%;
    color: #cdcdcd;
  }
`;

const Button = styled.button`
  font-weight: 400;
  width: 18rem;
  font-size: 22px;
  color: black;
  background-color: var(--primary-color);
  padding: 0.6rem;
  border: 1px solid var(--primary-color);
  margin: 2rem;
  /* margin: 3rem auto; */

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;
interface Props {
  value : any | undefined;
}
const BalanceModal = ({value} : Props) => {
const {send, state} = useClaim(value.cantroller);

  return (
    <Container>
      <div className="title">canto balance</div>
      <div className="logo">
        <img src={logo} height={30} />
      </div>
      <p className="mainBalance">{Number(value.walletBalance).toFixed(2)}</p>
      <p className="secondaryBalance">{noteSymbol}{Number(value.price * value.walletBalance).toFixed(2)}</p>
      <div className="balances">
        <div className="bal line">
          <p className="type">wallet balance</p>
          <p className="value">{Number(value.walletBalance).toFixed(2)}</p>
        </div>
        <div className="bal line">
          <p className="type">unclaimed balance</p>
          <p className="value">{Number(value.accrued).toFixed(2)}</p>
        </div>
        <div className="bal">
          <p className="type">value</p>
          <p className="value">{noteSymbol} {Number(value.price * value.accrued).toFixed(2)}</p>
        </div>
      </div>
      <Button onClick={()=>{
        console.log(value)
        send(value.wallet)
      }}>claim</Button>
    </Container>
  );
};

export default BalanceModal;
