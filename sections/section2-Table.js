import React, { useState, useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section'
import Table from '../components/Table'

export default function Section2() {
  const [registry, set_registry] = useState([]);
  const [environment, set_environment] = useState(36);
  const [lastRuns, set_lastRuns] = useState([]);
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
    getData();
    getNodes();
  }, []);

  useEffect(() => {
    getNodes();
  }, [environment]);

  async function getData(){
    const response = await fetch('./api/getData', {
      method: 'GET',
    });
    const json = await response.json();
    set_environments(json.envioronments);
    set_lastRuns(json.lastRuns);
  };

  async function getNodes(){
    const response = await fetch(`./api/getNodes?env=${environment}`, {
      method: 'GET',
    });
    const json =  await response.json();
    set_registry(json);
  };


  function getLastRun (){
    try {
      return lastRuns.filter(run=>run.environmentId == environment)[0].lastRun;
    } catch (e) {
      return '-'
    }
  }

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
        lastRun={getLastRun()}
      />
    </Section>
  )
}
