export const seasonNumber = 5;
export const STAKING_SEASON_CONTRACT = "0xd80fbBFE9d057254d80eEbB49f17aCA66a238e2D"; //Season 5
//export const STAKING_SEASON_CONTRACT = "0xa02af160a280957a8881879ee9239a614ab47f0d"; //Season 6
export const xHOPR_CONTRACT = "0xD057604A14982FE8D88c5fC25Aac3267eA142a08";
export const GNOSIS_CHAIN_HOPR_BOOST_NFT = "0x43d13d7b83607f14335cf2cb75e87da369d056c7";


//export const theGraphStakingUrl = 'https://api.thegraph.com/subgraphs/name/hoprnet/stake-season6' //Season 6
export const theGraphStakingUrl = 'https://api.studio.thegraph.com/query/40439/stake-season5/v0.0.3' //Season 5

//export const PROGRAM_START = 1674738000;  //Season 6
//export const PROGRAM_END = 1682510400;  //Season 6
export const PROGRAM_START = 1666785600;  //Season 5
export const PROGRAM_END = 1674738000;  //Season 5

export const PROGRAM_START_MS = PROGRAM_START * 1000; 
export const PROGRAM_END_MS = PROGRAM_END * 1000; 

const FACTOR_DENOMINATOR = 1e12;
export const factor = 1 / (365 * 24 * 60 * 60 / FACTOR_DENOMINATOR);

export const baseAPR_chainboost = 793; //Season 5
//export const baseAPR_chainboost = 396; //Season 6

export const baseAPR = baseAPR_chainboost / factor; // 0.025008047999999998
export const baseAPRPercentage = baseAPR * 100; // 2.5008047999999998




//IPFS
export const IPFS_HOSTED_URL = 'https://cloudflare-ipfs.com/ipfs/';