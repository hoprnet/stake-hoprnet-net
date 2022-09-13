import React from 'react';
import typingBotAnimation from '../assets/typing-bot-animation.json';

import EncourageSection from '../future-hopr-lib-components/Section/encourage'
import Section2 from '../sections/section2-Table' 
import HeroSection from '../future-hopr-lib-components/Section/hero' 



export default function Home() {
  return (
    <>
      <HeroSection
        title={'HOPR Network Dashboard'}
      />
      <Section2/>
      <EncourageSection
        title='BE PART OF THE HOPR ECOSYSTEM'
        text='HOPR is building the transport layer privacy needed to make web3 work. Work with us to build dApps that change data privacy for good.'
        animationData={typingBotAnimation}
      />
    </>
  )
}
