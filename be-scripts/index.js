import { nodeGetPeers, nodePing, getPeersFromSubGraph } from "./hopr-sdk.js";
import { selectPeerIds, insertPeerId, insertLastSeen, insertPing, insertRuntime } from "./mysql.js";


// const playground_url = 'red_elbe_elara.playground.hoprnet.org:3001'
// const playground_key = '5ef7fF7FaAF6FCe4ed#E3DC2'

// const nodes = ['null', 'zero', 'one', 'two', 'three', 'four'].map(elem=>{ return {
//     'api_url': `https://${elem}_${playground_url}`,
//     'api_key': playground_key
// }});

const nodes = [
    {api_url: `http://116.202.86.163:3001`, api_key: '^MYtoken4testing^' },
    {api_url: `http://95.216.69.52:3001`, api_key: '^MYtoken4testing^' },
    {api_url: `http://95.217.33.35:3001`, api_key: '^MYtoken4testing^' },
    {api_url: `http://136.243.109.98:3001`, api_key: '^MYtoken4testing^' },
    {api_url: `http://65.21.193.86:3001`, api_key: '^MYtoken4testing^' },
];

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
    // let array = await getPeersFromSubGraph();
    // console.log(array);

    // TODO: combine all peers on BE, then add 'insertLastSeen'
}

async function addPeer(peerId, lastSeen){
    if (peers.findIndex(elem => elem === peerId) === -1){
        peers.push(peerId);
        await insertPeerId(peerId);
    }
    await insertLastSeen(peerId, lastSeen);
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


