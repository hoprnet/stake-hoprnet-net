import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";


import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '../future-hopr-lib-components/Typography';
import Section from '../future-hopr-lib-components/Section'

import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

import Button from '../future-hopr-lib-components/Button'

import { countRewardsPerSecond, countRewardsPerDay } from '../utils/functions'

export const Tables = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;

export const TitleWithIcon = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;


export const SIconButton = styled(IconButton)`
  svg {
    color: #04049f;
  }
  &.reloading {
    animation: rotation 2s infinite linear;
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
        transform: rotate(1turn);
    }
  }
`;


export const Table = styled.table`
  font-family: "Source Code Pro";
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  border-bottom: 0.1rem solid darkgray;
  border-collapse: collapse; 
  th {
    text-align: left;
  }
  tr {
    border-top: 0.1rem solid darkgray;
  }
  th,
  td {
    padding: 8px;
  }
  th:first-of-type {
    font-weight: 600;
    width: 160px;
  }
`;

const AlwaysRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
`

const SearchRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  @media only screen and (max-width: 820px) {
    flex-direction: column;
    margin-bottom: 8px;
  }
`
const SearchPeerId = styled(TextField)`
  font-family: 'Source Code Pro', monospace;
  width: 100%;
  margin-bottom: 8px;
  background: white;
  * {
    font-family: 'Source Code Pro', monospace;!important
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input {
    -moz-appearance: textfield;
  }
}
`

export default function Section3(props) {
  const {
    blockNumber,
    balance_xHOPR,
    balance_stakedxHOPR,
    balance_claimedRewards,
    balance_unclaimedRewards,
    boostRate,
    lastSyncTimestamp_cumulatedRewards,
  } = props;
  const [claimable, set_claimable] = useState(null);
  const [toStake, set_toStake] = useState('');
  const [reloading, set_reloading] = useState(false);
  const [stakeDisabled, set_stakeDisabled] = useState(false);
  const [claimDisabled, set_claimDisabled] = useState(false);

  countRewardsPerSecond(balance_stakedxHOPR, boostRate)

  useEffect(() => {
    console.log('useEffect counting claimable');
    console.log('lastSyncTimestamp_cumulatedRewards', lastSyncTimestamp_cumulatedRewards);
    console.log('balance_unclaimedRewards', balance_unclaimedRewards);
    console.log('balance_stakedxHOPR', balance_stakedxHOPR);
    console.log('boostRate', boostRate);
    if( (!lastSyncTimestamp_cumulatedRewards && lastSyncTimestamp_cumulatedRewards !==0 )|| 
        (!balance_unclaimedRewards && balance_unclaimedRewards !==0) || 
        (!balance_stakedxHOPR && balance_stakedxHOPR !==0) || 
        (!boostRate && boostRate !==0)
    ) return;
    console.log('setInterval STARTING');
    set_claimable('Loading...');
    const interval = setInterval(() => {
      let secondsSinceSync = Math.round(Date.now()/1000) - lastSyncTimestamp_cumulatedRewards;
      const secondsSinceSyncReal = secondsSinceSync >= 0 ? secondsSinceSync : 0;
      const claimableTmp = balance_unclaimedRewards + (secondsSinceSyncReal * countRewardsPerSecond(balance_stakedxHOPR, boostRate))
      set_claimable(claimableTmp.toFixed(18));
    }, 1000);
    return () => clearInterval(interval);
  }, [
    lastSyncTimestamp_cumulatedRewards,
    balance_unclaimedRewards,
    balance_stakedxHOPR,
    boostRate
  ]);



  return (
    <Section
      id='section3'
      lightGray
    >
      <Tables>
        <Typography type="h6" style={{marginBottom: '8px'}}>
          Stake xHOPR tokens
        </Typography>
        <SIconButton 
          color="primary" 
          aria-label="refresh crypto"  
          className={`${reloading ? 'reloading' : ''}`}
          disabled={reloading}
          onClick={async ()=>{
            set_reloading(true);
            await props.getBalances();
            setTimeout(()=>{set_reloading(false)}, 1500);
          }}
        >
          <RefreshIcon />
        </SIconButton>
      </Tables>
      <Typography type="small1" style={{marginTop: '-8px'}}>
        You won’t be able to recover your stake until the staking program ends.
      </Typography>



      <Tables>
        <Table>
          <tbody>
            <tr>
              <th>Block number</th>
              <th>{blockNumber}</th>
            </tr>
            <tr>
              <th>Staked</th>
              <th>{balance_stakedxHOPR} xHOPR</th>
            </tr>
            <tr>
              <th>Received Network Rewards </th>
              <th>{}- xHOPR</th>
            </tr>
            <tr>
              <th>Claimed</th>
              <th>{balance_claimedRewards} wxHOPR</th>
            </tr>
          </tbody>
        </Table>
        <Table>
          <tbody>
            <tr>
              <th>Stake Rewards</th>
              <th>{countRewardsPerSecond(balance_stakedxHOPR, boostRate)} wxHOPR/sec</th>
            </tr>
            <tr>
              <th></th>
              <th>{countRewardsPerDay(balance_stakedxHOPR, boostRate)} wxHOPR/day</th>
            </tr>
            <tr>
              <th>Next Network Rewards</th>
              <th>{}- xHOPR</th>
            </tr>
            <tr>
              <th>Claimable</th>
              <th>{claimable ? claimable : balance_unclaimedRewards} wxHOPR</th>
            </tr>
          </tbody>
        </Table>
      </Tables>
      <br/>

      <SearchRow>
        <AlwaysRow>
          <Button
            hopr
            onClick={()=>{set_toStake(balance_xHOPR)}}
          >
            Max
          </Button>
          <SearchPeerId 
            label="Stake xHOPR" 
            variant="outlined" 
            type="number"
            value={toStake}
            onChange={()=>{
              set_toStake(event.target.value)
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">xHOPR</InputAdornment>,
            }}
            size="small"
          />
        </AlwaysRow>
        <Button
          disabled={!(toStake > 0) || stakeDisabled}
          loading={stakeDisabled}
          onClick={async ()=>{
            set_stakeDisabled(true);
            await props.handleStake(toStake);
            set_stakeDisabled(false);
          }}
        >
          Stake
        </Button>
      </SearchRow>
      <SearchRow right>
        <Button
          onClick={()=>{set_toStake(balance_xHOPR)}}
          disabled
        >
          Unlock
        </Button>
        <Button
          onClick={async ()=>{
            set_claimDisabled(true);
            await props.claimRewards();
            set_claimDisabled(false);
          }}
          disabled={claimDisabled}
          loading={claimDisabled}
        >
          Claim rewards
        </Button>
      </SearchRow>
      
      
      <br/>
      <Typography type="h6">
        Stake HOPR NFTs
      </Typography>
    </Section>
  )
}
