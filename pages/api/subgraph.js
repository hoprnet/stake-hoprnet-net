import { theDecentralisedGraphStakingUrl, theCentralisedGraphStakingUrl } from '../../config';
import { request, gql } from 'graphql-request';

export default async function handler(req, res) {
    console.log("API: subgraph (proxy)");
    let json = {};
    let connectionType = 'decentralised';
    try {
        json = await request(theDecentralisedGraphStakingUrl, gql`${req.body}`);
        
        const _meta_decentralised = JSON.parse(JSON.stringify(json._meta));
        const lastSyncTimestamp = json._meta.block.timestamp;
        const serverTimestamp = Date.now();
        const difference = Math.abs(serverTimestamp/1000-lastSyncTimestamp);
        if(difference > 120) {
            json = await request(theCentralisedGraphStakingUrl, gql`${req.body}`);
            json._meta_decentralised = {block : {..._meta_decentralised.block, difference}};
        }
    } catch (e) {
        console.log('[Error: TheGraph]', e);
        json = await request(theCentralisedGraphStakingUrl, gql`${req.body}`);
        connectionType = 'centralised';
    }
    res.status(200).json({...json, connectionType});
}