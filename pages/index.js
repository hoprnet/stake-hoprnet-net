import React, { useState, useEffect } from 'react';
import animation from '../assets/HOPR_Staking_Animation.json';

import styled from "@emotion/styled";
import Web3 from "web3";
import erc20abi from '../utils/erc20-abi.json'
import erc721abi from '../utils/erc721-abi.json'
import stakingSeason5abi from '../utils/staking-season5-abi.json'

import { shorten0xAddress, detectCurrentProvider, countAPRPercentage } from '../utils/functions'
import { getSubGraphStakingSeasonData, getSubGraphStakingUserData, getSubGraphNFTsUserData } from '../utils/subgraph'
import { 
  seasonNumber, 
  STAKING_SEASON_CONTRACT, 
  xHOPR_CONTRACT,
  GNOSIS_CHAIN_HOPR_BOOST_NFT
} from '../staking-config'

import HeroSection from '../future-hopr-lib-components/Section/hero'
import ChainButton from '../future-hopr-lib-components/Button/chain-button'
import Button from '../future-hopr-lib-components/Button'
import WalletButton from '../future-hopr-lib-components/Button/wallet-button'
import Modal from '../future-hopr-lib-components/Modal'
import Layout from '../future-hopr-lib-components/Layout';
import EncourageSection from '../future-hopr-lib-components/Section/encourage'
import LaunchPlaygroundBtn from '../future-hopr-lib-components/Button/LaunchPlayground';
import TextField from '../future-hopr-lib-components/TextField';


import Section2 from '../sections/section2'
import Section2B from '../sections/section2B'
import Section3 from '../sections/section3_staker'

import dynamic from 'next/dynamic'
const Section4 = dynamic(() => import('../sections/section4_nft'), { ssr: false })

import typingBotAnimation from '../assets/typing-bot-animation.json';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { rest } from 'lodash';


export default function Home() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [viewMode, set_viewMode] = useState(false);
  const [account, setAccount] = useState(null);
  const [tmp_account, set_tmp_account] = useState("");
  const [chainId, set_chainId] = useState(null);
  const [blockNumber, set_blockNumber] = useState(null);
  const [balance_xDAI, set_balance_xdai] = useState(null);
  const [balance_xHOPR, set_balance_xHOPR] = useState(null);
  const [balance_wxHOPR, set_balance_wxHOPR] = useState(null);
  const [balance_stakedxHOPR, set_balance_stakedxHOPR] = useState(null);
  const [balance_claimedRewards, set_balance_claimedRewards] = useState(null);
  const [balance_totalClaimedRewards, set_balance_totalClaimedRewards] = useState(null);
  const [balance_unclaimedRewards, set_balance_unclaimedRewards] = useState(null);
  const [balance_availableReward, set_balance_availableReward] = useState(null);
  const [blockedTypeIndexes, set_blockedTypeIndexes] = useState([]);
  const [lastSyncTimestamp_cumulatedRewards, set_lastSyncTimestamp_cumulatedRewards] = useState(null);
  const [chooseWalletModal, set_chooseWalletModal] = useState(false);
  const [viewModeModal, set_viewModeModal] = useState(false);
  const [lastSyncTimestamp, set_lastSyncTimestamp] = useState(null);
  const [totalLocked, set_totalLocked] = useState(null);
  const [subgraphUserData, set_subgraphUserData] = useState(null);
  const [appliedBoosts_NFTs, set_appliedBoosts_NFTs] = useState([]);
  const [ignoredBoosts_NFTs, set_ignoredBoosts_NFTs] = useState([]);
  const [ownBoosts_NFTs, set_ownBoosts_NFTs] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
    setOverallData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!account) {
      set_balance_xdai(null);
      set_balance_xHOPR(null);
      set_balance_wxHOPR(null);
    }
  }, [account, chainId]);

  const connectHandlerMetaMask = async (input) => {
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
        set_viewMode(false);
      } catch (err) {
        console.error(err);
        setErrorMessage(`There was a problem connecting to MetaMask (1). `,);
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const connectViewMode = async (account) => {
    const SubGraph = await getSubGraphData(account);
    set_balance_xdai(null);
    set_balance_xHOPR(null);
    set_balance_wxHOPR(null);
    set_blockNumber(null);
    set_balance_stakedxHOPR(SubGraph.actualLockedTokenAmount);
    set_balance_claimedRewards(SubGraph.claimedRewards);
    set_balance_unclaimedRewards(SubGraph.unclaimedRewards);
    set_lastSyncTimestamp_cumulatedRewards(SubGraph.lastSyncTimestamp);
    set_viewMode(true);
  };

  const accountsChanged = async (addresses) => {
    let newAccount = addresses[0];
    console.log('accountsChanged', newAccount);
    setAccount(newAccount);
    try {
      const currentChain = await ethereum.request({ method: 'eth_chainId' });
      console.log('currentChain', currentChain)
      set_chainId(currentChain);
      if (currentChain === '0x64') {
        console.log('currentChain === 0x64');
        getBalances();
      }
      await getSubGraphData(newAccount);
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask (2).");
    }
  };

  const getSubGraphData = async (address) => {
    try {
      let subGraphStakingUserData = await getSubGraphStakingUserData(address);
      console.log('subgraphUserData', subGraphStakingUserData);
      const { 
        appliedBoosts,
        ignoredBoosts,
        ...rest
      } = subGraphStakingUserData;
      set_subgraphUserData(rest);
      set_appliedBoosts_NFTs(appliedBoosts);
      set_ignoredBoosts_NFTs(ignoredBoosts);

      let data = await getSubGraphNFTsUserData(address);
      set_ownBoosts_NFTs(data);
      return subGraphStakingUserData;
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to TheGraph");
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
        set_balance_unclaimedRewards(cumulatedRewards - claimedRewards);
        set_lastSyncTimestamp_cumulatedRewards(parseInt(result.lastSyncTimestamp))

        // contract = new web3.eth.Contract(stakingSeason5abi, STAKING_SEASON_CONTRACT);
        // result = await contract.methods.redeemedNftIndex(account).call();
        // console.log('number of NFTs', result)

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
    console.log('getSubGraphStakingSeasonData', data)
    set_balance_availableReward(data.availableReward);
    set_lastSyncTimestamp(data.lastSyncTimestamp);
    set_totalLocked(data.totalLocked);
    set_balance_totalClaimedRewards(data.totalClaimedRewards);
    set_blockedTypeIndexes(data.blockedTypeIndexes);
  }

  const handleClosehandleClose = () => {
    setErrorMessage(null);
  };
  
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
        const result = await contract.methods.claimRewards(account).send({
          from: account,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null, 
        });
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
        const result = await contract.methods.transferAndCall(STAKING_SEASON_CONTRACT, weiAmount,  '0x0000000000000000000000000000000000000000000000000000000000000000').send({
          from: account,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null, 
        })
        console.log('MM result', result);
        if(result.status && result.transactionHash) {
          getBalances();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleUnlock(){
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
        const contract = new web3.eth.Contract(stakingSeason5abi, STAKING_SEASON_CONTRACT);
        const result = await contract.methods.unlockFor(account).send({
          from: account,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null, 
        });
        console.log('MM result', result);
        if(result.status && result.transactionHash) {
          getBalances();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleLockNFT(nftId){

    console.log('handleLockNFT', nftId)
  //  return new Promise(resolve => setTimeout(resolve, 2000));
    
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
        const contract = new web3.eth.Contract(erc721abi, GNOSIS_CHAIN_HOPR_BOOST_NFT);
        const result = await contract.methods.safeTransferFrom(account, STAKING_SEASON_CONTRACT, nftId).send({
          from: account,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null, 
        });
        console.log('MM result', result);
        if(result.status && result.transactionHash) {
          let movedNft = ownBoosts_NFTs.filter(nft => nft.id === nftId)[0];
          console.log('movedNft', movedNft);
          set_ownBoosts_NFTs(prev => {
            console.log('prev', prev);
            let newer = prev.filter(nft => nft.id !== nftId);
            console.log('newer', newer);
            return prev.filter(nft => nft.id !== nftId);
          });
          if(appliedBoosts_NFTs.findIndex(nft => nft.type === movedNft.type) === -1) {
            set_appliedBoosts_NFTs( prev => {return [...prev, movedNft]});
            set_subgraphUserData( prev => {
              return {
                ...prev,
                boostRate: prev.boostRate + movedNft.boostRate,
              }
            });
          } else { // TODO: to make better (check if you have lower rank?)
            const nftsOfSameType = appliedBoosts_NFTs.filter(nft => nft.type === movedNft.type);
            const nftsWithHigherOrTheSameAPR = nftsOfSameType.filter(nft => nft.boost >= movedNft.boost);
            const nftsWithLowerAPR = nftsOfSameType.filter(nft => nft.boost < movedNft.boost);
            if(nftsWithHigherOrTheSameAPR.length > 0) {
              set_ignoredBoosts_NFTs( prev => {return [...prev, movedNft]});
              console.log('set_ignoredBoosts_NFTs');
            } else if (nftsWithLowerAPR.length > 0) {
              let boostToRemove = 0;
              for(let i = 0; i < nftsWithLowerAPR.length; i++) {
                if(boostToRemove < nftsWithLowerAPR[i].boostRate) boostToRemove = nftsWithLowerAPR[i].boostRate;
              }
              let nftToRemoveIndex = appliedBoosts_NFTs.findIndex(nft => nft.type === movedNft.type &&  nft.boostRate === boostToRemove);
              set_ignoredBoosts_NFTs( prev => {return [
                ...prev, 
                appliedBoosts_NFTs[nftToRemoveIndex]
              ]});
              set_appliedBoosts_NFTs( prev => {
                return [
                  ...prev.slice(0,nftToRemoveIndex),
                  ...prev.slice(nftToRemoveIndex+1),
                  movedNft
                ]
              });
              set_subgraphUserData( prev => {
                return {
                  ...prev,
                  boostRate: prev.boostRate + movedNft.boostRate - boostToRemove,
                }
              });
            }
          }
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

  const ConnectWalletBtn = styled(Button)`
    @media screen and (max-width: 340px) {
      .hideOnMobile{
        display: none;
      }
    }
  `

  const connectWallet = () => {
    return <ConnectWalletBtn
      standardWidth
      onClick={() => { set_chooseWalletModal(true) }}
    >
      {
        account ?
          shorten0xAddress(account)
          :
          <span style={{ whiteSpace: 'nowrap' }}><span className="hideOnMobile">Connect </span>Wallet</span>
      }
    </ConnectWalletBtn>
  };

  const rightButtons = () => <>
    { 
      !viewMode &&
      <ChainButton
        connected={!!account}
        chainId={chainId}
      />
    }
    {connectWallet()}
  </>;


  const animationCss = `
    width: 100%;
    max-width: 330px;
    position: absolute;
    top: -80px;
    margin-bottom: 80px;
    @media (max-width: 680px) {
      width: 50%;
    }
    @media (max-width: 500px) {
      top: -70px;
      width: 55%;
    }
    @media (max-width: 400px) {
      top: -60px;
    }
    @media (max-width: 300px) {
      top: -40px;
    }
  `

  return (
    <Layout
      itemsNavbarRight={rightButtons()}
      tallerNavBarOnMobile
    >
      <HeroSection
        title={`HOPR Staking Season ${seasonNumber}`}
        yellowBallBackground
        animation={animation}
        animationCss={animationCss}
      />
      <Section2
        balance_xDAI={balance_xDAI}
        balance_xHOPR={balance_xHOPR}
        balance_wxHOPR={balance_wxHOPR}
        balance_availableReward={balance_availableReward}
        balance_totalClaimedRewards={balance_totalClaimedRewards}
        lastSyncTimestamp={lastSyncTimestamp}
        totalLocked={totalLocked}
        boostRate={subgraphUserData?.boostRate}
      />
      <Section3
        disabled={chainId !== '0x64'}
        viewMode={viewMode}
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
        handleUnlock={handleUnlock}
      />
      <Section4
        disabled={chainId !== '0x64'}
        viewMode={viewMode}
        ownBoosts_NFTs={ownBoosts_NFTs}
        appliedBoosts_NFTs={appliedBoosts_NFTs}
        ignoredBoosts_NFTs={ignoredBoosts_NFTs}
        blockedTypeIndexes={blockedTypeIndexes}
        handleLockNFT={handleLockNFT}
      />
      <Section2B
        balance_xDAI={balance_xDAI}
        balance_xHOPR={balance_xHOPR}
        balance_wxHOPR={balance_wxHOPR}
        balance_availableReward={balance_availableReward}
        balance_totalClaimedRewards={balance_totalClaimedRewards}
        lastSyncTimestamp={lastSyncTimestamp}
        totalLocked={totalLocked}
        boostRate={subgraphUserData?.boostRate}
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
          <WalletButton
            onClick={() => { 
              set_chooseWalletModal(false);
              set_viewModeModal(true);
            }}
            wallet="viewMode"
          />
          <p>By connecting a wallet, you agree to HOPR’s Terms of Service and acknowledge that you have read and understand the Disclaimer.</p>
        </ConnectWalletContent>
      </Modal>
      <Modal
        open={viewModeModal}
        onClose={() => { set_viewModeModal(false) }}
        title="CONNECT AN ADDRESS"
      >
        <TextField
          label="Address" 
          value={tmp_account}
          onChange={(event)=>{
            set_tmp_account(event.target.value)
          }}
        />
        <Button
          onClick={() => { 
            set_viewModeModal(false);
            setAccount(tmp_account.toLowerCase());
            connectViewMode(tmp_account.toLowerCase());
          }}
          fullWidth
        >
          View
        </Button>
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
