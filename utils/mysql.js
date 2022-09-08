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

const queryDBTransaction = async (query1, query2, query3, query4) => {
  try {
    let results;
    if (query4) {
      results = await db.transaction()
      .query(query1)
      .query(query2)
      .query(query3)
      .query(query4)
      .commit() // execute the queries
    } else if (query3) {
      results = await db.transaction()
      .query(query1)
      .query(query2)
      .query(query3)
      .commit() // execute the queries
    } else {
      results = await db.transaction()
      .query(query1)
      .query(query2)
      .commit() // execute the queries
    }
 //   let results = await db.transaction()
 //   console.log(arguments)
  //  arguments.map(query => {db.query(query)});
  //  db.commit();
    await db.end();
    return results;
  } catch (error) {
    throw error
  }
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

