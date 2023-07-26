import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { round } from 'javascript-time-ago/steps'

import TextField from '../future-hopr-lib-components/TextField';
import Typography from '../future-hopr-lib-components/Typography';
import Section from '../future-hopr-lib-components/Section'
import TableDataColumed from '../future-hopr-lib-components/Table/columed-data'
import Button from '../future-hopr-lib-components/Button'

import InputAdornment from '@mui/material/InputAdornment';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

import { 
  countRewardsPerSecond, 
  countRewardsPerDay
} from '../utils/functions'

import { 
  PROGRAM_START_MS, 
  PROGRAM_END_MS,
  BOOST_CAP,
  baseAPR_chainboost
} from '../config'

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
  &.Mui-disabled {
    svg {
      background-color: transparent;
      color: rgba(0, 0, 0, 0.26);
    }
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
  margin-bottom: 8px;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input {
    -moz-appearance: textfield;
  }
  @media (max-width: 320px) {
    .MuiInputAdornment-root {
      display: none;
    }
  }
`

TimeAgo.addDefaultLocale(en);
const customLabels = {
  second: {
    past: {
      one: "{0} second earlier",
      other: "{0} seconds earlier"
    },
    future: {
      one: "in {0} second",
      other: "in {0} seconds"
    }
  },
};

//TimeAgo.addLabels('en', 'custom', customLabels)
const timeAgo = new TimeAgo('en-US');
const customStyle = {
  steps: [
    {
      // "second" labels are used for formatting the output.
      formatAs: 'second'
    },
    {
      minTime: 60 * 5, //till 5min
      formatAs: 'minute'
    },
    {
      minTime: 60 * 60 * 12, //till 12h
      formatAs: 'hour'
    },
    {
      minTime: 60 * 60 * 48, //till 48h
      formatAs: 'day'
    },
  ],
//  labels: 'custom'
}

export default function Section3(props) {
  const {
    blockNumber,
    balance_xHOPR,
    balance_stakedxHOPR,
    balance_claimedRewards,
    balance_unclaimedRewards,
    boostRate,
    lastSyncTimestamp_cumulatedRewards,
    viewMode,
    counter,
    balance_rewardsReceived
  } = props;
  const [claimable, set_claimable] = useState(null);
  const [toStake, set_toStake] = useState('');
  const [reloading, set_reloading] = useState(false);
  const [stakeDisabled, set_stakeDisabled] = useState(false);
  const [claimDisabled, set_claimDisabled] = useState(false);
  const [unlockDisabled, set_unlockDisabled] = useState(false);
  const [timeTo, set_timeTo] = useState(null);
  const [seasonFinised, set_seasonFinised] = useState(false);
  const [dateNow, set_dateNow] = useState(Date.now());

  useEffect(() => {
    console.log('useEffect', {counter, seasonFinised, if: (!counter || seasonFinised)});
    if(!counter || seasonFinised) return;
    set_timeTo(timeAgo.format(PROGRAM_END_MS, customStyle));
    const interval = setInterval(() => {
      if (Date.now() >= PROGRAM_END_MS) {
        set_seasonFinised(true);
      }
      set_timeTo(timeAgo.format(PROGRAM_END_MS, customStyle));
    }, 1000);
    return () => clearInterval(interval);
  }, [counter, seasonFinised]);

  useEffect(() => {
    if( (!lastSyncTimestamp_cumulatedRewards && lastSyncTimestamp_cumulatedRewards !==0 )|| 
        (!balance_unclaimedRewards && balance_unclaimedRewards !==0) || 
        (!balance_stakedxHOPR && balance_stakedxHOPR !==0) || 
        (!boostRate && boostRate !==0)
    ) return;
  //  console.log('setInterval STARTING');
    set_claimable('Loading...');
    const totalBoost = baseAPR_chainboost + boostRate;
    if(Date.now() <= PROGRAM_START_MS ) {
      set_claimable(0);
      return;
    } else if(Date.now() >= PROGRAM_END_MS) {
      let secondsSinceSync = Math.round(PROGRAM_END_MS/1000) - lastSyncTimestamp_cumulatedRewards;
      const secondsSinceSyncReal = secondsSinceSync >= 0 ? secondsSinceSync : 0;
      var claimableTmp = balance_unclaimedRewards + (secondsSinceSyncReal * countRewardsPerSecond(balance_stakedxHOPR, totalBoost));
      if(balance_stakedxHOPR > BOOST_CAP) {
        claimableTmp = balance_unclaimedRewards + (secondsSinceSyncReal * countRewardsPerSecond(balance_stakedxHOPR, baseAPR_chainboost)) + (secondsSinceSyncReal * countRewardsPerSecond(BOOST_CAP, boostRate));
      }
      set_claimable(claimableTmp.toFixed(18));
      return;
    };
    const interval = setInterval(() => {
      if(Date.now() >= PROGRAM_END_MS) return;
      let secondsSinceSync = Math.round(Date.now()/1000) - lastSyncTimestamp_cumulatedRewards;
      const secondsSinceSyncReal = secondsSinceSync >= 0 ? secondsSinceSync : 0;
      var claimableTmp = balance_unclaimedRewards + (secondsSinceSyncReal * countRewardsPerSecond(balance_stakedxHOPR, totalBoost));
      if(balance_stakedxHOPR > BOOST_CAP) {
        claimableTmp = balance_unclaimedRewards + (secondsSinceSyncReal * countRewardsPerSecond(balance_stakedxHOPR, baseAPR_chainboost)) + (secondsSinceSyncReal * countRewardsPerSecond(BOOST_CAP, boostRate));
      }
      set_claimable(claimableTmp.toFixed(18));
    }, 1000);
    return () => clearInterval(interval);
  }, [
    lastSyncTimestamp_cumulatedRewards,
    balance_unclaimedRewards,
    balance_stakedxHOPR,
    boostRate
  ]);

  useEffect(() => {
    set_dateNow(Date.now());
    const interval = setInterval(() => {
      set_dateNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const rewardsPerSecond = () => {
    if(balance_stakedxHOPR > BOOST_CAP) return countRewardsPerSecond(balance_stakedxHOPR, baseAPR_chainboost) +  countRewardsPerSecond(BOOST_CAP, boostRate);
    return countRewardsPerSecond(balance_stakedxHOPR, baseAPR_chainboost + boostRate);
  }

  const rewardsPerDay = () => {
    if(balance_stakedxHOPR > BOOST_CAP) return countRewardsPerDay(balance_stakedxHOPR, baseAPR_chainboost) +  countRewardsPerDay(BOOST_CAP, boostRate);
    return countRewardsPerDay(balance_stakedxHOPR, baseAPR_chainboost + boostRate);
  }

  
  function formatBigNumbersToHTML(amount) {
    return amount;
    amount = 200005555500.5;
    let string = '' + amount;
    let encounteredDot = false;
    let counter = 0;
    let newer;
    for(let i = 0; i < string.length; i++) {
      let index = string.length - i;
      if(string[index] === '.') encounteredDot = true;
      if(!encounteredDot) continue;
      counter++;
      if(counter === 4) {
        string = string.slice(0, index) + ' ' + string.slice(index);
        counter = 0;
      }
    }
    if(!encounteredDot) return amount;
    return <>{string}</>;
  };


  return (
    <Section
      id='section3'
      lightGray
      disabled={props.disabled && !viewMode}
    >
      <Tables>
        <Typography type="h6" style={{marginBottom: '8px'}}>
          Stake xHOPR tokens
        </Typography>
        <SIconButton 
          color="primary" 
          aria-label="refresh crypto"  
          className={`${reloading ? 'reloading' : ''}`}
          disabled={reloading || viewMode}
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

      <TableDataColumed>
        <tbody>
          <tr>
            <th>Block number</th>
            <td>{blockNumber ? blockNumber : '-'}</td>
          </tr>
          <tr>
            <th>Staked</th>
            <td>{balance_stakedxHOPR ? formatBigNumbersToHTML(balance_stakedxHOPR) : '-'} xHOPR</td>
          </tr>
          <tr>
            <th>Received Network Rewards </th>
            <td>{balance_rewardsReceived ? balance_rewardsReceived : '-'} xHOPR</td>
          </tr>
          <tr>
            <th>Claimed</th>
            <td>{balance_claimedRewards ? balance_claimedRewards : '-'} wxHOPR</td>
          </tr>
        </tbody>
        <tbody>
            <tr>
              <th>Stake Rewards</th>
              <td>{rewardsPerSecond()} wxHOPR/sec</td>
            </tr>
            <tr>
              <th></th>
              <td>{rewardsPerDay()} wxHOPR/day</td>
            </tr>
            <tr>
              <th>Next est. Network Rewards</th>
              <td>{props.balance_nextEstRewards ? props.balance_nextEstRewards : '-'} xHOPR</td>
            </tr>
            <tr>
              <th>Claimable</th>
              <td>{claimable ? claimable : balance_unclaimedRewards ? balance_unclaimedRewards : '-'} wxHOPR</td>
            </tr>
          </tbody>
      </TableDataColumed>

      <br/>

      <SearchRow>
        <AlwaysRow>
          <Button
            hopr
            onClick={()=>{set_toStake(balance_xHOPR)}}
            disabled={viewMode}
          >
            Max
          </Button>
          <SearchPeerId 
            label="Stake xHOPR" 
            type="number"
            value={toStake}
            onChange={(event)=>{
              set_toStake(event.target.value)
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">xHOPR</InputAdornment>,
            }}
            size="small"
            disabled={viewMode}
          />
        </AlwaysRow>
        <Button
          disabled={!(toStake > 0) || stakeDisabled || Date.now() > PROGRAM_END_MS || viewMode}
          loading={stakeDisabled}
          onClick={async ()=>{
            set_stakeDisabled(true);
            set_reloading(true);
            await props.handleStake(toStake);
            set_toStake("")
            set_stakeDisabled(false);
            setTimeout(()=>{set_reloading(false)}, 1500);
          }}
        >
          Stake
        </Button>
      </SearchRow>
      <SearchRow right>
        <Button 
          onClick={async ()=>{
            set_unlockDisabled(true);
            set_reloading(true);
            await props.handleUnlock();
            set_unlockDisabled(false);
            setTimeout(()=>{set_reloading(false)}, 1500);
          }}
          loading={unlockDisabled}
        >
          Unlock 
        </Button>
        <Button
          onClick={async ()=>{
            set_claimDisabled(true);
            set_reloading(true);
            await props.claimRewards();
            set_claimDisabled(false);
            setTimeout(()=>{set_reloading(false)}, 1500);
          }}
          disabled={claimDisabled || viewMode}
          loading={claimDisabled}
        >
          Claim rewards
        </Button>
      </SearchRow>
    </Section>
  )
}
