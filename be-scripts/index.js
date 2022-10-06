import { 
    checkNodes
} from "./sub-scripts/pre-checkNodes.js";

import { 
    pingBotAll
} from "./sub-scripts/ping-bot_all.js";

import {
    pingBotPRN
} from "./sub-scripts/ping-bot_public-relay-nodes.js"

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' });

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
});

main();

async function main (){
    //TODO: maybe add a check if the tables are created in the DB?
    nodes = await checkNodes(nodes);
    await pingBotPRN(nodes);
    await pingBotAll(nodes);

    process.exit()
} 
