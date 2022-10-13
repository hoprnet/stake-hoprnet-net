import { 
    nodeGetInfo,
} from "./hopr-sdk.js";
import { 
    insertElementEvent,
    checkElementEventInLast24h
} from "./mysql.js";
import {
    reportToElement
} from './element.js'


export async function checkNodes(nodes){
    let api_url_to_remove = [];
    const nodesProvided = nodes.length;

    for (let i = 0; i < nodes.length; i++) {
        let response = await nodeGetInfo(nodes[i].api_url, nodes[i].api_key);
        if (response && response.environment) {
            nodes[i].environment = response.environment;
        } else {
            api_url_to_remove.push(nodes[i].api_url);
        }
    }

 //   api_url_to_remove.push('http://116.202.86.163:3001') // testing code

    //Make sure api_url_to_remove are unreachable
    for (let i = 0; i < api_url_to_remove.length; i++) {
        let index = nodes.findIndex(node => node.api_url === api_url_to_remove[i]);
        let response = await nodeGetInfo(nodes[index].api_url, nodes[index].api_key);
        if (response && response.environment) {
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
            var msg = `[Network Dashboard] ${api_url_to_remove.length} node${api_url_to_remove.length === 1 ? '' : 's'} out of ${nodesProvided} appear${api_url_to_remove.length === 1 ? 's' : ''} to be offline.`;
            api_url_to_remove.map(id => msg += `\n- ${id}`);
            await reportToElement(msg);    
        }
    }

    return nodes;
}
