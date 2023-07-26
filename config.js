export const seasonNumber = 7;
export const STAKING_SEASON_CONTRACT = "0x65c39e6bd97f80b5ae5d2120a47644578fd2b8dc"; //Season 7

export const xHOPR_CONTRACT = "0xD057604A14982FE8D88c5fC25Aac3267eA142a08";
export const GNOSIS_CHAIN_HOPR_BOOST_NFT = "0x43d13d7b83607f14335cf2cb75e87da369d056c7";


export const theDecentralisedGraphStakingUrl = `https://gateway.thegraph.com/api/${process.env.DECENTRALIZED_SUBGRAPH_KEY}/subgraphs/id/DrkbaCvNGVcNH1RghepLRy6NSHFi8Dmwp4T2LN3LqcjY`
export const theCentralisedGraphStakingUrl = `https://api.studio.thegraph.com/query/40439/hopr-stake-all-seasons/v0.0.9`

export const PROGRAM_START = 1682510400;  //Season 7
export const PROGRAM_END = 1690372800;  //Season 7

export const PROGRAM_START_MS = PROGRAM_START * 1000; 
export const PROGRAM_END_MS = PROGRAM_END * 1000; 

const FACTOR_DENOMINATOR = 1e12;
export const factor = 1 / (365 * 24 * 60 * 60 / FACTOR_DENOMINATOR);

export const baseAPR_chainboost = 396; //Season 7 (BASIC_FACTOR_NUMERATOR)

export const baseAPR = baseAPR_chainboost / factor; // 0.025008047999999998
export const baseAPRPercentage = baseAPR * 100; // 2.5008047999999998

export const BOOST_CAP = 250000; //Season 7

//IPFS
export const IPFS_HOSTED_URL = 'https://cloudflare-ipfs.com/ipfs/';