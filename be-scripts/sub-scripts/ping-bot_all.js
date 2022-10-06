import { 
    nodeGetInfo,
    nodeGetPeers, 
    nodePing, 
    getPeersFromSubGraph 
} from "./hopr-sdk.js";
import { 
    selectPeerIds, 
    insertPeerId, 
    insertPeerIds,
    insertLastSeen, 
    insertPing, 
    insertPings,
    insertRuntime,
    insertEnvironments,
    insertElementEvent,
    checkElementEventInLast24h,
    updateRegistered
} from "./mysql.js";
import {
    groupItemsByEnvironments
} from "./common-functions.js";

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' });

var nodes = [];
var nodesProvided = 0;
var nodeEnvironments = [];
var pings = [];
var peers = [];

var newPeers = [];
var pings = [];
var counter = 0;
var numberOfPings;


export async function pingBotAll (input){
    nodes = input;
    nodesProvided = input.length;

    await getPeersFromDB();
    await saveEnvironments();
    await getPeersFromNetwork();
    prepareData();
    await pingAndSaveResults();
} 

function prepareData() {
    numberOfPings = peers.length * nodes.length;
    nodes = groupItemsByEnvironments(nodes);
    peers = groupItemsByEnvironments(peers);
}

async function saveEnvironments(){
    let allEnvironments = [];
    for (let i = 0; i < nodes.length; i++) {
        if ( !nodeEnvironments.includes(nodes[i].environment) ) {
            nodeEnvironments.push(nodes[i].environment);
            allEnvironments.push(nodes[i].environment);
        }
    }
    if ( !nodeEnvironments.includes(process.env.thegraph_environment) ) allEnvironments.push(process.env.thegraph_environment);
    await insertEnvironments(allEnvironments);
}

async function getPeersFromDB(){
    const response = await selectPeerIds();
    peers = response.map(peer => {return {peerId: peer.peerId, environment: peer.environment}});
}

async function getPeersFromNetwork (){
    for (let i = 0; i < nodes.length; i++) {
        let response = await nodeGetPeers(nodes[i].api_url, nodes[i].api_key);
        if (!response) continue;
        for (let j = 0; j < response.announced.length; j++){
          addPeerLocally(response.announced[j].peerId, nodes[i].environment);
        }
    }

    let peersFromSubGraph = await getPeersFromSubGraph();
    for (let j = 0; j < peersFromSubGraph.length; j++){
      addPeerLocally(peersFromSubGraph[j], process.env.thegraph_environment); 
    }

    if (newPeers.length > 0) await insertPeerIds(newPeers);
    if (peersFromSubGraph.length > 0) await updateRegistered(peersFromSubGraph, process.env.thegraph_environment);
}

async function addPeerLocally(peerId, environment){
    if (peers.findIndex(peer => peer.peerId === peerId && peer.environment === environment) === -1){
        peers.push({peerId, environment});
        newPeers.push({peerId, environment});
    }
} 

async function pingAndSaveResults(){
    for (let e = 0; e < nodeEnvironments.length; e++) {
        const startedAt = Date.now();
        let workingEnv = nodeEnvironments[e];
        let nodesOnEnv = nodes[nodeEnvironments[e]];
        let peersOnEnv = peers[nodeEnvironments[e]];

        for (let p = 0; p < peersOnEnv.length; p++) {
            for (let n = 0; n < nodesOnEnv.length; n++) {
                if(nodesOnEnv[n].environment !== peersOnEnv[p].environment) continue;
                let pingNumber = (p * nodesOnEnv.length) + n+1;
                let percentage = Math.round(pingNumber / numberOfPings * 100);
                console.log(`[${percentage}%] Ping ${pingNumber} out of ${numberOfPings}`)
                let ping = await nodePing(nodesOnEnv[n].api_url, nodesOnEnv[n].api_key, peersOnEnv[p].peerId);
                if (ping?.hasOwnProperty('latency')) {
                    console.log(`${peersOnEnv[p].peerId} latency: ${ping.latency}`)
                    insertPingLocally(peersOnEnv[p].peerId, nodesOnEnv[n].environment, ping.latency)
                    counter++;
                    break;
                }
            }
        }

        if (pings.length > 0) {
            await insertPings(pings);
            await saveRuntime(counter, startedAt, workingEnv);
        }
    }
}

function insertPingLocally(peerId, environment, latency){
    pings.push({peerId, environment, latency});
} 

async function saveRuntime(counter, startedAt, environment){
    const runtime = Date.now() - startedAt;
    await insertRuntime(runtime, nodes[environment].length, counter, environment);
}



