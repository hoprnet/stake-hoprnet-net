export const seasonNumber = 8;
export const STAKING_SEASON_CONTRACT = "0xdc8f03f19986859362d15c3d5ed74f26518870b9"; //Season 8

export const xHOPR_CONTRACT = "0xD057604A14982FE8D88c5fC25Aac3267eA142a08";
export const GNOSIS_CHAIN_HOPR_BOOST_NFT = "0x43d13d7b83607f14335cf2cb75e87da369d056c7";

export const theDecentralisedGraphStakingUrl = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.DECENTRALIZED_SUBGRAPH_KEY}/subgraphs/id/F1NZayy7TXRi2szAVXvMFfJuC9uSdNYLUPAb6p6BYRmZ`
export const theCentralisedGraphStakingUrl = `https://api.studio.thegraph.com/query/78696/hopr-stake-all-seasons/version/latest`

export const theDecentralisedGraphStakingUrlNewStaking = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.DECENTRALIZED_SUBGRAPH_KEY}/subgraphs/id/GP2abJCarirMJCanuk4SBmnadiobEWH9ME2MNRAHbBTp`
export const theCentralisedGraphStakingUrlNewStaking = `https://api.studio.thegraph.com/query/78696/hopr-nodes-dufour/version/latest`

export const PROGRAM_START = 1690372800;
export const PROGRAM_END = 1694260800;

export const PROGRAM_START_MS = PROGRAM_START * 1000;
export const PROGRAM_END_MS = PROGRAM_END * 1000;

const FACTOR_DENOMINATOR = 1e12;
export const factor = 1 / (365 * 24 * 60 * 60 / FACTOR_DENOMINATOR);

export const baseAPR_chainboost = 396; // BASIC_FACTOR_NUMERATOR

export const baseAPR = baseAPR_chainboost / factor; // 0.025008047999999998
export const baseAPRPercentage = baseAPR * 100; // 2.5008047999999998

export const BOOST_CAP = 250000;

//IPFS
export const IPFS_HOSTED_URL = 'https://cloudflare-ipfs.com/ipfs/';
