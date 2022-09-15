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
        title='TRY OUT THE HOPR PROTOCOL IN UNDER 5 SECONDS'
        text='HOPR is building the transport layer privacy needed to make web3 work. Get started with the playground version of the HOPR protocol and several dApps in less than 5 seconds and without any installation.'
        animationData={typingBotAnimation}
      />
    </>
  )
}
