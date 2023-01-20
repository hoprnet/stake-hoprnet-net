import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import Link from '../future-hopr-lib-components/Typography/link'
import Section from '../future-hopr-lib-components/Section'
import BalanceField from '../future-hopr-lib-components/BalanceField'
import Typography from '../future-hopr-lib-components/Typography';
import TableDataColumed from '../future-hopr-lib-components/Table/columed-data'


import { seasonNumber, baseAPRPercentage } from '../staking-config'
import { countAPRPercentage } from '../utils/functions'

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
    currentRewardPool,
    totalActualStake,
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
            <td>{balance_xHOPR} xHOPR</td>
          </tr>
          <tr>
            <th></th>
            <td>{balance_wxHOPR} wxHOPR</td>
          </tr>
          <tr>
            <th></th>
            <td>{balance_xDAI} xDAI</td>
          </tr>
        </tbody>
        <tbody>
            <tr>
              <th>Available Rewards</th>
              <td>{currentRewardPool} wxHOPR</td>
            </tr>
            <tr>
              <th>Total Staked</th>
              <td>{totalActualStake} xHOPR</td>
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
              value={totalActualStake}
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
          href="https://blockscout.com/poa/xdai/address/0xd80fbbfe9d057254d80eebb49f17aca66a238e2d/transactions"
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
          <br/>
        <p className=" css-yvr15l">
          HOPR Staking Season 4 has finished, to recover your xHOPR stake, locked NFTs and unclaimed wxHOPR rewards, visit
          {" "}<Link
            href="https://stake-s4.hoprnet.org"
            text="stake S4"
            openIcon
          />, connect your wallet and press “Unlock”. To restake, simply return to this site.
        </p>
        <h4>MAKE SURE TO STAKE FROM YOUR SEASON 4 ADDRESS TO BE ELIGIBLE FOR EXTRA REWARDS</h4>
        <br />
        <p className=" css-9tmdd2">Starting <strong>Wed Oct 26 2022</strong>, rewards can be claimed on each block. All rewards will be returned as
          {" "}<Link
            href="https://blockscout.com/poa/xdai/address/0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1/transactions"
            text="wxHOPR"
            openIcon
          /> tokens. xHOPR staked today will be locked for <strong>13</strong> days.
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
