import React, { useState, useEffect } from 'react';

import styled from "@emotion/styled";
import Web3 from "web3";
import erc20abi from '../utils/erc20-abi.json'
import stakingSeason5abi from '../utils/staking-season5-abi.json'

import { shorten0xAddress, detectCurrentProvider, countAPRPercentage } from '../utils/functions'
import { getSubGraphStakingSeasonData, getSubGraphStakingUserData } from '../utils/subgraph'
import { seasonNumber, STAKING_SEASON_CONTRACT, xHOPR_CONTRACT } from '../staking-config'

import HeroSection from '../future-hopr-lib-components/Section/hero'
import ChainButton from '../future-hopr-lib-components/Button/chain-button'
import Button from '../future-hopr-lib-components/Button'
import WalletButton from '../future-hopr-lib-components/Button/wallet-button'
import Modal from '../future-hopr-lib-components/Modal'
import Layout from '../future-hopr-lib-components/Layout';
import EncourageSection from '../future-hopr-lib-components/Section/encourage'
import LaunchPlaygroundBtn from '../future-hopr-lib-components/Button/LaunchPlayground';


import Section2 from '../sections/section2'
import Section3 from '../sections/section3_staker'
import Section4 from '../sections/section4_nft'

import typingBotAnimation from '../assets/typing-bot-animation.json';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


var interval;

export default function Home() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, set_chainId] = useState(null);
  const [blockNumber, set_blockNumber] = useState(null);
  const [balance_xDAI, set_balance_xdai] = useState(null);
  const [balance_xHOPR, set_balance_xHOPR] = useState(null);
  const [balance_wxHOPR, set_balance_wxHOPR] = useState(null);
  const [balance_stakedxHOPR, set_balance_stakedxHOPR] = useState(null);
  const [balance_claimedRewards, set_balance_claimedRewards] = useState(null);
  const [balance_cumulatedRewards, set_balance_cumulatedRewards] = useState(null);
  const [balance_unclaimedRewards, set_balance_unclaimedRewards] = useState(null);
  const [lastSyncTimestamp_cumulatedRewards, set_lastSyncTimestamp_cumulatedRewards] = useState(null);
  const [chooseWalletModal, set_chooseWalletModal] = useState(false);
  const [currentRewardPool, set_currentRewardPool] = useState(null);
  const [lastSyncTimestamp, set_lastSyncTimestamp] = useState(null);
  const [totalActualStake, set_totalActualStake] = useState(null);
  const [totalUnclaimedRewards, set_totalUnclaimedRewards] = useState(null);
  const [subgraphUserData, set_subgraphUserData] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }

    setOverallData();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!!account) {
      set_balance_xdai(null);
      set_balance_xHOPR(null);
      set_balance_wxHOPR(null);
    }
  }, [account, chainId]);

  const connectHandlerMetaMask = async (input) => {
    console.log('connectHandlerMetaMask', input)
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const currentChain = await ethereum.request({ method: 'eth_chainId' });
        set_chainId(currentChain);
        console.log('accountsChanged accounts:', res, currentChain);
        await accountsChanged(res);
        set_chooseWalletModal(false);
      } catch (err) {
        console.error(err);
        setErrorMessage(`There was a problem connecting to MetaMask.`,);
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountsChanged = async (addresses) => {
    let newAccount = addresses[0];
    console.log('accountsChanged', newAccount)
    setAccount(newAccount);
    try {
      const currentChain = await ethereum.request({ method: 'eth_chainId' });
      console.log('currentChain', currentChain)
      set_chainId(currentChain);
      if (currentChain === '0x64') {
        console.log('currentChain === 0x64')
        getBalances();
      }
      let data = await getSubGraphStakingUserData(newAccount);
      set_subgraphUserData(data);
      console.log('set_subgraphUserData', data)
      //   {
      //     "actualStake": 1476.6376191518634,
      //     "boostRate": 793,
      //     "appliedBoosts": [
      //         {
      //             "boostNumerator": "793",
      //             "boostType": "23",
      //             "id": "14643",
      //             "redeemDeadline": "1642424400"
      //         }
      //     ],
      //     "ignoredBoosts": [],
      //     "id": "0xe844f9e13...",
      //     "lastSyncTimestamp": 1672395925,
      //     "unclaimedRewards": 0
      // }
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  async function getBalances () {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];

        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        set_balance_xdai(ethBalance);

        const GNOSIS_CHAIN_xHOPR = "0xD057604A14982FE8D88c5fC25Aac3267eA142a08";
        const GNOSIS_CHAIN_wxHOPR = "0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1";
        let contract = new web3.eth.Contract(erc20abi, GNOSIS_CHAIN_xHOPR);
        let result = await contract.methods.balanceOf(account).call();
        let format = web3.utils.fromWei(result);
        set_balance_xHOPR(format);

        contract = new web3.eth.Contract(erc20abi, GNOSIS_CHAIN_wxHOPR);
        result = await contract.methods.balanceOf(account).call();
        format = web3.utils.fromWei(result);
        set_balance_wxHOPR(format);

        contract = new web3.eth.Contract(stakingSeason5abi, STAKING_SEASON_CONTRACT);
        result = await contract.methods.accounts(account).call();
        console.log('MM account', result)
        format = web3.utils.fromWei(result.actualLockedTokenAmount);
        set_balance_stakedxHOPR(parseFloat(format));

        let claimedRewards = web3.utils.fromWei(result.claimedRewards);
        set_balance_claimedRewards(claimedRewards);

        let cumulatedRewards = web3.utils.fromWei(result.cumulatedRewards);
        set_balance_cumulatedRewards(cumulatedRewards);
        set_balance_unclaimedRewards(cumulatedRewards - claimedRewards);
        set_lastSyncTimestamp_cumulatedRewards(parseInt(result.lastSyncTimestamp))

        contract = new web3.eth.Contract(stakingSeason5abi, STAKING_SEASON_CONTRACT);
        result = await contract.methods.redeemedNftIndex(account).call();
        console.log('number of NFTs', result)

        let getBlockNumber = await web3.eth.getBlockNumber()
        set_blockNumber(getBlockNumber);

        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.', err
      );
    }
  };

  const chainChanged = (id) => {
    console.log('chainChanged', id)
    set_chainId(id);
    if (id === '0x64') getBalances();
  };

  const setOverallData = async () => {
    let data = await getSubGraphStakingSeasonData();
    set_currentRewardPool(data.programs.currentRewardPool)
    set_lastSyncTimestamp(data.programs.lastSyncTimestamp)
    set_totalActualStake(data.programs.totalActualStake)
    set_totalUnclaimedRewards(data.programs.totalUnclaimedRewards)
  }

  const handleClosehandleClose = () => {
    setErrorMessage(null);
  }
  
  async function claimRewards() {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        console.log('account', account)
        const contract = new web3.eth.Contract(stakingSeason5abi, STAKING_SEASON_CONTRACT);
        const result = await contract.methods.claimRewards(account).send({from: account});
        if(result.status && result.transactionHash) {
          getBalances();
        }
        console.log('MM claimRewards', result);
        //   {
        //     "transactionHash": "0x643b93a99614...",
        //     "transactionIndex": 2,
        //     "blockHash": "0x791e80a17b3fa55...",
        //     "blockNumber": 26045186,
        //     "cumulativeGasUsed": 236902,
        //     "gasUsed": 157790,
        //     "effectiveGasPrice": 1504000000,
        //     "contractAddress": null,
        //     "status": true,
        //     "type": "0x2",
        //     "events": {
        //         "Claimed": {
        //             "returnValues": {
        //                 "rewardAmount": "40938057850000000000"
        //             },
        //             "event": "Claimed",
        //         }
        //     }
        // }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleStake(toStake){
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        const contract = new web3.eth.Contract(erc20abi, xHOPR_CONTRACT);
        const weiAmount = web3.utils.toWei(toStake);
        const result = await contract.methods.transferAndCall(STAKING_SEASON_CONTRACT, weiAmount,  '0x0000000000000000000000000000000000000000000000000000000000000000').send({from: account})
     //   const result = await contract.methods.transfer(STAKING_SEASON_CONTRACT, weiAmount).send({from: account})
        console.log('MM result', result);
        if(result.status && result.transactionHash) {
          getBalances();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const ConnectWalletContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    p {
      margin-top: 48px;
    }
  `


  const SpaceBetween = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 16px;
    @media only screen and (max-width: 600px) {
      flex-direction: column;
      align-items: center;
    }
  `

  const connectWallet = () => {
    return <Button
      standardWidth
      onClick={() => { set_chooseWalletModal(true) }}
    >
      {
        account ?
          shorten0xAddress(account)
          :
          <span style={{ whiteSpace: 'nowrap' }}>Connect Wallet</span>
      }
    </Button>
  };

  const rightButtons = () => <>
    <ChainButton
      connected={!!account}
      chainId={chainId}
    />
    {connectWallet()}
  </>;

  return (
    <Layout
      itemsNavbarRight={rightButtons()}
    >
      <HeroSection
        title={`HOPR Staking Season ${seasonNumber}`}
      />
      <Section2
        balance_xDAI={balance_xDAI}
        balance_xHOPR={balance_xHOPR}
        balance_wxHOPR={balance_wxHOPR}
        currentRewardPool={currentRewardPool}
        lastSyncTimestamp={lastSyncTimestamp}
        totalActualStake={totalActualStake}
        totalUnclaimedRewards={totalUnclaimedRewards}
        boostRate={subgraphUserData?.boostRate}
      />
      <Section3
        blockNumber={blockNumber}
        balance_xHOPR={balance_xHOPR}
        balance_stakedxHOPR={balance_stakedxHOPR}
        balance_claimedRewards={balance_claimedRewards}
        unclaimedRewards={subgraphUserData?.unclaimedRewards}
        lastSyncTimestamp={subgraphUserData?.lastSyncTimestamp}
        boostRate={subgraphUserData?.boostRate}
        balance_unclaimedRewards={balance_unclaimedRewards}
        lastSyncTimestamp_cumulatedRewards={lastSyncTimestamp_cumulatedRewards}
        claimRewards={claimRewards}
        handleStake={handleStake}
        getBalances={getBalances}
      />
      <Section4
      
      />
      <EncourageSection
        title='TRY OUT THE HOPR PROTOCOL IN UNDER 5 SECONDS'
        text='HOPR is building the transport layer privacy needed to make web3 work. Get started with the playground version of the HOPR protocol and several dApps in less than 5 seconds and without any installation.'
        animationData={typingBotAnimation}
      >
        <LaunchPlaygroundBtn />
      </EncourageSection>
      <Modal
        open={chooseWalletModal}
        onClose={() => { set_chooseWalletModal(false) }}
        title="CONNECT A WALLET"
      >
        <ConnectWalletContent>
          <WalletButton
            onClick={connectHandlerMetaMask}
            wallet="metamask"
          />
          <p>By connecting a wallet, you agree to HOPR’s Terms of Service and acknowledge that you have read and understand the Disclaimer.</p>
        </ConnectWalletContent>
      </Modal>
      <Snackbar
        severity="error"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorMessage && true}
        onClose={handleClosehandleClose}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </Layout>
  )
}
