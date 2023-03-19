import { request, gql } from 'graphql-request'
import { factor, seasonNumber } from '../config'
import { getNFTImageUrl } from './functions'
import nfts from '../nft/nfts.json'

const subgraphUrl = './api/subgraph';

export async function getSubGraphStakingSeasonData() {
  const GET_THEGRAPH_QUERY = gql`
      query getSubGraphStakingSeasonData {
        _meta {
          block {
            timestamp
            number
          }
        }
        stakeSeasons(where: {seasonNumber: "${seasonNumber}"}) {
          totalLocked
          totalClaimedRewards
          lastSyncTimestamp
          blockedTypeIndexes
          availableReward
        }
      }
    `;
  let data;
  try {
    const response = await fetch(subgraphUrl, {
        method: "POST",
        body: GET_THEGRAPH_QUERY
    });
    data = await response.json();
  } catch (e) {
    console.error(e);
  }
  if (!data?.stakeSeasons[0]) {
    return {
      totalLocked: 'Connection error',
      totalClaimedRewards: 'Connection error',
      availableReward: 'Connection error'
    }
  }
  data = {
    ...data.stakeSeasons[0],
    totalLocked: data.stakeSeasons[0].totalLocked / 10e17,
    totalClaimedRewards: data.stakeSeasons[0].totalClaimedRewards / 10e17,
    availableReward: data.stakeSeasons[0].availableReward / 10e17,
    blockChainTimestamp: data._meta.block.timestamp
  }
  return data
};

export async function getSubGraphStakingUserData(address) {
 const GET_THEGRAPH_QUERY = gql`
 query getSubGraphStakingUserData {
  _meta {
    block {
      timestamp
      number
    }
  }
  accounts(where: {id: "${address.toLowerCase()}"}) {
    stakingParticipation(where: {stakingSeason_: {seasonNumber: "${seasonNumber}"}}) {
      stakingSeason {
        seasonNumber
      }
      unclaimedRewards
      virtualLockedTokenAmount
      boostRate
      claimedRewards
      cumulatedRewards
      ignoredBoosts {
        boostNumerator
        boostTypeIndex
        id
        redeemDeadline
        uri
      }
      lastSyncTimestamp
      airdropLockedTokenAmount
      actualLockedTokenAmount
      appliedBoosts {
        boostNumerator
        boostTypeIndex
        id
        redeemDeadline
        uri
      }
    }
    id
  }
 }
`;

  let data;

  try {
    const response = await fetch(subgraphUrl, {
      method: "POST",
      body: GET_THEGRAPH_QUERY
    });
    data = await response.json();
  } catch (e) {
    console.error(e);
  }

  if(!data.accounts.length === 0) {
    return {
      actualLockedTokenAmount: 0,
      unclaimedRewards: 0,
      boostRate: 0,
      appliedBoosts: [],
      ignoredBoosts: []
    }
  }

  data = data.accounts[0].stakingParticipation[0];
  if(data.actualLockedTokenAmount) {
    data.actualLockedTokenAmount = data.actualLockedTokenAmount / 10e17;
    data.unclaimedRewards = data.unclaimedRewards / 10e17;
    data.claimedRewards = data.claimedRewards / 10e17;
    data.lastSyncTimestamp = parseInt(data.lastSyncTimestamp);
    data.boostRate = parseInt(data.boostRate);
  }

  if(data.appliedBoosts.length > 0) {
    data.appliedBoosts = parseNFTs(data.appliedBoosts);
  }

  if(data.ignoredBoosts.length > 0) {
    data.ignoredBoosts = parseNFTs(data.ignoredBoosts);
  }

  return data;
};


export async function getSubGraphNFTsUserData(address) {

  const GET_THEGRAPH_QUERY = gql`
    query getSubGraphNFTsUserData {
      _meta {
        block {
          timestamp
          number
        }
      }
      boosts(first: 1000, where: {owner: "${address.toLowerCase()}"}) {
        id
        boostTypeIndex
        uri
      }
    }
  `;

  let data;

  try {
    const response = await fetch(subgraphUrl, {
      method: "POST",
      body: GET_THEGRAPH_QUERY
    });
    data = await response.json();
  } catch (e) {
    console.error(e);
  }

  if(!data.boosts) {
    return []
  }

  const parsedNFTs = parseNFTs(data.boosts);
  console.log('Users parsedNFTs', parsedNFTs);
  return parsedNFTs;
};


function parseNFTs(ntfsFromGraph){
  let parsed = ntfsFromGraph.map(elem=>{
    const uri2 = elem.uri.replace("https://stake.hoprnet.org/", "").split('/');
    const type = uri2[0];
    const rank = uri2[1];
    const imageHosted = getNFTImageUrl(elem);
    const boostRate = nfts[type][rank]?.boost ? nfts[type][rank].boost * factor : 0;
    return {
      type,
      rank,
      boostRate,
      imageHosted,
      ...nfts[type][rank],
      ...elem
    }
  })
  return parsed;
}

export async function getSubGraphMeta(url) {
  const GET_THEGRAPH_QUERY = gql`
        query getSubGraphTimeStamp {
            _meta {
              block {
                timestamp
                number
              }
            }
        }
    `;
  let data;
  try {
    data = await request(url, GET_THEGRAPH_QUERY);
  } catch (e) {
    console.error(e);
  }
  return {
    lastSyncTimestamp: data._meta.block.timestamp,
    lastSyncBlockNumber: data._meta.block.number
  };
};