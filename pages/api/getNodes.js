import { getNodes } from '../../utils/mysql';

export default async function handler(req, res) {
  console.log('API: getNodes', req.query.env);
  const environmentId = req.query.env;
  const mysql = await getNodes(environmentId);
  res.status(200).json(mysql)
}