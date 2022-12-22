import { getEnvironmentsAndLastRun } from '../../utils/mysql';

export default async function handler(req, res) {
  console.log('API: getData');
  const mysql = await getEnvironmentsAndLastRun();
  const response = {
    envioronments: mysql[0],
    lastRuns: mysql[1],
    now: mysql[2][0].now,
  }
  res.status(200).json(response)
}