import { getStats } from '../../../utils/mysql';

export default async function handler(req, res) {
  console.log('API: getStats', req.query.env);
  const environmentId = req.query.env;
  const year = req.query.year;
  const month = req.query.month;
  const mysql = await getStats(environmentId, year, month);
  res.status(200).json(mysql)
}