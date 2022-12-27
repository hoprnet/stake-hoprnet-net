import { 
    nodeGetInfo,
    nodeGetPeers, 
    nodePing, 
    getPeersFromSubGraph,
    getRegisteredPeersFromSubGraph 
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
var peersToPing = [];

var newPeers = [];
var pings = [];
var counter = 0;


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
    nodes = groupItemsByEnvironments(nodes);
    peersToPing = groupItemsByEnvironments(peersToPing);
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
    peers = response.map(peer => {return {peerId: peer.peerId, environment: peer.environment, lastSeen: peer.lastSeen}});
}

async function getPeersFromNetwork (){
    for (let i = 0; i < nodes.length; i++) {
        let response = await nodeGetPeers(nodes[i].api_url, nodes[i].api_key);
        if (!response) continue;
        for (let j = 0; j < response.announced.length; j++){
          addPeerLocally(response.announced[j].peerId, nodes[i].environment);
        }
    }

    let peersFromSubGraph = await getRegisteredPeersFromSubGraph();
    for (let j = 0; j < peersFromSubGraph.length; j++){
      addPeerLocally(peersFromSubGraph[j], process.env.thegraph_environment); 
    }

    if (newPeers.length > 0) await insertPeerIds(newPeers);
    if (peersFromSubGraph.length > 0) {
        await updateRegistered(peersFromSubGraph, process.env.thegraph_environment);
        peersToPing = peersFromSubGraph.map(peerId => {return {
            peerId,
            environment: process.env.thegraph_environment,
            lastSeen: peers.find(elem => elem.peerId === peerId && elem.environment === process.env.thegraph_environment)?.lastSeen
        }});

    }
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
        let peersOnEnv = peersToPing[nodeEnvironments[e]];

        for (let p = 0; p < peersOnEnv.length; p++) {
            for (let n = 0; n < nodesOnEnv.length; n++) {
                if(nodesOnEnv[n].environment !== peersOnEnv[p].environment) continue;
                let percentage = Math.round(p / peersOnEnv.length * 100);
                console.log(`[${new Date().toUTCString()}] [${percentage}%] Ping ${p+1} out of ${peersOnEnv.length} (${n+1}/${nodesOnEnv.length} nodes)`)
                let ping = await nodePing(nodesOnEnv[n].api_url, nodesOnEnv[n].api_key, peersOnEnv[p].peerId);
                if (ping?.hasOwnProperty('latency')) {
                    console.log(`[${new Date().toUTCString()}] ${peersOnEnv[p].peerId} latency: ${ping.latency}`)
                    insertPingLocally(peersOnEnv[p].peerId, nodesOnEnv[n].environment, ping.latency)
                    counter++;
                    break;
                }
                if (((Date.now() - (30 * 24 * 60 * 60 * 1000)) > peersOnEnv[p].lastSeen) && n === 1) {
                    console.log(`[${new Date().toUTCString()}] Skiping ${peersOnEnv[p].peerId} after 2 pings as it was last seen on ${new Date(peersOnEnv[p].lastSeen).toUTCString()}`)
                    break;
                }
                if (((Date.now() - (15 * 24 * 60 * 60 * 1000)) > peersOnEnv[p].lastSeen) && n === 2) {
                    console.log(`[${new Date().toUTCString()}] Skiping ${peersOnEnv[p].peerId} after 3 pings as it was last seen on ${new Date(peersOnEnv[p].lastSeen).toUTCString()}`)
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



