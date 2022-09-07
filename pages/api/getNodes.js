import { getNodes } from '../../functions/mysql';

export default async function handler(req, res) {
  console.log('API: getNodes');
  const mysql =  await getNodes();
  console.log('mysql: ', mysql)
  res.status(200).json(mysql)
}