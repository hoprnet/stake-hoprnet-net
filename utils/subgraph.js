import { request, gql } from 'graphql-request'
import { theGraphStakingUrl, IPFS_HOSTED_URL, factor } from '../staking-config'
import { getNFTImageUrl } from './functions'
import nfts from '../nft/nfts.json'


export async function getSubGraphStakingSeasonData() {
  const GET_THEGRAPH = gql`
        query getSubGraphStakingSeasonData {
            programs {
              totalLocked
              totalClaimedRewards
              lastSyncTimestamp
              availableReward
              blockedTypeIndexes
            }
            _meta {
              block {
                timestamp
              }
            }
        }
    `;
  let data;
  try {
    data = await request(theGraphStakingUrl, GET_THEGRAPH);
  } catch (e) {
    console.error(e);
  }
  if (!data?.programs[0]) {
    return {
      totalLocked: 'Connection error',
      totalClaimedRewards: 'Connection error',
      availableReward: 'Connection error'
    }
  }
  data = {
    ...data.programs[0],
    totalLocked: data.programs[0].totalLocked / 10e17,
    totalClaimedRewards: data.programs[0].totalClaimedRewards / 10e17,
    availableReward: data.programs[0].availableReward / 10e17,
    blockChainTimestamp: data._meta.block.timestamp
  }
  return data
};


// currentRewardPool: data.programs[0].currentRewardPool / 10e18,
// lastSyncTimestamp: parseInt(data.programs[0].lastSyncTimestamp),
// totalActualStake: data.programs[0].totalActualStake / 10e18,
// totalUnclaimedRewards: data.programs[0].totalUnclaimedRewards / 10e18,

export async function getSubGraphStakingUserData(address) {
 // NEW
  const GET_THEGRAPH = gql`
    query getSubGraphStakingUserData {
        account(id: "${address}") {
          actualLockedTokenAmount
          appliedBoosts {
            boostNumerator
            boostTypeIndex
            id
            owner
            redeemDeadline
            uri
          }
          boostRate
          claimedRewards
          cumulatedRewards
          id
          unclaimedRewards
          lastSyncTimestamp
          ignoredBoosts {
            boostNumerator
            boostTypeIndex
            id
            owner
            redeemDeadline
            uri
          }
        }
    }
  `;

  let data;

  try {
    data = await request(theGraphStakingUrl, GET_THEGRAPH);
  } catch (e) {
    console.error(e);
  }


  if(!data.account) {
    return {
      actualLockedTokenAmount: 0,
      unclaimedRewards: 0,
      boostRate: 0,
      appliedBoosts: [],
      ignoredBoosts: []
    }
  }

  data = data.account;
  if(data.actualLockedTokenAmount) {
    data.actualLockedTokenAmount = data.actualLockedTokenAmount / 10e17;
    data.unclaimedRewards = data.unclaimedRewards / 10e17;
    data.claimedRewards = data.claimedRewards / 10e17;
    data.lastSyncTimestamp = parseInt(data.lastSyncTimestamp);
    data.boostRate = parseInt(data.boostRate);
  }

  //0x226d833075C26dbF9aA377De0363e435808953a4
  //0x226d833075c26dbf9aa377de0363e435808953a4
  //0x226d833075c26dbf9aa377de0363e435808953a4

  if(data.appliedBoosts.length > 0) {
    data.appliedBoosts = parseNFTs(data.appliedBoosts);
  }

  if(data.ignoredBoosts.length > 0) {
    data.ignoredBoosts = parseNFTs(data.ignoredBoosts);
  }

  return data
};


export async function getSubGraphNFTsUserData(address) {

  const GET_THEGRAPH = gql`
    query getSubGraphNFTsUserData {
      boosts(first: 1000, where: {owner: "${address}"}) {
        id
        boostTypeIndex
        uri
      }
    }
  `;

  let data;

  try {
    data = await request(theGraphStakingUrl, GET_THEGRAPH);
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

export async function getSubGraphTimeStamp() {
  const GET_THEGRAPH = gql`
        query getSubGraphTimeStamp {
            _meta {
              block {
                timestamp
              }
            }
        }
    `;
  let data;
  try {
    data = await request(theGraphStakingUrl, GET_THEGRAPH);
  } catch (e) {
    console.error(e);
  }
  return data._meta.block.timestamp;
};