import { getEnvironments } from '../../utils/mysql';

export default async function handler(req, res) {
  console.log('API: getEnvironments');
  const mysql = await getEnvironments();
  res.status(200).json(mysql)
}