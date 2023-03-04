import { theGraphStakingUrl } from '../../config';
import { request, gql } from 'graphql-request';

export default async function handler(req, res) {
    console.log("API: subgraph (proxy)");
    const json = await request(theGraphStakingUrl, gql`${req.body}`);
    res.status(200).json(json);
}