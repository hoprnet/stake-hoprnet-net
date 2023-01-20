import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '../future-hopr-lib-components/Typography';
import Section from '../future-hopr-lib-components/Section'
import TableDataColumed from '../future-hopr-lib-components/Table/columed-data'

import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

import Button from '../future-hopr-lib-components/Button'

import { countRewardsPerSecond, countRewardsPerDay } from '../utils/functions'


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


  countRewardsPerSecond(balance_stakedxHOPR, boostRate)



  return (
    <Section
      id='section4'
      lightGray
    >
      <Typography type="h6">
        Stake HOPR NFTs
      </Typography>


    </Section>
  )
}
