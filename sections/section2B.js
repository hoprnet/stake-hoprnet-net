import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import Link from '../future-hopr-lib-components/Typography/link'
import Section from '../future-hopr-lib-components/Section'
import BalanceField from '../future-hopr-lib-components/BalanceField'
import Typography from '../future-hopr-lib-components/Typography';
import TableDataColumed from '../future-hopr-lib-components/Table/columed-data'


import { 
  seasonNumber, 
  baseAPRPercentage, 
  STAKING_SEASON_CONTRACT,
  PROGRAM_START_MS,
  PROGRAM_END_MS
} from '../staking-config'
import {
  countAPRPercentage,
  formatDateToCET
} from '../utils/functions'

const Amounts = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  .BalanceContainer{
     display: flex;
     gap: 6px;
     margin-bottom: 32px;
     justify-content: flex-left;
     width: 100%;
     flex-wrap: wrap;
  }
`

export default function Section2(props) {
  const {
    balance_xDAI,
    balance_xHOPR,
    balance_wxHOPR,
    balance_availableReward,
    balance_totalClaimedRewards,
    totalLocked,
    boostRate
  } = props;


  const boostAPRPercentage = countAPRPercentage(boostRate);
  const totalAPRPercentage = baseAPRPercentage + boostAPRPercentage;

  return (
    <Section
      id='section2'
    >
      <div className="chakra-container css-jf7n8r">
        <p className=" css-yvr15l">
          HOPR Staking Season {seasonNumber-1} has finished, to recover your xHOPR stake, locked NFTs and unclaimed wxHOPR rewards, visit
          {" "}<Link
            href={`https://stake-s${seasonNumber-1}.hoprnet.org`}
            text={`stake S${seasonNumber-1}`}
            openIcon
          />, connect your wallet and press “Unlock”. To restake, simply return to this site.
        </p>
        <h4>MAKE SURE TO STAKE FROM YOUR SEASON {seasonNumber-1} ADDRESS TO BE ELIGIBLE FOR EXTRA REWARDS</h4>
        <br />
        <p className=" css-9tmdd2">Starting <strong>{formatDateToCET(PROGRAM_START_MS)}</strong>, rewards can be claimed on each block. All rewards will be returned as
          {" "}<Link
            href="https://blockscout.com/poa/xdai/address/0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1/transactions"
            text="wxHOPR"
            openIcon
          /> tokens. xHOPR staked today will be locked untill <strong>{formatDateToCET(PROGRAM_END_MS)}</strong>.<br/>
          
        </p>
        <br></br>
        <p>Increase your APR by redeeming NFTs to your account. HOPR Boost NFTs can be earned by participating in events. Season 3 and 4 NFTs can be restaked in Season 5 with the same APR boost. Season 1 and 2 NFTs and the HODLr NFT have been discontinued. New NFTs based on your previous collection will be available soon.</p>
        <p>
          You can swap xHOPR tokens via
          {" "}<Link
            href="https://app.honeyswap.org/#/swap?inputCurrency=0xd057604a14982fe8d88c5fc25aac3267ea142a08&amp;chainId=100"
            text="HoneySwap"
            openIcon
          />{" "}
          or
          {" "}<Link
            href="https://ascendex.com/en/cashtrade-spottrading/usdt/hopr"
            text="AscendEX"
            openIcon
          />, and buy xDAI (needed for transactions) via
          {" "}<Link
            href="https://buy.ramp.network/"
            text="Ramp"
            openIcon
          />{" "}
          or
          {" "}<Link
            href="https://ascendex.com/en/cashtrade-spottrading/usdt/xdai"
            text="AscendEX"
            openIcon
          />. Unwrap wxHOPR rewards to xHOPR for restaking via
          {" "}<Link
            href="https://wrapper.hoprnet.org/"
            text="our token wrapper"
            openIcon
          />
          . Follow our
          {" "}<Link
            href="https://twitter.com/hoprnet"
            text="Twitter"
            openIcon
          />{" "}
          to learn about new events.
        </p>
        <p className=" css-2q8riv">
          Alternatively, you can convert your HOPR to xHOPR. For a complete list of bridging options, view our
          {" "}<Link
            href="https://docs.hoprnet.org/staking/convert-hopr"
            text="docs"
            openIcon
          />.
        </p>
      </div>
    </Section>
  )
}
