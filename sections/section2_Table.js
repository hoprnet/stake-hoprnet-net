import React, { useState, useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section'
import Table from '../components/Table'

export default function Section2(props) {
  const [registry, set_registry] = useState([]);
  const [environment, set_environment] = useState(36);
  const [lastRuns, set_lastRuns] = useState([]);
  const [now, set_now] = useState(Date.now());
  
  useEffect(() => {
    console.log('Section2 1st render')
    getData();
    getNodes(environment);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      set_now((prev)=>{ return (prev +=  60 * 1000)})
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   console.log('now', now ,'\n', new Date(now))
  // }, [now]);

  async function getData(){
    const response = await fetch('./api/getData', {
      method: 'GET',
    });
    const json = await response.json();
    props.set_environments(json.envioronments);
    set_lastRuns(json.lastRuns);
    console.log('json', json)
    set_now(json.now)
  };

  async function getNodes(environment){
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
      return null
    }
  }

  function setEnvironment (input){
    if(input !== environment) set_environment(input)
  }

  return (
    <Section
      id='section2-talbe'
      yellow
    >
      <Table
        data={registry}
        environments={props.environments}
        environment={environment}
        setEnvironment={setEnvironment}
        lastRun={getLastRun()}
        now={()=>{return now}}
      />
    </Section>
  )
}
