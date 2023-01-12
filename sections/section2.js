import React, { useState, useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section'
import Table from '../components/Table'
import styled from "@emotion/styled";

const balanceFormat = (input) => {
  //  console.log('balanceFormat', input)
  if (input === '-') return input
  if (input < 1) return parseFloat(input).toFixed(4);
  if (input < 10) return parseFloat(input).toFixed(3);
  if (input < 100) return parseFloat(input).toFixed(2);
  if (input < 1000) return parseFloat(input).toFixed(1);
  return '1000+'
};



const BalanceFieldContent = styled.div`
    background: rgba(10,10,10,0.25);
    padding: 8px;
    border-radius: 8px;
    width: 112px;
    flex-shrink: 0;
    .BalanceFieldLabel{
      display: flex;
      gap: 6px;
      .BalanceFieldLabelText {
        font-size: 14px;
      }
    }
  `

const BalanceField = (props) => {
  // console.log('BalanceField', props)
  return (
    <BalanceFieldContent
      className="BalanceFieldContent"
    >
      <div
        className="BalanceFieldLabel"
      >
        <img
          src={props.icon}
          className="BalanceFieldLabelIcon"
          width="18"
          height="18"
        />
        <div
          className="BalanceFieldLabelText"
        >
          {props.coin}: {props.value === "-" ? "______" : balanceFormat(props.value)}
        </div>
      </div>
    </BalanceFieldContent>
  )
};

const BalanceContainer = styled.div`
     display: flex;
     gap: 6px;
     margin-bottom: 32px;
     justify-content: center;
     width: 100%;
     flex-wrap: wrap;
   `


export default function Section2(props) {
  const {
    balance_xDAI,
    balance_xHOPR,
    balance_wxHOPR
  } = props;

  return (
    <Section
      id='section2'
      yellow
    >
      <BalanceContainer
        className='BalanceContainer'
      >
        <BalanceField
          coin="xDai"
          icon="../assets/coins/xdai.png"
          value={balance_xDAI}
        />
        <BalanceField
          coin="xHOPR"
          icon="../assets/coins/xdai.png"
          value={balance_xHOPR}
        />
        <BalanceField
          coin="wxHOPR"
          icon="../assets/coins/xdai.png"
          value={balance_wxHOPR}
        />
      </BalanceContainer>
      <div className="css-wc4a8h">
        <a target="_blank" rel="noopener" className="chakra-link css-h5mflc" href="https://medium.com/hoprnet/780edfd4f1e1">Read about HOPR staking <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a><a target="_blank" rel="noopener" className="chakra-link css-zc3qwu" href="https://blockscout.com/poa/xdai/address/0xd80fbbfe9d057254d80eebb49f17aca66a238e2d/transactions">Contract Address <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>
      </div>
      <div className="chakra-container css-jf7n8r"><div className="css-1ujp2k8"><h1 className="chakra-heading css-1dklj6k">HOPR Staking Season 5</h1><div className="css-70qvj9"><div className="css-fuucvi"><p className="chakra-text css-lw9n0p">Available Rewards  </p><div className="chakra-skeleton css-l5rgj7"><span className="css-1cqfahj">901276.5348</span></div> <p className="chakra-text css-dw5ttn">wxHOPR</p></div><div className="css-x1sij0"><p className="chakra-text css-lw9n0p">Total Staked  </p><div className="chakra-skeleton css-l5rgj7"><span className="css-1dubhyn">51920773.6417</span></div><p className="chakra-text css-dw5ttn">xHOPR</p></div></div></div><p className="chakra-text css-9tmdd2">Stake <a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://blockscout.com/poa/xdai/address/0xD057604A14982FE8D88c5fC25Aac3267eA142a08/transactions">xHOPR <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>tokens to earn a total APR of </p><div className="css-6n7j50"><p className="chakra-text css-nlttri">5.50%</p><p className="chakra-text css-17j5ckf">(2.50% base + </p><div className="chakra-skeleton css-1s1b24w"><p className="chakra-text css-hfnvxr">3.00% boosted</p></div><p className="chakra-text css-17j5ckf">)</p></div>.<p className="chakra-text css-yvr15l">HOPR Staking Season 4 has finished, to recover your xHOPR stake, locked NFTs and unclaimed wxHOPR rewards, visit <a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://stake-s4.hoprnet.org">stake S4 <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>, connect your wallet and press “Unlock”. To restake, simply return to this site.</p><h4 className="chakra-heading css-1xx8uxk">MAKE SURE TO STAKE FROM YOUR SEASON 4 ADDRESS TO BE ELIGIBLE FOR EXTRA REWARDS</h4><br/><p className="chakra-text css-9tmdd2">Starting </p><p className="chakra-text css-14644gy">Wed Oct 26 2022</p><p className="chakra-text css-9tmdd2">, rewards can be claimed on each block. All rewards will be returned as <a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://blockscout.com/poa/xdai/address/0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1/transactions">wxHOPR <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>tokens. xHOPR staked today will be locked for </p><p className="chakra-text css-14644gy">13 days.</p><p className="chakra-text css-2q8riv">Increase your APR by redeeming NFTs to your account. HOPR Boost NFTs can be earned by participating in events. Season 3 and 4 NFTs can be restaked in Season 5 with the same APR boost. Season 1 and 2 NFTs and the HODLr NFT have been discontinued. New NFTs based on your previous collection will be available soon.</p><p className="chakra-text css-2q8riv">You can swap xHOPR tokens via<a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://app.honeyswap.org/#/swap?inputCurrency=0xd057604a14982fe8d88c5fc25aac3267ea142a08&amp;chainId=100">HoneySwap <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>or<a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://ascendex.com/en/cashtrade-spottrading/usdt/hopr">AscendEX <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>, and buy xDAI (needed for transactions) via <a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://buy.ramp.network/">Ramp <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>or<a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://ascendex.com/en/cashtrade-spottrading/usdt/xdai">AscendEX <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>. Unwrap wxHOPR rewards to xHOPR for restaking via <a target="_blank" rel="noopener" className="chakra-link css-g28d8g" href="https://wrapper.hoprnet.org/">our token wrapper <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>. Follow our <a className="chakra-link css-f4h6uy" href="https://twitter.com/hoprnet">Twitter <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>to learn about new events.</p><p className="chakra-text css-2q8riv">Alternatively, you can convert your HOPR to xHOPR. For a complete list of bridging options, view our <a className="chakra-link css-f4h6uy" href="https://docs.hoprnet.org/staking/convert-hopr\">docs <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></g></svg></a>.</p></div>
    </Section>
  )
}
