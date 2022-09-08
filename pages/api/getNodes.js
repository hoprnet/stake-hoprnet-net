import { getNodes } from '../../utils/mysql';

export default async function handler(req, res) {
  console.log('API: getNodes');
  const mysql = await getNodes();
  res.status(200).json(mysql)
}