import React, { useState, useEffect } from 'react';
import typingBotAnimation from '../assets/typing-bot-animation.json';
import styled from "@emotion/styled";
import { ethers } from "ethers";
import Web3 from "web3";
import erc20abi from '../utils/erc20-abi.json'
import { shorten0xAddress, detectCurrentProvider } from '../utils/functions'

import ChainButton from '../future-hopr-lib-components/Button/chain-button'
import Button from '../future-hopr-lib-components/Button'
import WalletButton from '../future-hopr-lib-components/Button/wallet-button'
import Modal from '../future-hopr-lib-components/Modal'
import Layout from '../future-hopr-lib-components/Layout';

import EncourageSection from '../future-hopr-lib-components/Section/encourage'
import Section2 from '../sections/section2' 
import HeroSection from '../future-hopr-lib-components/Section/hero' 
import LaunchPlaygroundBtn from '../future-hopr-lib-components/Button/LaunchPlayground';
import { getSubGraphStakingData } from '../utils/subgraph'
var interval;

export default function Home() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, set_chainId] = useState(null);
  const [balance_xDAI, set_balance_xdai] = useState('-');
  const [balance_xHOPR, set_balance_xHOPR] = useState('-');
  const [balance_wxHOPR, set_balance_wxHOPR] = useState('-');
  const [chooseWalletModal, set_chooseWalletModal] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }

    console.log( getSubGraphStakingData());
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!!account) {
      set_balance_xdai('-');
      set_balance_xHOPR('-');
      set_balance_wxHOPR('-');
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
        console.log('accountsChanged accounts:', res, currentChain );
        await accountsChanged(res);
        set_chooseWalletModal(false);
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
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
      // const balance = await window.ethereum.request({
      //   method: "eth_getBalance",
      //   params: [newAccount.toString(), "latest"],
      // });
      // set_balance_xdai(ethers.utils.formatEther(balance));
      const currentChain = await ethereum.request({ method: 'eth_chainId' });
      console.log('currentChain', currentChain)
      set_chainId(currentChain);
      if(currentChain === '0x64') {
        console.log('currentChain === 0x64')
        getBalances();

        interval = setInterval(() => {
          console.log('---------------------interval')
          getBalances();
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const getBalances = async () => {
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
        // const chainId = await web3.eth.getChainId();
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


        let rpc = 'https://eth-rpc.gateway.pokt.network';
        rpc = 'https://rpc.ankr.com/eth';

        const web3rpc = new Web3(new Web3.providers.HttpProvider(rpc));
        // display the current block number
        // web3rpc.eth.getBlockNumber().then((result) => {
        //   console.log("Current block number: " + result);
        // });
        
        const ETH_Chain_HOPR = "0xf5581dfefd8fb0e4aec526be659cfab1f8c781da";
        contract = new web3rpc.eth.Contract(erc20abi, ETH_Chain_HOPR);
        result = await contract.methods.balanceOf(account).call(); 
        format = web3rpc.utils.fromWei(result);
        set_balance_HOPR(format);


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
    if(id === '0x64') getBalances();
  };

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
            hopr
            onClick={()=>{set_chooseWalletModal(true)}}
          >
            {
              account ? 
              shorten0xAddress(account)
              :
              <span style={{whiteSpace: 'nowrap'}}>Connect Wallet</span>
            }
          </Button>
};

const rightButtons = () =>  <>
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
        title={'HOPR Staking Season 6'}
      />
        <Section2
          balance_xDAI={balance_xDAI}
          balance_xHOPR={balance_xHOPR}
          balance_wxHOPR={balance_wxHOPR}
        />
      <EncourageSection
        title='TRY OUT THE HOPR PROTOCOL IN UNDER 5 SECONDS'
        text='HOPR is building the transport layer privacy needed to make web3 work. Get started with the playground version of the HOPR protocol and several dApps in less than 5 seconds and without any installation.'
        animationData={typingBotAnimation}
      >
        <LaunchPlaygroundBtn/>
      </EncourageSection>
      <Modal
          open={chooseWalletModal}
          onClose={()=>{set_chooseWalletModal(false)}}
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
    </Layout>
  )
}
