import { factor, baseAPR_chainboost } from '../staking-config'

export function shorten0xAddress (address, lastChars = -4) {
    return address.substr(0,6)+'...'+address.substr(lastChars);
}

export function detectCurrentProvider () {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.warn(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
};

export function countAPRDecimal (boostRate) {
  const boostReal = boostRate >= 0 ? boostRate : 0;
  const boost = boostReal / factor;
  return boost;
};

export function countAPRPercentage (boostRate) {
  const APRDecimal = countAPRDecimal(boostRate);
  return APRDecimal * 100;
};

export function countRewardsPerDay(staked, boostRate) {
  const boostReal = boostRate >= 0 ? boostRate : 0;
  const totalBoost = baseAPR_chainboost + boostReal;
  const APRsec = countAPRDecimal(totalBoost)/365;
  return staked*APRsec; // wxHOPR/sec
};

export function countRewardsPerSecond(staked, boostRate) {
  const rewardsPerDay = countRewardsPerDay(staked, boostRate)
  return rewardsPerDay/24/60/60; // wxHOPR/day
};

export function formatDateToCET(epoch_ms) {
  const d = new Date(epoch_ms+(60*60*1000));
  const year = d.getFullYear();
  const month = d.getMonth()+1 < 10 ? `0${d.getMonth()+1}` : d.getMonth()+1;
  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const hours = d.getUTCHours() < 10 ? `0${d.getUTCHours()}` : d.getUTCHours();
  const minutes = d.getUTCMinutes() < 10 ? `0${d.getUTCMinutes()}` : d.getUTCMinutes();
  const formatted = `${year}-${month}-${day} ${hours}:${minutes} CET`
  return formatted;
};
