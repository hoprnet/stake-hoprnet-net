import { getSubGraphMeta } from "../../utils/subgraph"

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default async function handler(req, res) {
    const {
        lastSyncTimestamp,
        lastSyncBlockNumber
    } = await getSubGraphMeta();
    const serverTimestamp = Date.now();
    const difference = Math.abs(serverTimestamp/1000-lastSyncTimestamp);
    const text = `Difference between current AWS servers time and TheGraph last synced block time: ${difference.toFixed(2)}s (${timeAgo.format(lastSyncTimestamp*1000)})`;

    if(difference < 180) {
        res.status(200).json({ lastSyncTimestamp, serverTimestamp, text, lastSyncBlockNumber })
    } else {
        res.status(500).json({ lastSyncTimestamp, serverTimestamp, text, lastSyncBlockNumber })
    } 

}