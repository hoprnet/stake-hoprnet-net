import { getRewards } from '../../utils/mysql';

export default async function handler(req, res) {
    console.log("API: getRewards", req.query.peerId);
    const mysql = await getRewards(req.query.peerId);
    res.status(200).json(mysql)
}