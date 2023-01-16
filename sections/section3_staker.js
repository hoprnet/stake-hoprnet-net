import React, { useState, useEffect } from 'react';
import Table from '../components/Table'
import styled from "@emotion/styled";
import Typography from '../future-hopr-lib-components/Typography';

import Link from '../future-hopr-lib-components/Typography/link'
import Section from '../future-hopr-lib-components/Section'
import BalanceField from '../future-hopr-lib-components/BalanceField'

import { seasonNumber } from '../staking-config'

const Amounts = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const BalanceContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 32px;
  justify-content: flex-left;
  width: 100%;
  flex-wrap: wrap;
`


export default function Section2(props) {
  const {
    balance_xDAI,
    balance_stakedxHOPR,
  } = props;

  return (
    <Section
      id='section3'
      lightGray
    >
      <Typography type="h6">
        Stake xHOPR tokens
      </Typography>
      <Typography type="small1">
        You won’t be able to recover your stake until the staking program ends.
      </Typography>


      <BalanceContainer>
        <BalanceField
          title="Staked"
          value={balance_stakedxHOPR}
          unit="xHOPR"
        />
        <BalanceField
          title="Claimed"
          value={balance_xDAI}
          unit="wxHOPR"
        />
        <BalanceField
          title="Rewards"
          value={balance_xDAI}
          unit="wxHOPR"
        />
        <BalanceField
          title="Rewards"
          value={balance_xDAI}
          unit="wxHOPR/day"
        />
        <BalanceField
          title="Claimable"
          value={balance_xDAI}
          unit="wxHOPR"
        />
      </BalanceContainer>


    </Section>
  )
}
