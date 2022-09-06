import mysql from 'serverless-mysql';
import escape from 'sql-template-strings';
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' });

// *** SIMPLE VERSION *** //
// CREATE TABLE `node-registry-simple` (
//   `id` BIGINT UNIQUE AUTO_INCREMENT, 
//   `peerId` varchar(100), 
//   `ping` INT, 
//    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//    PRIMARY KEY (id)
//   ) 
//


// *** RELATIVE VERSION *** //
// CREATE TABLE `node-registry` (
//   `id` INT UNIQUE AUTO_INCREMENT, 
//   `peerId` varchar(200) UNIQUE, 
//    PRIMARY KEY (id)
//   ) 
//
//   CREATE TABLE `pings` (
//     `id` INT UNIQUE AUTO_INCREMENT, 
//     `peerId` INT, 
//     `latency` INT, 
//      `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//      PRIMARY KEY (id),
//      FOREIGN KEY (peerId) REFERENCES `node-registry`(id)
//   ) 
//
// CREATE TABLE `last-seen` (
//   `peerId` INT UNIQUE, 
//   `lastSeen` BIGINT, 
//    FOREIGN KEY (peerId) REFERENCES `node-registry`(id)
// ) 
//
// CREATE TABLE `runtimes` (
//   `id` INT UNIQUE AUTO_INCREMENT, 
//   `runtime` BIGINT,
//   `finishedAt`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// ) 


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

export async function insertPeerId (peerId) {
    console.log('MySQL: insertPeerId', peerId);
    await queryDB(escape`
      INSERT INTO \`node-registry\` (peerId) VALUES (${peerId})
      ON DUPLICATE KEY UPDATE id=id;
    `)
}

export async function selectPeerIds () {
  console.log('MySQL: selectPeerIds');
  let query = await queryDB(escape`
    SELECT peerId FROM  \`node-registry\` 
  `);
  return query;
}

export async function insertLastSeen (peerId, lastSeen) {
  console.log('MySQL: insertLastSeen', peerId, lastSeen);
  await queryDB(escape`
    INSERT INTO \`last-seen\` (peerId, lastSeen) VALUES (
      (SELECT id FROM \`node-registry\` WHERE peerId = ${peerId}), ${lastSeen})
    ON DUPLICATE KEY UPDATE 
    lastSeen = IF(VALUES(lastSeen) > lastSeen, VALUES(lastSeen), lastSeen);
  `)
}

export async function insertPing (peerId, latency) {
  console.log('MySQL: insertPing', peerId, latency);
  await queryDB(escape`
    INSERT INTO pings (peerId, latency) VALUES (
      (SELECT id FROM \`node-registry\` WHERE peerId = ${peerId}), 
      ${latency}
    )
  `)
}

export async function insertRuntime (runtime) {
  console.log('MySQL: insertRuntime', runtime);
  await queryDB(escape`
    INSERT INTO runtimes (runtime) VALUES (${runtime})
  `)
}
