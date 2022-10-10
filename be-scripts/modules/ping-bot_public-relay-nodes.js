import { 
    nodePing, 
} from "./hopr-sdk.js";
import {
    reportToElement
} from './element.js'
import {
    groupItemsByEnvironments
} from "./common-functions.js";

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' });

const all_keys = Object.keys(process.env);
const prn_keys = all_keys.filter(key => key.includes('prn_') && !key.includes('environment'));

var publicRelayNodes = prn_keys.map(key => {
    let number = key.replace('prn_', '');
    if(all_keys.findIndex(key2 => key2 === 'prn_' + number) ){
        return {peerId: process.env['prn_' + number], environment: process.env['prn_' + number + "_environment"]  }
    }
});

var nodes = [];
var nodesProvided = 0;

var counter = 0;
var numberOfPings;


export async function pingBotPRN (inputNodes){
    nodes = inputNodes;
    nodesProvided = inputNodes.length;

    prepareData();
    await pingAndSendResults();
} 

function prepareData() {
    numberOfPings = publicRelayNodes.length * nodes.length;
    nodes = groupItemsByEnvironments(nodes);
    publicRelayNodes = groupItemsByEnvironments(publicRelayNodes);
}

async function pingAndSendResults(){
    const nodeEnvironments = Object.keys(nodes);
    var prcDown = [];

    for (let e = 0; e < nodeEnvironments.length; e++) {
        let workingEnv = nodeEnvironments[e];
        let nodesOnEnv = nodes[nodeEnvironments[e]];
        let peersOnEnv = publicRelayNodes[nodeEnvironments[e]];

        for (let p = 0; p < peersOnEnv.length; p++) {
            let online = false;
            for (let n = 0; n < nodesOnEnv.length; n++) {
                if(nodesOnEnv[n].environment !== peersOnEnv[p].environment) continue;

                let pingNumber = (p * nodesOnEnv.length) + n+1;
                let percentage = Math.round(pingNumber / numberOfPings * 100);
                console.log(`[${percentage}%] Ping PRN ${pingNumber} out of ${numberOfPings} `)
                let ping = await nodePing(nodesOnEnv[n].api_url, nodesOnEnv[n].api_key, peersOnEnv[p].peerId);
                if (ping?.hasOwnProperty('latency')) {
                    console.log(`${peersOnEnv[p].peerId} latency: ${ping.latency}`)
                    counter++;
                    online = true;
                    break;
                }
            }
            if (!online) prcDown.push(peersOnEnv[p].peerId);
        }

    }

    if (prcDown.length > 0) {
        var msg = `[Public Relay Node] ${prcDown.length} node${prcDown.length === 1 ? '' : 's'} appear${prcDown.length === 1 ? 's' : ''} to be offline.`;
        prcDown.map(id => msg += `\n- ${id}`);
        await reportToElement(msg);
    }

}

