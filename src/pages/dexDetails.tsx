import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border : 1px solid var(--primary-color);
    min-height: 100vh;
    margin: 3rem;
    `;

const MarketReadField = styled.div`
    display: flex;
    flex-direction: column;
    `;
const DexDetails = () => {
  return (
    <Container>
        <header>
            <div className="wrap">
                <p>del lp / notecanto</p>
                <h1>note/canto</h1>
            </div>
            <button>add liquidity</button>
        </header>
    <div className="graphBox">
        <div className="line-chart"></div>
        <div className="line-chart"></div>

    </div>
        <div className="boxes">
        <MarketReadField>
            <header>liquidity</header>
            <h2>$1233930</h2> <sup>+47%</sup>
        </MarketReadField>

        </div>
    </Container>
  )
}

export default DexDetails