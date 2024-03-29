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
  const roundARP = (apr) => {return (Math.round(apr*4)/4).toFixed(2) }

  return (
    <Section
      id='section2'
      yellow
    >
      <div className="css-wc4a8h">
        <Link
          href="https://medium.com/hoprnet/780edfd4f1e1"
          text="Read about HOPR staking"
          openIcon
        />{" "}
        <Link
          href={`https://gnosisscan.io/address/${STAKING_SEASON_CONTRACT}`}
          text="Contract Address"
          openIcon
        />
      </div>
      <div className="chakra-container css-jf7n8r">
      <br/>
        <p className=" css-9tmdd2">
          Stake
          {" "}<Link
            href="https://gnosisscan.io/address/0xD057604A14982FE8D88c5fC25Aac3267eA142a08"
            text="xHOPR"
            openIcon
          />{" "}
          tokens to earn a total APR of <strong>{roundARP(totalAPRPercentage)}%</strong> (<strong>{roundARP(baseAPRPercentage)}%</strong> base + <strong>{roundARP(boostAPRPercentage)}%</strong> boosted)</p>
      </div>
      <br></br>
      <TableDataColumed>
        <tbody>
          <tr>
            <th>Wallet Balance</th>
            <td>{balance_xHOPR ? balance_xHOPR : '-'} xHOPR</td>
          </tr>
          <tr>
            <th></th>
            <td>{balance_wxHOPR ? balance_wxHOPR : '-'} wxHOPR</td>
          </tr>
          <tr>
            <th></th>
            <td>{balance_xDAI ? balance_xDAI : '-'} xDAI</td>
          </tr>
        </tbody>
        <tbody>
            <tr>
              <th>Available Rewards</th>
              <td>{balance_availableReward} wxHOPR</td>
            </tr>
            <tr>
              <th>Claimed Rewards</th>
              <td>{balance_totalClaimedRewards} wxHOPR</td>
            </tr>
            <tr>
              <th>Total Staked</th>
              <td>{totalLocked} xHOPR</td>
            </tr>
          </tbody>
      </TableDataColumed>

    </Section>
  )
}
