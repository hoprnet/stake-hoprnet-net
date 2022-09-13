import React, { useState, useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section'
import Table from '../components/Table'

export default function Section2() {
  const [registry, set_registry] = useState([]);
  const [environment, set_environment] = useState(36);
  const [environments, set_environments] = useState([
      {
          "id": 36,
          "environment": "monte_rosa"
      },
      {
          "id": 1,
          "environment": "paleochora"
      }
  ]);
  
  useEffect(() => {
    getEnvironments();
    getNodes();
  }, []);

  useEffect(() => {
    getNodes();
  }, [environment]);

  async function getEnvironments(){
    const response = await fetch('./api/getEnvironments', {
      method: 'GET',
    });
    const json = await response.json();
    set_environments(json);
  };

  async function getNodes(){
    const response = await fetch(`./api/getNodes?env=${environment}`, {
      method: 'GET',
    });
    const json =  await response.json();
    set_registry(json);
  };

  return (
    <Section
      id='section2-talbe'
      yellow
    >
      <Table
        data={registry}
        environments={environments}
        environment={environment}
        setEnvironment={set_environment}
      />
    </Section>
  )
}
