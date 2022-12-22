import { getLast7daysOnlineByPeers } from '../../../utils/mysql';

export default async function handler(req, res) {
  console.log('API: getLast7daysOnlineByPeers', req.query.env);
  const environmentId = req.query.env;
  const mysql = await getLast7daysOnlineByPeers(environmentId);
  let result = [
    { name: "1+ ping", data: [] },
    { name: "10%+ time online", data: [] },
    { name: "10%+ time online", data: [] },
    { name: "30%+ time online", data: [] },
    { name: "40%+ time online", data: [] },
    { name: "50%+ time online", data: [] },
    { name: "60%+ time online", data: [] },
    { name: "70%+ time online", data: [] },
    { name: "80%+ time online", data: [] },
    { name: "90%+ time online", data: [] },
    { name: "100% time online", data: [] },
  ]
  for (let i = 0; i < mysql.length; i++) {
    if(!mysql[i].count10) continue;
    result[0].data.push({ x: mysql[i].DAY, y: mysql[i].COUNT });
    result[1].data.push({ x: mysql[i].DAY, y: mysql[i].count10 });
    result[2].data.push({ x: mysql[i].DAY, y: mysql[i].count20 });
    result[3].data.push({ x: mysql[i].DAY, y: mysql[i].count30 });
    result[4].data.push({ x: mysql[i].DAY, y: mysql[i].count40 });
    result[5].data.push({ x: mysql[i].DAY, y: mysql[i].count50 });
    result[6].data.push({ x: mysql[i].DAY, y: mysql[i].count60 });
    result[7].data.push({ x: mysql[i].DAY, y: mysql[i].count70 });
    result[8].data.push({ x: mysql[i].DAY, y: mysql[i].count80 });
    result[9].data.push({ x: mysql[i].DAY, y: mysql[i].count90 });
    result[10].data.push({ x: mysql[i].DAY, y: mysql[i].count100 });
  }
  res.status(200).json(result)
}