import {
    theDecentralisedGraphStakingUrlNewStakingTesting as theDecentralisedGraphStakingUrl,
    theCentralisedGraphStakingUrlNewStakingTesting as theCentralisedGraphStakingUrl
} from '../../../config';
import { request, gql } from 'graphql-request';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*') // replace this your actual origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    console.log("API: hub: subgraph (proxy)");
    let json = {};
    let connectionType = 'decentralised';
    let error = null;
    try {
        throw('just want centrelized')
        json = await request(theDecentralisedGraphStakingUrl, gql`${req.body}`);
        console.log(json?.stakeSeasons)
        const _meta_decentralised = JSON.parse(JSON.stringify(json._meta));
        const lastSyncTimestamp = json._meta.block.timestamp;
        const serverTimestamp = Date.now();
        const difference = Math.abs(serverTimestamp/1000-lastSyncTimestamp);
        if(difference > 120) {
            json = await request(theCentralisedGraphStakingUrl, gql`${req.body}`);
            json._meta_decentralised = {block : {..._meta_decentralised.block, difference}};
            connectionType = 'centralised';
            error = 'decentralised: difference > 120';
        } else if(json.stakeSeasons && json.stakeSeasons.length === 0 ) {
            console.log('if(json?.stakeSeasons === [])')
            json = await request(theCentralisedGraphStakingUrl, gql`${req.body}`);
            error = 'decentralised: json?.stakeSeasons === []';
            connectionType = 'centralised';
        } else if(  json.accounts &&
                    json.accounts.length === 1 &&
                    json.accounts[0].stakingParticipation &&
                    json.accounts[0].stakingParticipation.length === 0
                ) {
            json = await request(theCentralisedGraphStakingUrl, gql`${req.body}`);
            error = 'decentralised: json.accounts[0].stakingParticipation.length = []';
            connectionType = 'centralised';
        }
    } catch (e) {
        console.log('[Error: TheGraph]', e);
        error = e;
        json = await request(theCentralisedGraphStakingUrl, gql`${req.body}`);
        connectionType = 'centralised';
    }
    res.status(200).json({...json, connectionType, error});
}