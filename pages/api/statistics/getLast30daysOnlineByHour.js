import { getLast30daysOnlineByHour } from '../../../utils/mysql';


export default async function handler(req, res) {
  console.log('API: getLast30daysOnlineByHour', req.query.env);
  const environmentId = req.query.env;
  const mysql = await getLast30daysOnlineByHour(environmentId);
  let parsed = [];
  for (let i = 0; i < mysql.length; i++) {
    if (mysql[i].count < 10 && mysql[i+1].count > 10) {
      continue;
    }

    if (mysql[i+1]){
      let msSinceHourStarted_i = Date.parse(mysql[i].timestamp)%(1000 * 60 * 60);
      let msSinceHourStarted_i1 = Date.parse(mysql[i+1].timestamp)%(1000 * 60 * 60);
      if (msSinceHourStarted_i > 3582000 && msSinceHourStarted_i1 < 42000 ) {
        parsed.push(
          {
            count: mysql[i].count + mysql[i+1].count,
            y: mysql[i].count + mysql[i+1].count,
            timestamp: mysql[i].count,
            time: mysql[i].time,
            x: mysql[i].time,
          }
        )
        i++;
        continue;
      }
    }

    parsed.push({
      count: mysql[i].count,
      y: mysql[i].count,
      timestamp: mysql[i].count,
      time: mysql[i].time,
      x: mysql[i].time,
    })
  }

  res.status(200).json(parsed)
}