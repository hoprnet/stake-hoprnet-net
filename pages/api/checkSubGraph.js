import { getSubGraphTimeStamp } from "../../utils/subgraph"

export default async function handler(req, res) {
    const subgraphTimestamp = await getSubGraphTimeStamp();
    const serverTimestamp = Date.now();
    const difference = Math.abs(serverTimestamp/1000-subgraphTimestamp);
    const text = `Difference between your time and TheGraph last synced block time: ${difference.toFixed(2)}s`;

    if(difference < 180) {
        res.status(200).json({ subgraphTimestamp, serverTimestamp, text })
    } else {
        res.status(500).json({ subgraphTimestamp, serverTimestamp, text })
    } 

}