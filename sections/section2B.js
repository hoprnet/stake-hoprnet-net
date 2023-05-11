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
} from '../config'
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
        <br />
        <p className=" css-9tmdd2">Starting <strong>{formatDateToCET(PROGRAM_START_MS)}</strong>, rewards can be claimed on each block. All rewards will be returned as
          {" "}<Link
            href="https://blockscout.com/poa/xdai/address/0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1/transactions"
            text="wxHOPR"
            openIcon
          /> tokens. xHOPR staked today will be locked until <strong>{formatDateToCET(PROGRAM_END_MS)}</strong>.<br/>
          
        </p>
        <br></br>
        <p>Increase your APR by redeeming NFTs to your account.
          {" "}<Link
            href="https://medium.com/hoprnet/hopr-nft-overview-4cacb3c19082"
            text="HOPR Boost NFTs"
            openIcon
          />{" "}can be earned by participating in events. Season {seasonNumber-2} and {seasonNumber-1} NFTs can be restaked in Season {seasonNumber} with the same APR boost. 
          NFTs from earlier seasons and the HODLr NFT have been discontinued. New rewards based on network rewards will be available soon. Check our
          {" "}<Link
            href="https://medium.com/hoprnet/hopr-staking-faqs-780edfd4f1e1"
            text=" staking FAQs"
            openIcon
          />.
        </p>
        <br></br>
        <p>
          You can swap xHOPR tokens via
          {" "}<Link
            href="https://swapr.eth.limo/#/swap?outputCurrency=0xd057604a14982fe8d88c5fc25aac3267ea142a08&chainId=100"
            text="Swapr"
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
        <br></br>
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
