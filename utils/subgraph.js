import { request, gql } from 'graphql-request'
import { theGraphStakingUrl } from '../staking-config'
export async function getSubGraphStakingSeasonData() {

  const GET_THEGRAPH = gql`
        query getSubGraphStakingSeasonData {
            programs {
              totalLocked
              totalClaimedRewards
              lastSyncTimestamp
              availableReward
            }
        }
    `;

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
    console.log(data);
  } catch (e) {
    console.error(e);
  }


  data.programs = {
    lastSyncTimestamp: parseInt(data.programs[0].lastSyncTimestamp),
    totalLocked: data.programs[0].totalLocked / 10e17,
    totalClaimedRewards: data.programs[0].totalClaimedRewards / 10e17,
    availableReward: data.programs[0].availableReward / 10e17
  }
  return data
};

export async function getSubGraphStakingUserData(address) {

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
              uri
              redeemDeadline
              owner
              id
              boostTypeIndex
            }
          }
      }
  `;

  let data;

  try {
    data = await request(theGraphStakingUrl, GET_THEGRAPH);
    console.log(data);
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

  return data
};


export async function getSubGraphNFTsUserData(address) {

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
              uri
              redeemDeadline
              owner
              id
              boostTypeIndex
            }
          }
      }
  `;

  let data;

  try {
    data = await request(theGraphStakingUrl, GET_THEGRAPH);
    console.log(data);
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
    data.actualLockedTokenAmount = data.actualLockedTokenAmount / 10e18;
    data.unclaimedRewards = data.unclaimedRewards / 10e18;
    data.lastSyncTimestamp = parseInt(data.lastSyncTimestamp);
    data.boostRate = parseInt(data.boostRate);
  }

  return data
};
