import React, { useState, useEffect } from "react";
import Section from "../future-hopr-lib-components/Section";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from '../future-hopr-lib-components/Typography'

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import _debounce from "lodash/debounce";


const SFormControl = styled(FormControl)`
  width: 260px;
  .MuiInputBase-root {
  //  background: white;
  }
  @media only screen and (max-width: 820px) {
    width: 100%;
  }
`;

const Vertical = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Horizontal = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  @media only screen and (max-width: 630px) {
    flex-direction: column;
  }
`;


function EnvironmentSelect(props) {
  return (
    <SFormControl>
      <InputLabel id="environment-select-label">Environment</InputLabel>
      <Select
        labelId="environment-select-label"
        id="environment-select"
        value={props.value}
        label="Environment"
        MenuProps={{
          className: "source-font",
        }}
        onChange={props.onChange}
      >
        {props?.items?.map((item) => (
          <MenuItem value={item.id} key={`environment-item-${item.id}`}>
            {item.environment}
          </MenuItem>
        ))}
      </Select>
    </SFormControl>
  );
}

function runtimeString (runtime) {
 // console.log('runtime', runtime)
  return `${runtime.year}-${runtime.month < 10 ? `0${runtime.month}` : runtime.month}`
}

function RuntimeSelect(props) {
  useEffect(() => {
    console.log('RuntimeSelect render')
  }, []);

  useEffect(() => {
    console.log('RuntimeSelect value', props.value)
  }, [props.value]);

  return (
    <SFormControl>
      <InputLabel id="runtimes-select-label-2">Runtimes</InputLabel>
      <Select
        labelId="runtimes-select-label-2"
        id="runtimes-select-2"
        value={props.value}
        label="Runtimes"
        MenuProps={{
          className: "source-font",
        }}
        onChange={props.onChange}
      >
        {props?.items?.map((item, index) => (
          <MenuItem 
            value={index} 
            key={`runtimes-item-${item.year}-${item.month}`}
         //   disalbed={item.count === 0}
          >
            {runtimeString(item)}
          </MenuItem>
        ))}
      </Select>
    </SFormControl>
  );
}

function countStats(stats) {
  console.log('stats', stats)
  let count25 = 0;
  let count50 = 0;
  let count60 = 0;
  let count70 = 0;
  let count80 = 0;
  let count90 = 0;
  let count95 = 0;
  let count100 = 0;

  const maxCount = Math.max(...stats.map(elem => elem.count));
  const count = stats.length;
  console.log('maxCount', maxCount, 'count', count)
  for (let i = 0; i < stats.length; i++ ){

    let count = stats[i].count;

    if( count === maxCount ) {
      count100++
    } 
    if( count >= 0.95 * maxCount ) {
      count95++
    } 
    if( count >= 0.9 * maxCount ) {
      count90++
    } 
    if( count >= 0.8 * maxCount ) {
      count80++
    } 
    if( count >= 0.7 * maxCount ) {
      count70++
    } 
    if( count >= 0.6 * maxCount ) {
      count60++
    } 
    if( count >= 0.5 * maxCount ) {
      count50++
    } 
    if( count >= 0.25 * maxCount ) {
      count25++
    } 
  }

  const rez = {
    count,
    count25,
    count50,
    count60,
    count70,
    count80,
    count90,
    count95,
    count100,
    array: stats.map(elem => elem.count)
  }
  console.log('rez', rez)
  return rez
}

export default function Section3(props) {
  const [environment, set_environment] = useState({
    current: 36,
    previous: 36
  });
  const [runtime, set_runtime] = useState({
    current: '',
    previous: ''
  });
  const [runtimes, set_runtimes] = useState([]);
  const [stats, set_stats] = useState({});
  const [statsCounted, set_statsCounted] = useState({});
  const [graph24, set_graph24] = useState([]);
  const [graphMonth, set_graphMonth] = useState([]);
  const [last30daysOnline, set_last30daysOnline] = useState([]);
  const [last7daysOffline, set_last7daysOffline] = useState([]);

  useEffect(() => {
    console.log('Section3 render')
    getRuntimes();
    getLast30daysOnlineByHour();
    getLast7daysOnlineByPeers();
  }, []);

  useEffect(() => {
    if (environment.current !== environment.previous) {
      updateRuntimes(environment.current, runtime.current);
      getLast30daysOnlineByHour();
      getLast7daysOnlineByPeers();
    }
  }, [environment]);

  useEffect(() => {
    if (runtime.current !== runtime.previous) getMonthlyStats(environment.current, runtimes[runtime.current].year, runtimes[runtime.current].month, runtimes[runtime.current].count);
  }, [runtime]);

  async function getRuntimes() {
    let response = await fetch(`./api/statistics/getRuntimes?env=${environment.current}`, {
      method: "GET",
    });
    const runtimesNew = await response.json();
    set_runtimes(runtimesNew);
    set_runtime((prev) => {return {
      current: runtimesNew.length - 1,
      previous: prev.current
    }});
    console.log('runtimesNew', runtimesNew)
  }

  async function updateRuntimes(environment, runtimeIndex) {
    if(runtimeIndex === '')  runtimeIndex = 0;
    const response = await fetch(`./api/statistics/getRuntimes?env=${environment}`, {
      method: "GET",
    });
    const runtimesNew = await response.json();
    set_runtimes(runtimesNew);

    if(runtimesNew.length <= runtimeIndex) {
      runtimeIndex = 0;
      set_runtime((prev) => {return {
        current: 0,
        previous: prev.current
      }});
    } else {
      getMonthlyStats(environment, runtimesNew[runtimeIndex].year, runtimesNew[runtimeIndex].month, runtimesNew[runtimeIndex].count);
    }
  }

  async function getMonthlyStats(envId, year, month, maxCount) {
    var response = await fetch(
      `./api/statistics/getStats?env=${envId}&year=${year}&month=${month}`,
      {
        method: "GET",
      }
    );
    const stats = await response.json();

    const {
      pingCountInYearMonth,
      last24hNodes
    } = stats;

    let pingCountInYearMonthCounted = countStats(pingCountInYearMonth);
    let last24hNodesCounted = countStats(last24hNodes);

    set_stats(stats);
    set_statsCounted({
      pingCountInYearMonth: pingCountInYearMonthCounted,
      last24hNodes: last24hNodesCounted
    })

    console.log('pingCountInYearMonthCounted', pingCountInYearMonthCounted)
    set_graph24(
      [
        {
          name: "nodes",
          data: [last24hNodesCounted.count50, last24hNodesCounted.count80, last24hNodesCounted.count95, last24hNodesCounted.count100]
        }
      ]
    )
    set_graphMonth(
      [
        {
          name: "nodes",
          data: [pingCountInYearMonthCounted.count50, pingCountInYearMonthCounted.count80, pingCountInYearMonthCounted.count95, pingCountInYearMonthCounted.count100]
        }
      ]
    )
  }


  async function getLast30daysOnlineByHour() {
    let response = await fetch(`./api/statistics/getLast30daysOnlineByHour?env=${environment.current}`, {
      method: "GET",
    });
    const runtimesNew = await response.json();
    set_last30daysOnline(runtimesNew);
    console.log('getLast30daysOnline', runtimesNew)
  }

  async function getLast7daysOnlineByPeers() {
    let response = await fetch(`./api/statistics/getLast7daysOnlineByPeers?env=${environment.current}`, {
      method: "GET",
    });
    const last7daysOnlineByPeers = await response.json();
    console.log(last7daysOnlineByPeers)
    set_last7daysOffline(last7daysOnlineByPeers);
  }

  const options24h = {
    chart: {
      id: "24h-graph"
    },
    chart: {
      fontSize: '14px',
      fontFamily: 'Source Code Pro',
    },
    xaxis: {
      categories: ['50%+', '80%+', '95%+', '100%'],
    },
  };

  return (
    <Section id="section3-stats" gradient center>
      <Typography type="h2">
        Statistics
      </Typography>
      <Horizontal>
        <Vertical>
          <EnvironmentSelect
            items={props.environments}
            onChange={(event) => {
              console.log('onChange set_environment')
              set_environment((prev) => {return {
                current: event.target.value,
                previous: prev.current
              }});
            }}
            value={environment.current}
          /><br/>
          <p style={{height: '48px'}}><strong>{stats?.last24hNodes?.length}</strong> peerId seen on the network in the last 24h on <b>{props.environments.find(elem=>elem.id === environment.current).environment.current}</b> environment</p><br/>
          <div style={{width: '100%'}}>
          <Chart
            options={options24h}
      //     series={statsCounted?.last24hNodes?.array ? statsCounted?.last24hNodes?.array  : [10, 41, 35, 51, 49, 62, 69, 91, 148]}
            series={graph24}
            type="bar"
            width="100%"
            height="280px"
          />
          </div>
          <div style={{width: '100%', textAlign: 'center', marginTop: '-20px', fontSize: '13px'}}><p>last 24h availability</p></div>
        </Vertical>
        <Vertical>
          <RuntimeSelect
            iter={1}
            items={runtimes}
            onChange={(event) => {
              console.log('onChange set_runtime');
              set_runtime((prev) => {return {
                current: event.target.value,
                previous: prev.current
              }});
            }}
            value={runtime.current}
          /><br/>
          <p style={{height: '48px'}}><strong>{stats?.pingCountInYearMonth?.length}</strong> peerId seen on the network in <strong>{runtimes[runtime.current] && runtimeString(runtimes[runtime.current])}</strong>  on <b>{props.environments.find(elem=>elem.id === environment.current).environment.current}</b> environment</p><br/>
          <div style={{width: '100%'}}>
          <Chart
            options={options24h}
            series={graphMonth}
            type="bar"
            width="100%"
            height="280px"
          />
          </div>
          <div style={{width: '100%', textAlign: 'center', marginTop: '-20px', fontSize: '13px'}}><p>{runtimes[runtime.current] && runtimeString(runtimes[runtime.current])} availability</p></div>
        </Vertical>
      </Horizontal>
      {
        last30daysOnline.length > 0 &&
        <div style={{width: '100%'}}>
          <Chart
            series={[{
              name: "online nodes",
              data: last30daysOnline,
            }]}
            domain={last30daysOnline.length > 1 ? [last30daysOnline[0].time, last30daysOnline[last30daysOnline.length-1].time] : []}
            type="line"
            width="100%"
            height="350px"
            options={{
              chart: {
                fontSize: '14px',
                fontFamily: 'Source Code Pro',
                events : {
                  beforeZoom : (e, {xaxis}) => {
                      let maindifference = (new Date(last30daysOnline[last30daysOnline.length-1].time)).valueOf() - new Date(last30daysOnline[0].time).valueOf();
                      let zoomdifference =  xaxis.max - xaxis.min ;
                      if( zoomdifference > maindifference ) {
                        return  {
                            // dont zoom out any further
                            xaxis: {
                                min: last30daysOnline[0].time,
                                max: last30daysOnline[last30daysOnline.length-1].time
                            }
                        }; 
                      } else {
                          return {
                              // keep on zooming
                              xaxis: {
                                  min: xaxis.min,
                                  max: xaxis.max
                              }
                          }
                      }
                  }
              }},
              xaxis: {
                type: 'datetime',
              }
            }}
          />
          <div style={{width: '100%', textAlign: 'center', marginTop: '-8px', fontSize: '13px'}}><p>last 30 days availability</p></div>
        </div>
      }
      {
        last7daysOffline[0].data.length > 0 &&
          <div style={{width: '100%'}}>
            <Chart
              series={last7daysOffline}
              type="line"
              width="100%"
              height="450px"
              options={{
                chart: {
                  fontSize: '14px',
                  fontFamily: 'Source Code Pro',
                  zoom: {
                    enabled: false,
                  }
                },
                colors: ["rgb(0, 143, 251)", "#7eb0d5", "#b2e061", "#bd7ebe", "rgb(118, 141, 113)", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7", "#ffb55a","rgb(0, 227, 150)"],
                xaxis: {
                  type: 'datetime',
                }
              }}
            />
            <div style={{width: '100%', textAlign: 'center', marginTop: '-8px', fontSize: '13px'}}><p>last 7 days detailed availability</p></div>
          </div>
      }
    </Section>
  );
}
