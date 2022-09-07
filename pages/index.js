import React, { useState, useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section'
import EncourageSection from '../future-hopr-lib-components/Section/encourage' 
import HeroSection from '../future-hopr-lib-components/Section/hero' 
import Table from '../components/Table'

import typingBotAnimation from '../assets/typing-bot-animation.json';





export default function Home() {
  const [registry, set_registry] = useState([]);

  useEffect(() => {
    getNodes();
  }, []);

  async function getNodes(){
    const response = await fetch('./api/getNodes', {
      method: 'GET',
    });
    const json =  await response.json();
    set_registry(json);
  };

  return (
    <>
      <HeroSection/>
      <Section
        yellow
      >
        <Table
          data={registry}
        />
      </Section>
      <EncourageSection
        title='BE PART OF THE HOPR ECOSYSTEM'
        text='HOPR is building the transport layer privacy needed to make web3 work. Work with us to build dApps that change data privacy for good.'
        animationData={typingBotAnimation}
      />
    </>
  )
}
