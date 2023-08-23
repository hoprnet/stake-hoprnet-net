import { Client } from 'pg'
import format from 'pg-format';

export default async function handler(req, res) {
  console.log("API: Hub: getSafes");
  const { ownerAddress } = req.body;

  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*') // replace this your actual origin
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'POST' && ownerAddress) {
    const DBLoginInfoPostgres = {
      user: process.env.POSTGRES_USERNAME,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE_NAME,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
    }
    const client = new Client(DBLoginInfoPostgres);
    await client.connect()
    const formattedQuery = format(`
      SELECT moduleAddress, safeAddress
      FROM staking_hub_safes 
      WHERE ownerAddress = '${ownerAddress}';
    `)
    const result = await client.query(formattedQuery);
    await client.end();
    res.status(200).json(result.rows ? result.rows : []);
  } else {
    res.status(200).json({});
  }
}