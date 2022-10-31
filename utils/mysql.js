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

export async function getEnvironmentsAndLastRun () {
  console.log('MySQL: getEnvironmentsAndLastRun');
  let transaction = db.transaction();
  transaction.query(escape`
    SELECT *
    FROM \`environments\` 
  `);
  transaction.query(escape`
    SELECT 
      numberOfWorkingNodes, 
      positivePings, 
      environmentId, 
      MAX(finishedAt) as lastRun
    FROM 
      runtimes 
    GROUP BY 
      environmentId;
  `);
  const query = await transaction.commit()
  await db.end();
  return query;
}



export async function getNodes (environmentId) {
  console.log('MySQL: getNodes');
  const countPingsSince = 1667080800;
  let query = await queryDB(escape`
      SELECT 
        nr.peerId AS peerId, 
        MAX(pings.timestamp) AS lastSeen,
        AVG(pings.latency) AS latencyAverage,
        since1667080800.count AS count,
        registered,
        communityId,
        (    since1667080800.count / 
        (    SELECT count(*) FROM runtimes WHERE ( finishedAt ) > nr.addedAt AND environmentId = ${environmentId} AND finishedAt > from_unixtime(${countPingsSince}) ) )    
        AS availability,
        (   last24h.pings / 
        (   SELECT count(*) FROM runtimes WHERE ( finishedAt ) > (NOW() - INTERVAL 24 HOUR) AND environmentId = 36 ) )    
        AS availability24h
      FROM \`node-registry\` AS nr
      LEFT JOIN (
        SELECT count(*) as pings, peerId FROM pings WHERE pings.timestamp >= (NOW() - INTERVAL 24 HOUR) GROUP BY pings.peerId
      ) AS last24h ON nr.id = last24h.peerId
      LEFT JOIN (
        SELECT count(*) as count, peerId FROM pings WHERE pings.timestamp > from_unixtime(${countPingsSince}) GROUP BY pings.peerId
      ) AS since1667080800 ON nr.id = since1667080800.peerId
      LEFT JOIN \`last-seen\` AS ls ON nr.id = ls.peerId  
      LEFT JOIN pings ON nr.id = pings.peerId
      WHERE nr.environmentId = ${environmentId}
      GROUP BY nr.peerId  
      ORDER BY availability DESC, peerId ASC
  `);
  return query;
}
//         (    SELECT count(*) FROM runtimes WHERE ( finishedAt - INTERVAL runtime HOUR ) > nr.addedAt AND nr.environmentId = ${environmentId} ) )   
//runtimes add envs
