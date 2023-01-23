export const seasonNumber = 5;
export const STAKING_SEASON_CONTRACT = "0xd80fbBFE9d057254d80eEbB49f17aCA66a238e2D";
export const xHOPR_CONTRACT = "0xD057604A14982FE8D88c5fC25Aac3267eA142a08";
export const GNOSIS_CHAIN_HOPR_BOOST_NFT = "0x43d13d7b83607f14335cf2cb75e87da369d056c7";


export const theGraphStakingUrl = 'https://api.thegraph.com/subgraphs/name/hoprnet/stake-season5'

const FACTOR_DENOMINATOR = 1e12;
export const factor = 1 / (365 * 24 * 60 * 60 / FACTOR_DENOMINATOR);
export const baseAPR_chainboost = 793; 
export const baseAPR = baseAPR_chainboost / factor; // 0.025008047999999998
export const baseAPRPercentage = baseAPR * 100; // 2.5008047999999998