import fetch from 'node-fetch'
import yaml from 'js-yaml';
import { 
    nodePing, 
} from "./hopr-sdk.js";
import { 
    getPRNStatus,
    insertPRNStatus,
    insertElementEvent,
    insertElementEvents,
    checkElementEventInLastH
} from "./mysql.js";
import {
    reportToElement
} from './element.js'
import {
    groupItemsByEnvironments
} from "./common-functions.js";

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' });

var publicRelayNodes = [];
var nodes = [];
var nodesProvided;

var counter = 0;
var numberOfPings = 0;

// Test PRNs
var prnDown = [];
var prnUp = [];

// FromDB
var lastUp = [];
var lastDown = [];

// Segregated
var stillUp = [];
var stillDown = [];1
var newlyUp = [];
var newlyDown = [];


export async function pingBotPRN (inputNodes){
    nodes = inputNodes;
    nodesProvided = inputNodes.length;

    await getPRNs();
    prepareData();
    await testPRNs();
    await segregateData();
    await updateDB();
    await informOnElement();
} 


async function getPRNs(){
    const url = "https://raw.githubusercontent.com/hoprnet/hopr-public-relay-nodes/main/known_public_relays.yml";
    const response = await fetch(url);
    const yml = await response.text();
    const yml_spaces = yml.replaceAll('\t', ' ');
    publicRelayNodes = yaml.load(yml_spaces).environments;
}

function prepareData() {
    const prnEnvironmentsKeys = Object.keys(publicRelayNodes);
    var prnEnvironmentsLength = 0;
    for (let e = 0; e < prnEnvironmentsKeys.length; e++) {
        prnEnvironmentsLength += publicRelayNodes[prnEnvironmentsKeys[e]].length;
    }
    numberOfPings = prnEnvironmentsLength * nodes.length;

    nodes = groupItemsByEnvironments(nodes);
//    publicRelayNodes = groupItemsByEnvironments(publicRelayNodes);
}

async function testPRNs(){
    const nodeEnvironments = Object.keys(nodes);
    for (let e = 0; e < nodeEnvironments.length; e++) {
        let workingEnv = nodeEnvironments[e];
        let nodesOnEnv = nodes[nodeEnvironments[e]];
        let prnOnEnv = publicRelayNodes[nodeEnvironments[e]];

        for (let p = 0; p < prnOnEnv.length; p++) {
            let online = false;
            const peerId = prnOnEnv[p].peer_id;

            for (let n = 0; n < nodesOnEnv.length; n++) {
                let pingNumber = (p * nodesOnEnv.length) + n+1;
                let percentage = Math.round(pingNumber / numberOfPings * 100);
                console.log(`[${percentage}%] Ping PRN ${pingNumber} out of ${numberOfPings} `);
                let ping = await nodePing(nodesOnEnv[n].api_url, nodesOnEnv[n].api_key, peerId);
                if (ping?.hasOwnProperty('latency')) {
                    console.log(`${peerId} latency: ${ping.latency}`);
                    counter++;
                    online = true;
                    break;
                }
            }

            if (online) prnUp.push(peerId)
            else prnDown.push(peerId);
        }
    }
}

async function segregateData() {
    const prnLastStatus = await getPRNStatus();

    for(let i = 0; i < prnLastStatus.length; i++) {
        if(prnLastStatus[i].status === 'up') lastUp.push(prnLastStatus[i].peerId)
        else lastDown.push(prnLastStatus[i].peerId)
    }

    for(let i = 0; i < prnDown.length; i++) {
        if(lastDown.includes(prnDown[i])) stillDown.push(prnDown[i])
        else newlyDown.push(prnDown[i])
    }

    for(let i = 0; i < prnUp.length; i++) {
        if(lastDown.includes(prnUp[i])) newlyUp.push(prnUp[i])
        else stillUp.push(prnUp[i])
    }

}

async function updateDB() {
    let payload = [];
    prnUp.map(peerId => payload.push({status: 'up', peerId}));
    prnDown.map(peerId => payload.push({status: 'down', peerId}));

    await insertPRNStatus(payload);
}

async function informOnElement(){
//    console.log({ stillUp, stillDown, newlyUp, newlyDown });

    // Prepare message
    let msg = `[Public Relay Node]    //message is triggered only if sth change\n`;
    if (newlyDown.length > 0) {
        msg += `${newlyDown.length} node${newlyDown.length === 1 ? '' : 's'} appear${newlyDown.length === 1 ? 's' : ''} to be offline.`;
        newlyDown.map(peerId => msg += `\n- ${peerId}`);
        if(newlyUp.length > 0) {
            msg += `\n\n${newlyUp.length} node${newlyUp.length === 1 ? ' is' : 's are'} back online:`;
            newlyUp.map(peerId => msg += `\n- ${peerId}`);
        }
    } else if(newlyUp.length > 0) {
        msg += `\n${newlyUp.length} node${newlyUp.length === 1 ? ' is' : 's are'} back online:`;
        newlyUp.map(peerId => msg += `\n- ${peerId}`);
    }

    if(stillUp.length > 0 || stillDown.length > 0) msg += `\n----------`;

    if(stillUp.length > 0) {
        msg += `\n\n${stillUp.length} node${stillUp.length === 1 ? ' is' : 's are'} still online:`;
        stillUp.map(peerId => msg += `\n- ${peerId}`);
    }
    if(stillDown.length > 0) {
        msg += `\n\n${stillDown.length} node${stillDown.length === 1 ? ' is' : 's are'} still offline:`;
        stillDown.map(peerId => msg += `\n- ${peerId}`);
    }

    // Send message if needed
    if (newlyDown.length > 0 || newlyUp.length > 0) {
        await reportToElement(msg);
    }

}


