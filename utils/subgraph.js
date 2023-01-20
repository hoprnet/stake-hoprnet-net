import { request, gql } from 'graphql-request'

export async function getSubGraphStakingSeasonData() {

  const GET_THEGRAPH = gql`
        query getSubGraphStakingSeasonData {
            programs {
              totalActualStake
              totalUnclaimedRewards
              currentRewardPool
              lastSyncTimestamp
            }
        }
    `;

  let data;

  try {
    data = await request('https://api.thegraph.com/subgraphs/name/hoprnet/stake-season5', GET_THEGRAPH);
    console.log(data);
  } catch (e) {
    console.error(e);
  }


  data.programs = {
    currentRewardPool: data.programs[0].currentRewardPool / 10e18,
    lastSyncTimestamp: parseInt(data.programs[0].lastSyncTimestamp),
    totalActualStake: data.programs[0].totalActualStake / 10e18,
    totalUnclaimedRewards: data.programs[0].totalUnclaimedRewards / 10e18,
  }
  return data
};

export async function getSubGraphStakingUserData(address) {

  const GET_THEGRAPH = gql`
        query getSubGraphStakingUserData {
            account(id: "${address}") {
              actualStake
              boostRate
              appliedBoosts {
                boostNumerator
                boostType
                id
                redeemDeadline
              }
              ignoredBoosts {
                boostNumerator
                boostType
                id
                redeemDeadline
              }
              id
              lastSyncTimestamp
              unclaimedRewards
            }
        }
    `;

  let data;

  try {
    data = await request('https://api.thegraph.com/subgraphs/name/hoprnet/stake-season5', GET_THEGRAPH);
    console.log(data);
  } catch (e) {
    console.error(e);
  }


  if(!data.account) {
    return {
      actualStake: 0,
      unclaimedRewards: 0,
      boostRate: 0,
    }
  }

  data = data.account;
  if(data.actualStake && data.unclaimedRewards) {
    data.actualStake = data.actualStake / 10e18;
    data.unclaimedRewards = data.unclaimedRewards / 10e18;
    data.lastSyncTimestamp = parseInt(data.lastSyncTimestamp);
    data.boostRate = parseInt(data.boostRate);
  }

  return data
};
