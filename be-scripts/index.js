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
    checkElementEventInLast24h
} from "./mysql.js";
import {
    reportToElement
} from './element.js'


// const playground_url = 'red_elbe_elara.playground.hoprnet.org:3001'
// const playground_key = '5ef7fF7FaAF6FCe4ed#E3DC2'

// const nodes = ['null', 'zero', 'one', 'two', 'three', 'four'].map(elem=>{ return {
//     'api_url': `https://${elem}_${playground_url}`,
//     'api_key': playground_key
// }});

const all_keys = Object.keys(process.env);
const api_keys = all_keys.filter(key => key.includes('api_url_'));

var nodes = api_keys.map(key => {
    let number = key.replace('api_url_', '');
    if(all_keys.findIndex(key2 => key2 === 'api_url_' + number) && 
       all_keys.findIndex(key2 => key2 === 'api_key_' + number) ){
        return {api_url: process.env['api_url_' + number], api_key: process.env['api_key_' + number] }
    }
})

const nodesProvided = nodes.length;

const startedAt = Date.now();
var peers = [];
var newPeers = [];
var lastSeen = [];
var pings = [];
var counter = 0;

main();

async function main (){
    //TODO: maybe add a check if the tables are created in the DB?

    await getPeersFromDB();
    
    await checkNodes();
    await saveEnvironments();

    await getPeersFromNetwork();
    await pingAndSaveResults();

    await saveRuntime(counter, startedAt);
    process.exit()
} 


async function checkNodes(){
    let api_url_to_remove = [];
    for (let i = 0; i < nodes.length; i++) {
        let response = await nodeGetInfo(nodes[i].api_url, nodes[i].api_key);
        if (response) {
            nodes[i].environment = response.environment;
        } else {
            api_url_to_remove.push(nodes[i].api_url);
        }
    }

    api_url_to_remove.push('http://116.202.86.163:3001') // testing code

    //Make sure api_url_to_remove are unreachable
    for (let i = 0; i < api_url_to_remove.length; i++) {
        let index = nodes.findIndex(node => node.api_url === api_url_to_remove[i]);
        let response = await nodeGetInfo(nodes[index].api_url, nodes[index].api_key);
        if (response) {
            nodes[index].environment = response.environment;
            api_url_to_remove[i] = ''
        }
    }

    // remove unreachable nodes
    nodes = nodes.filter(node => {
        if(!api_url_to_remove.includes(node.api_url)) return node;
    })

    // Let on Element know that Nodes are down (if we didn't let know in the last 24h)
    if (api_url_to_remove.length > 0) {
        let alreadyInserted = await checkElementEventInLast24h('nodeOut', api_url_to_remove.length);
        if (!alreadyInserted){
            insertElementEvent('nodeOut', api_url_to_remove.length);
            reportToElement(`[Network Registry] ${api_url_to_remove.length} node out of ${nodesProvided} appears to be offline.`);    
        }
     }
}


async function saveEnvironments(){
    let environments = [];
    for (let i = 0; i < nodes.length; i++) {
        if ( !environments.includes(nodes[i].environment) ) environments.push(nodes[i].environment);
    }
    if ( !environments.includes(process.env.thegraph_environment) ) environments.push(process.env.thegraph_environment);
    await insertEnvironments(environments);
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
}

async function addPeerLocally(peerId, environment){
    if (peers.findIndex(peer => peer.peerId === peerId && peer.environment === environment) === -1){
        peers.push({peerId, environment});
        newPeers.push({peerId, environment});
    }
} 

async function pingAndSaveResults(){
    let numberOfPings = peers.length * nodes.length;
    for (let i = 0; i < peers.length; i++) {
        for (let n = 0; n < nodes.length; n++) {
            if(nodes[n].environment !== peers[i].environment) continue;
            let pingNumber = (i * nodes.length) + n+1;
            let percentage = Math.round(pingNumber / numberOfPings * 100)    
            console.log(`[${percentage}%] Ping ${pingNumber} out of ${numberOfPings} `)
            let ping = await nodePing(nodes[n].api_url, nodes[n].api_key, peers[i].peerId);
            if (ping?.hasOwnProperty('latency')) {
                console.log(`${peers[i].peerId} latency: ${ping.latency}`)
                insertPingLocally(peers[i].peerId, nodes[n].environment, ping.latency)
                counter++;
                break;
            }
        }
    }

    if (pings.length > 0) await insertPings(pings); 
}

function insertPingLocally(peerId, environment, latency){
    pings.push({peerId, environment, latency});
} 

async function saveRuntime(counter, startedAt){
    const runtime = Date.now() - startedAt;
    await insertRuntime(runtime, nodes.length, counter);
}



