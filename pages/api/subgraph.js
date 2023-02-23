import { theGraphStakingUrl } from '../../config'

export default async function handler(req, res) {
    console.log("API: subgraph (proxy)");
    const response = await fetch(theGraphStakingUrl, {
        method: "POST",
        body: JSON.stringify(req.body)
    });
    const json = await response.json();
    res.status(200).json(json);
}