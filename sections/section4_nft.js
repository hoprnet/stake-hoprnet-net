import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import Typography from '../future-hopr-lib-components/Typography';
import Section from '../future-hopr-lib-components/Section'
import Accordion from '../future-hopr-lib-components/Accordion';
import AccordionSummary from '../future-hopr-lib-components/Accordion/AccordionSummary';
import AccordionDetails from '../future-hopr-lib-components/Accordion/AccordionDetails';


import Nft from '../future-hopr-lib-components/NFT'

// Mui

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const NftContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-evenly;
`

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
          <Typography type="h6">HOPR NFTs {ownBoosts_NFTs?.length ? `(${ownBoosts_NFTs.length})` : '' }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {ownBoosts_NFTs.length === 0 ? 'No NFTs.' : '' }
          {console.log(ownBoosts_NFTs)}
          <NftContainer>
            {ownBoosts_NFTs.map((nft) => 
              <Nft
                key={`ownBoosts_NFTs-${nft.id}`}
                id={nft.id}
                image={nft.imageHosted}
                type={nft.type}
                boost={nft.boost}
                rank={nft.rank}
              />)
            }
          </NftContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography type="h6">Staked HOPR NFTs {appliedBoosts_NFTs?.length ? `(${appliedBoosts_NFTs.length})` : '' }</Typography>
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
