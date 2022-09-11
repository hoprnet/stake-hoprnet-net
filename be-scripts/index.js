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
    insertEnvironments
} from "./mysql.js";


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

    api_url_to_remove.push('http://116.202.86.163:3001')

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
    // let numberOfPings = peers.length * nodes.length;
    // for (let i = 0; i < peers.length; i++) {
    //     for (let n = 0; n < nodes.length; n++) {
    //         let pingNumber = (i * nodes.length) + n+1;
    //         let percentage = Math.round(pingNumber / numberOfPings * 100)    
    //         console.log(`[${percentage}%] Ping ${pingNumber} out of ${numberOfPings} `)
    //         let ping = await nodePing(nodes[n].api_url, nodes[n].api_key, peers[i].peerId);
    //         if (ping?.hasOwnProperty('latency')) {
    //             console.log(`${peers[i].peerId} latency: ${ping.latency}`)
    //             insertPingLocally(peers[i].peerId, nodes[n].environment, ping.latency)
    //             counter++;
    //             break;
    //         }
    //     }
    // }

    // pings = [
    //     {
    //       peerId: "16Uiu2HAkuuEMzMcYHYRaPabbLS4zRr6mYTQvUSu18X8Sfny5QGFy",
    //       environment: "paleochora",
    //       latency: 131,
    //     },
    //     {
    //       peerId: "16Uiu2HAkvyDBGKr7yvCrxjVLSJtcdjZxWLCct6d1Lm6HBt9XiSmu",
    //       environment: "paleochora",
    //       latency: 94,
    //     },
    //     {
    //       peerId: "16Uiu2HAkxL3DsnMybGsqPg6pJsqkdtBXTg6f5SWs9kQ2gfrQ6ftn",
    //       environment: "paleochora",
    //       latency: 276,
    //     },
    //     {
    //       peerId: "16Uiu2HAky56e6ofJ6dayRZqDa7QSvWtoRVfn34pCnjXqdP62Spzs",
    //       environment: "paleochora",
    //       latency: 202,
    //     },
    //     {
    //       peerId: "16Uiu2HAm11bGJSNJ61g2UnEDh7gRPkw13ZMNkT5qdRfyViSVTDWt",
    //       environment: "paleochora",
    //       latency: 86,
    //     },
    //     {
    //       peerId: "16Uiu2HAm3BNqTmwtkFhUdvdD1hg4bYD4HaLP9JDqyKpb93q4wrsh",
    //       environment: "paleochora",
    //       latency: 164,
    //     },
    //     {
    //       peerId: "16Uiu2HAm3dq3EBLzPGWS5D1e7jweQ8fwyMvTb3riq6xDcQbCBtwd",
    //       environment: "paleochora",
    //       latency: 168,
    //     },
    //     {
    //       peerId: "16Uiu2HAm774i9ERXgWqAHRqgK5waH6HdZfmAFa5FkyfkZPb6ZrUu",
    //       environment: "paleochora",
    //       latency: 244,
    //     },
    //     {
    //       peerId: "16Uiu2HAm9P8fvWN5TB49yQapp2NyRY9TsKKMtjb8dzpgCobt7cDe",
    //       environment: "paleochora",
    //       latency: 202,
    //     },
    //     {
    //       peerId: "16Uiu2HAmBCwReYMGdT6Pt9pPVGBY7waME3HMuY1CsER5gbPN4NTo",
    //       environment: "paleochora",
    //       latency: 1185,
    //     },
    //     {
    //       peerId: "16Uiu2HAmDaSvG8xbvN3A8VZt94a4KvUCBRpBjdnrKnRkkkaBw2WW",
    //       environment: "paleochora",
    //       latency: 282,
    //     },
    //     {
    //       peerId: "16Uiu2HAmDBEQyPQbSvdUuAgm48evrjkVpbhibFCRCLxHXFtgixop",
    //       environment: "paleochora",
    //       latency: 261,
    //     },
    //     {
    //       peerId: "16Uiu2HAmDyN7ApEZYPiEayEbys3Dhq65J5CmcWYHcGRCz4FcwZe3",
    //       environment: "paleochora",
    //       latency: 171,
    //     },
    //     {
    //       peerId: "16Uiu2HAmGzYzFAjgSFCfJJwSXxBugDe1odAf7Vf4UscLA8P4GNKw",
    //       environment: "paleochora",
    //       latency: 163,
    //     },
    //     {
    //       peerId: "16Uiu2HAmHy32g1ESNT9Gnai4q6XrbSmAgn87jnCVvHg6yGpgCW3R",
    //       environment: "paleochora",
    //       latency: 202,
    //     },
    //     {
    //       peerId: "16Uiu2HAmLk2YSxtfC7FzxQmuK1KD9SuTdXB5euqtPADufjKSYXtH",
    //       environment: "paleochora",
    //       latency: 193,
    //     },
    //     {
    //       peerId: "16Uiu2HAmLwWnuYcTLizvwim8o7tiBqyiDdmj9taatAKE4Bt83yFp",
    //       environment: "paleochora",
    //       latency: 314,
    //     },
    //     {
    //       peerId: "16Uiu2HAmMgwjUg7LuJ2c1usswYYTKpyZQpksjc1knxPZhd4NgRhD",
    //       environment: "paleochora",
    //       latency: 41,
    //     },
    //     {
    //       peerId: "16Uiu2HAmRUxdDV2gJEyViudUiW3W3AtkkYdnFrNt5hfEvzpE4LEp",
    //       environment: "paleochora",
    //       latency: 213,
    //     },
    //     {
    //       peerId: "16Uiu2HAmTQJLAcmkcDidMRrzcGCfVEatLmsEm3CtwgdpdRx9qd7Q",
    //       environment: "paleochora",
    //       latency: 114,
    //     },
    //     {
    //       peerId: "16Uiu2HAmTzCVr8vhnETbYkxge578vLoJZJxz4UySLdKznRBSuLNg",
    //       environment: "paleochora",
    //       latency: 173,
    //     },
    //     {
    //       peerId: "16Uiu2HAmVria8S3hA3JYcnBbQSz9zNThBkvMANNQQ7418ZT1nGNh",
    //       environment: "paleochora",
    //       latency: 162,
    //     }
    //   ]

    if (pings.length > 0) await insertPings(pings); 
}

function insertPingLocally(peerId, environment, latency){
    pings.push({peerId, environment, latency});
} 

async function saveRuntime(counter, startedAt){
    const runtime = Date.now() - startedAt;
    await insertRuntime(runtime, nodes.length, counter);
}



