import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '../future-hopr-lib-components/Typography';
import Section from '../future-hopr-lib-components/Section'
import TableDataColumed from '../future-hopr-lib-components/Table/columed-data'


import Accordion from '../future-hopr-lib-components/Accordion';
import AccordionSummary from '../future-hopr-lib-components/Accordion/AccordionSummary';

import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import AccordionDetails from '@mui/material/AccordionDetails';
//import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Button from '../future-hopr-lib-components/Button'

import { countRewardsPerSecond, countRewardsPerDay } from '../utils/functions'


export default function Section3(props) {
  const {
    appliedBoosts_NFTs,
    ignoredBoosts_NFTs,
    ownBoosts_NFTs,
  } = props;

  return (
    <Section
      id='section4'
      lightGray
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography type="h6">HOPR NFTs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            No NFTs.
            {JSON.stringify(ownBoosts_NFTs, null, 2)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography type="h6">Staked HOPR NFTs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            No NFTs.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Section>
  )
}
