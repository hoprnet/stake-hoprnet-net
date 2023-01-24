import { request, gql } from 'graphql-request'
import { theGraphStakingUrl, IPFS_HOSTED_URL } from '../staking-config'
import nfts from '../nft/nfts.json'


export async function getSubGraphStakingSeasonData() {

  // NEW
  const GET_THEGRAPH = gql`
        query getSubGraphStakingSeasonData {
            programs {
              totalLocked
              totalClaimedRewards
              lastSyncTimestamp
              availableReward
              blockedTypeIndexes
            }
        }
    `;

  //OLD
  // const GET_THEGRAPH = gql`
  //     query getSubGraphStakingSeasonData {
  //         programs {
  //           blockedType
  //           currentRewardPool
  //           lastSyncTimestamp
  //           totalActualStake
  //           totalUnclaimedRewards
  //         }
  //     }
  //   `;

//     programs {
//       totalUnclaimedRewards
//       totalLocked
//       totalCumulatedRewards
//       totalClaimedRewards
//       lastSyncTimestamp
//       availableReward
//     }
// }

  let data;

  try {
    data = await request(theGraphStakingUrl, GET_THEGRAPH);
  } catch (e) {
    console.error(e);
  }


  data = {
 //   lastSyncTimestamp: parseInt(data.programs[0].lastSyncTimestamp),

    ...data.programs[0],
    // NEW
    totalLocked: data.programs[0].totalLocked / 10e17,
    totalClaimedRewards: data.programs[0].totalClaimedRewards / 10e17,
    availableReward: data.programs[0].availableReward / 10e17
    

    // OLD
    // totalLocked: data.programs[0].totalActualStake / 10e17,
    // availableReward: data.programs[0].totalUnclaimedRewards / 10e17,

    // currentRewardPool: data.programs[0].currentRewardPool / 10e18,
    // lastSyncTimestamp: parseInt(data.programs[0].lastSyncTimestamp),

    
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

  // OLD
//   const GET_THEGRAPH = gql`
//   query getSubGraphStakingUserData {
//       account(id: "${address}") {
//         unclaimedRewards
//         lastSyncTimestamp
//         ignoredBoosts {
//           redeemDeadline
//           id
//           boostType
//           boostNumerator
//         }
//         id
//         boostRate
//         appliedBoosts {
//           redeemDeadline
//           id
//           boostType
//           boostNumerator
//         }
//           actualStake
//         }
//       }
//   }
// `;


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
    }
  }

  data = data.account;
  if(data.actualLockedTokenAmount && data.unclaimedRewards) {
    data.actualLockedTokenAmount = data.actualLockedTokenAmount / 10e17;
    data.unclaimedRewards = data.unclaimedRewards / 10e17;
    data.lastSyncTimestamp = parseInt(data.lastSyncTimestamp);
    data.boostRate = parseInt(data.boostRate);
  }

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

  return parseNFTs(data.boosts);
};


function parseNFTs(ntfsFromGraph){
  let parsed = ntfsFromGraph.map(elem=>{
    const uri2 = elem.uri.replace("https://stake.hoprnet.org/", "").split('/');
    const type = uri2[0];
    const rank = uri2[1];
    return {
      type,
      rank,
      imageHosted: IPFS_HOSTED_URL + nfts[type][rank].image.replace('ipfs://', ''),
      ...nfts[type][rank],
      ...elem
    }
  })
  return parsed;
}
