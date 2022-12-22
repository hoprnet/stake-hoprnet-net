import React, { useState, useEffect } from 'react';
import typingBotAnimation from '../assets/typing-bot-animation.json';

import EncourageSection from '../future-hopr-lib-components/Section/encourage'
import Section2_Table from '../sections/section2_Table' 
import Section3_Stats from '../sections/section3_Stats' 
import HeroSection from '../future-hopr-lib-components/Section/hero' 

import LaunchPlaygroundBtn from '../future-hopr-lib-components/Button/LaunchPlayground';

export default function Home() {
  const [environments, set_environments] = useState([
    {
      id: 36,
      environment: "monte_rosa",
    },
    {
      id: 1,
      environment: "paleochora",
    },
  ]);

  useEffect(() => {
    console.log('Index 1st render')
  }, []);


  return (
    <>
      <HeroSection
        title={'HOPR Network Dashboard'}
      />
      <Section2_Table
        environments={environments}
        set_environments={set_environments}
      />
      <Section3_Stats
        environments={environments}
      />
      <EncourageSection
        title='TRY OUT THE HOPR PROTOCOL IN UNDER 5 SECONDS'
        text='HOPR is building the transport layer privacy needed to make web3 work. Get started with the playground version of the HOPR protocol and several dApps in less than 5 seconds and without any installation.'
        animationData={typingBotAnimation}
      >
        <LaunchPlaygroundBtn/>
      </EncourageSection>
    </>
  )
}
