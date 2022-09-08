import { nodeGetPeers, nodePing, getPeersFromSubGraph } from "./hopr-sdk.js";
import { selectPeerIds, insertPeerId, insertLastSeen, insertPing, insertRuntime } from "./mysql.js";


// const playground_url = 'red_elbe_elara.playground.hoprnet.org:3001'
// const playground_key = '5ef7fF7FaAF6FCe4ed#E3DC2'

// const nodes = ['null', 'zero', 'one', 'two', 'three', 'four'].map(elem=>{ return {
//     'api_url': `https://${elem}_${playground_url}`,
//     'api_key': playground_key
// }});

const all_keys = Object.keys(process.env);
const api_keys = all_keys.filter(key => key.includes('api_url_'));

const nodes = api_keys.map(key => {
    let number = key.replace('api_url_', '');
    if(all_keys.findIndex(key2 => key2 === 'api_url_' + number) && 
       all_keys.findIndex(key2 => key2 === 'api_key_' + number) ){
        return {api_url: process.env['api_url_' + number], api_key: process.env['api_key_' + number] }
    }
})

var peers = [];
var counter = 0;

main();

async function main (){
    peers = await getPeersFromDB();
    const startedAt = Date.now();
    await getPeersFromNetwork();
    await pingAndSaveResults();
    await saveRuntime(counter, startedAt);
    process.exit()
} 


async function getPeersFromDB (){
    const response = await selectPeerIds();
    const array = response.map(elem => elem.peerId);
    return array;
}

async function getPeersFromNetwork (){
    for (let i = 0; i < nodes.length; i++) {
        let response = await nodeGetPeers(nodes[i].api_url, nodes[i].api_key);
        if (!response) continue;
        for (let j = 0; j < response.announced.length; j++){
            await addPeer(response.announced[j].peerId, response.announced[j].lastSeen);
        }
    }

    let peersFromSubGraph = await getPeersFromSubGraph();
    for (let j = 0; j < peersFromSubGraph.length; j++){
        await addPeer(peersFromSubGraph[j]);
    }

    // TODO: combine all peers on BE, then add 'insertLastSeen'
}

async function addPeer(peerId, lastSeen){
    if (peers.findIndex(elem => elem === peerId) === -1){
        peers.push(peerId);
        await insertPeerId(peerId);
    }
    if (lastSeen) await insertLastSeen(peerId, lastSeen);
} 

async function pingAndSaveResults(){
    for (let i = 0; i < peers.length; i++) {
        let ping;
        for (let n = 0; n < nodes.length; n++) {
            ping = await nodePing(nodes[n].api_url, nodes[n].api_key, peers[i]);
            if (ping?.hasOwnProperty('latency')) {
                await insertPing(peers[i], ping.latency)
                counter++;
                break;
            }
        }
    }
}

async function saveRuntime(counter, startedAt){
    if(counter > 0) {
        const runtime = Date.now() - startedAt;
        await insertRuntime(runtime);
    }
}



