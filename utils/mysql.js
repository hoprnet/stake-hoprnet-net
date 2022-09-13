import mysql from 'serverless-mysql';
import escape from 'sql-template-strings';

const db = mysql({
  config: {
    host     : process.env.MYSQL_HOST,
    database : process.env.MYSQL_DATABASE_NAME,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD
  }
})

const queryDB = async (query) => {
  let results = await db.query(query);
  await db.end();
  return results
}


export async function getEnvironments () {
  console.log('MySQL: getEnvironments');
  let query = await queryDB(escape`
      SELECT *
      FROM \`environments\` 
  `);
  return query;
}



export async function getNodes () {
  console.log('MySQL: getNodes');
  let query = await queryDB(escape`
      SELECT 
        nr.peerId AS peerId, 
        ls.lastSeen AS lastSeen,
        count(pings.peerId) AS count,
        AVG(pings.latency) AS latencyAverage,
        (    count(pings.peerId) / 
        (    SELECT MAX(count) FROM (SELECT count(peerId) as count FROM pings GROUP BY peerId) AS max )    )    
        AS availability
      FROM \`node-registry\` AS nr
      LEFT JOIN \`last-seen\` AS ls ON nr.id = ls.peerId  
      LEFT JOIN pings ON nr.id = pings.peerId
      GROUP BY nr.peerId  
      ORDER BY count DESC, peerId ASC
  `);
  return query;
}

