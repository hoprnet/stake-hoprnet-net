import { 
    checkNodes
} from "./pre-checkNodes.js";
import { 
    nodePing, 
} from "./hopr-sdk.js";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, './../../.env') });

const all_keys = Object.keys(process.env);
const api_keys = all_keys.filter(key => key.includes('api_url_'));

var nodes = api_keys.map(key => {
    let number = key.replace('api_url_', '');
    if(all_keys.findIndex(key2 => key2 === 'api_url_' + number) && 
       all_keys.findIndex(key2 => key2 === 'api_key_' + number) ){
        return {api_url: process.env['api_url_' + number], api_key: process.env['api_key_' + number] }
    }
});

let peerId = {};
process.argv.forEach(function (val) {
   if(val.slice(0,8) === 'peer-id=') {
        peerId = val.slice(8);
   }
});

//peerId = '16Uiu2HAkwwW8ALSZFzgnjvm2zUmc1SckYpx8zGxuBdNMffdvyLRY';

console.log(nodes)

ping ();

async function ping () {
    console.log(`[${new Date().toUTCString()}] Starting`)
    nodes = await checkNodes(nodes);

    for (let n = 0; n < nodes.length; n++) {
        let percentage = Math.round(n / nodes.length * 100);
        console.log(`[${new Date().toUTCString()}] [${percentage}%] Ping ${n+1} out of ${nodes.length} nodes)`)

        let ping = await nodePing(nodes[n].api_url, nodes[n].api_key, peerId);
        if (ping?.hasOwnProperty('latency')) {
            console.log(`[${new Date().toUTCString()}] ${peerId} latency: ${ping.latency}`)
        } else {
            console.warn(`[${new Date().toUTCString()}] ${peerId} pong: `, ping)
        }
    }
}
