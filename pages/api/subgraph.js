import { theDecentralisedGraphStakingUrl, theCentralisedGraphStakingUrl } from '../../config';
import { request, gql } from 'graphql-request';

export default async function handler(req, res) {
    console.log("API: subgraph (proxy)");
    let json = {};
    let connectionType = 'decentralised';
    try {
        json = await request(theDecentralisedGraphStakingUrl, gql`${req.body}`);
    } catch (e) {
        console.log('[Error: TheGraph]', e);
        // json = await request(theCentralisedGraphStakingUrl, gql`${req.body}`);
        // connectionType = 'centralised';
    }
    res.status(200).json({...json, connectionType});
}