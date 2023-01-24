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

export default function Section4(props) {
  const {
    appliedBoosts_NFTs,
    ignoredBoosts_NFTs,
    ownBoosts_NFTs,
    blockedTypeIndexes,
  } = props;

  const [ownBoosts_NFTs_toShow, set_ownBoosts_NFTs_toShow] = useState([]);
  const [ownBoosts_NFTs_toShow_length, set_ownBoosts_NFTs_toShow_length] = useState(null);
  const [applied_NFTs_toShow, set_applied_NFTs_toShow] = useState([]);
  const [ignored_NFTs_toShow, set_ignored_NFTs_toShow] = useState([]);
  const [staked_NFTs_length, set_staked_NFTs_length] = useState(null);

  useEffect(() => {
//    let applied = 
    const {
      length,
      sorted
    } = NFTs_filter(ownBoosts_NFTs, [...appliedBoosts_NFTs, ...ignoredBoosts_NFTs]);
    set_ownBoosts_NFTs_toShow_length(length);
    set_ownBoosts_NFTs_toShow(sorted);
  }, [ownBoosts_NFTs, appliedBoosts_NFTs, ignoredBoosts_NFTs]);

  useEffect(() => {
    const {
      sorted
    } = NFTs_filter(appliedBoosts_NFTs);
    set_applied_NFTs_toShow(sorted);
  }, [appliedBoosts_NFTs]);

  useEffect(() => {
    const {
      sorted
    } = NFTs_filter(ignoredBoosts_NFTs);
    set_ignored_NFTs_toShow(sorted);
  }, [ignoredBoosts_NFTs]);

  useEffect(() => {
    set_staked_NFTs_length([...appliedBoosts_NFTs, ...ignoredBoosts_NFTs].length);
  }, [appliedBoosts_NFTs, ignoredBoosts_NFTs]);

  function NFTs_filter(NFTs, NFTsToRemove = []) {
    const toRemove = NFTsToRemove.map(elem => elem.id);
    console.log('toRemove', toRemove)
    const allowed = NFTs
      .filter(nft => !blockedTypeIndexes.includes(nft.boostTypeIndex))
      .filter(nft => !toRemove.includes(nft.id));
    console.log('allowed', allowed)
    let filtered = [];
    for(let a = 0; a < allowed.length; a++) {
      let index = filtered.findIndex(nft => (nft.type === allowed[a].type && nft.rank === allowed[a].rank));
      if( index === -1 ) {
        filtered.push({
          ...allowed[a],
          count: 1
        })
      } else {
        filtered[index].count++;
      }
    }
    const sorted = stableSort(filtered, getComparator('desc', 'boost'));
    return {
      length: allowed.length,
      sorted
    }
  }

  function descendingComparator(a, b, orderBy) {
    let a2 = a[orderBy];
    let b2 = b[orderBy];
  
    switch(orderBy){
      case 'latencyAverage':
        if (a2 === null) a2 = Number.MAX_SAFE_INTEGER;
        if (b2 === null) b2 = Number.MAX_SAFE_INTEGER;
        break;
    }
  
    if (b2 < a2) {
      return -1;
    }
    if (b2 > a2) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }



  return (
    <Section
      id='section4'
      lightGray
      disabled={props.disabled}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography type="h6">HOPR NFTs {ownBoosts_NFTs_toShow_length ? `(${ownBoosts_NFTs_toShow_length})` : '' }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {ownBoosts_NFTs_toShow.length === 0 ? 'No NFTs.' : '' }
          <NftContainer>
            {ownBoosts_NFTs_toShow.map((nft) => 
              <Nft
                key={`ownBoosts_NFTs-${nft.id}`}
                id={nft.id}
                image={nft.imageHosted}
                type={nft.type}
                boost={nft.boost}
                rank={nft.rank}
                count={nft.count}
                handleLockNFT={props.handleLockNFT}
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
          <Typography type="h6">Staked HOPR NFTs {staked_NFTs_length ? `(${staked_NFTs_length})` : '' }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {appliedBoosts_NFTs?.length === 0 ? 'No NFTs.' : '' }
            <NftContainer>
              {applied_NFTs_toShow.map((nft) => 
                <Nft
                  key={`appliedBoosts_NFTs-${nft.id}`}
                  id={nft.id}
                  image={nft.imageHosted}
                  type={nft.type}
                  boost={nft.boost}
                  rank={nft.rank}
                  count={nft.count}
                  locked
                />)
              }
              {ignored_NFTs_toShow.map((nft) => 
                <Nft
                  key={`ignoredBoosts_NFTs-${nft.id}`}
                  id={nft.id}
                  image={nft.imageHosted}
                  type={nft.type}
                  boost={nft.boost}
                  rank={nft.rank}
                  count={nft.count}
                  locked
                  ignored
                />)
              }
            </NftContainer>
        </AccordionDetails>
      </Accordion>
    </Section>
  )
}
