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
      yellow
    >
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
      <br></br>
      {/* <Amounts>
        <div>
          <Typography>
            Your wallet
          </Typography>
          <div
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
          </div>
        </div>
        <div>
          <Typography>
            Staking Season {seasonNumber}
          </Typography>
          <div
            className='BalanceContainer'
          >
            <BalanceField
              coin="Available Rewards"
              icon="../assets/coins/xdai.png"
              value={currentRewardPool}
            />
            <BalanceField
              coin="Total Staked"
              icon="../assets/coins/xdai.png"
              value={totalLocked}
            />
          </div>
        </div>
      </Amounts> */}
      <div className="css-wc4a8h">
        <Link
          href="https://medium.com/hoprnet/780edfd4f1e1"
          text="Read about HOPR staking"
          openIcon
        />{" "}
        <Link
          href={`https://blockscout.com/poa/xdai/address/${STAKING_SEASON_CONTRACT}/transactions`}
          text="Contract Address"
          openIcon
        />
      </div>
      <div className="chakra-container css-jf7n8r">
      <br/>
        <p className=" css-9tmdd2">
          Stake
          {" "}<Link
            href="https://blockscout.com/poa/xdai/address/0xD057604A14982FE8D88c5fC25Aac3267eA142a08/transactions"
            text="xHOPR"
            openIcon
          />{" "}
          tokens to earn a total APR of {totalAPRPercentage.toFixed(2)}% ({baseAPRPercentage.toFixed(2)}% base + {boostAPRPercentage.toFixed(2)}% boosted)</p>
      </div>
    </Section>
  )
}
