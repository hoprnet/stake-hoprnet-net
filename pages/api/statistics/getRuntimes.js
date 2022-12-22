import { getRuntimes } from '../../../utils/mysql';

export default async function handler(req, res) {
  console.log('API: getStats', req.query.env);
  const environmentId = req.query.env;
  const mysql = await getRuntimes(environmentId);
  res.status(200).json(mysql)
}