import mysql from 'serverless-mysql';
import escape from 'sql-template-strings';
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' });


// *** RELATIVE DB *** //
// CREATE TABLE `node-registry` (
//   `id` INT UNIQUE AUTO_INCREMENT, 
//   `peerId` varchar(200), 
//   `environmentId` INT, 
//    PRIMARY KEY (id),
//    FOREIGN KEY (environmentId) REFERENCES `environments`(id),
//    UNIQUE KEY `unique_index` (`peerId`,`environmentId`)
//   ) 

//   CREATE TABLE `pings` (
//     `id` INT UNIQUE AUTO_INCREMENT, 
//     `peerId` INT, 
//     `latency` INT, 
//      `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//      PRIMARY KEY (id),
//      FOREIGN KEY (peerId) REFERENCES `node-registry`(id)
//   ) 

// CREATE TABLE `last-seen` (
//   `peerId` INT UNIQUE, 
//   `lastSeen` BIGINT, 
//    FOREIGN KEY (peerId) REFERENCES `node-registry`(id)
// ) 

// CREATE TABLE `runtimes` (
//   `id` INT UNIQUE AUTO_INCREMENT, 
//   `runtime` BIGINT,
//   `numberOfWorkingNodes` INT,
//   `positivePings` INT,
//   `finishedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// ) 

// CREATE TABLE `environments` (
//   `id` INT UNIQUE AUTO_INCREMENT, 
//   `environment` varchar(200) UNIQUE, 
// PRIMARY KEY (id) 
// );


const db = mysql({
  config: {
    host     : process.env.MYSQL_HOST,
    database : process.env.MYSQL_DATABASE_NAME,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD
  }
})

const queryDB = async (query, data) => {
  let results = await db.query(query, data);
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
    `)
}

export async function insertPeerIds (peerIds) {
  console.log('MySQL: insertPeerIds', peerIds.length);
  let transaction = db.transaction();
  for (let i = 0; i < peerIds.length; i++) {
    transaction.query(escape`INSERT INTO \`node-registry\` (peerId, environmentId) VALUES (${peerIds[i].peerId}, (SELECT \`id\` FROM \`environments\` WHERE environment = ${peerIds[i].environment}));`)
  }
  await transaction.commit()
  await db.end();
}

export async function selectPeerIds () {
  console.log('MySQL: selectPeerIds');
  let query = await queryDB(escape`
    SELECT peerId, (SELECT environment FROM environments WHERE id = environmentId) AS environment  FROM  \`node-registry\` 
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
  try {
    await queryDB(escape`
      INSERT INTO pings (peerId, latency) VALUES (
        (SELECT id FROM \`node-registry\` WHERE peerId = ${peerId}), 
        ${latency}
      )
    `)
  } catch (e) {
    console.error('ERROR [MySQL] insertPing:', e);
    // for (let i = 0; i < 5; i++){
    //   console.log(`MySQL: Trying function insertPing again (${i})`);
    //   await new Promise(r => setTimeout(r, 1000));
    //   await insertPing(peerId, latency);
    // }
  }
}

export async function insertPings (pings) {
  console.log('MySQL: insertPings', pings.length);

  let transaction = db.transaction();
  for (let i = 0; i < pings.length; i++) {
    let latency = pings[i].latency;
    let peerId = pings[i].peerId;
    let environment = pings[i].environment;
    transaction.query(escape`INSERT INTO pings (peerId, latency) VALUES ( (SELECT id FROM \`node-registry\` WHERE peerId = ${peerId} AND environmentId = (SELECT id FROM \`environments\` WHERE environment = ${environment})), ${latency} );`)
  }
  await transaction.commit()
  await db.end();
}

export async function insertRuntime (runtime, numberOfWorkingNodes, positivePings) {
  console.log('MySQL: insertRuntime', runtime);
  await queryDB(escape`
    INSERT INTO runtimes (runtime, numberOfWorkingNodes, positivePings) VALUES (${runtime}, ${numberOfWorkingNodes}, ${positivePings})
  `)
}

export async function insertEnvironments (environments) {
  console.log('MySQL: insertEnvironments', environments);
  let query = `INSERT INTO \`environments\` (environment) VALUES ${environments.map(() => '(?)')} ON DUPLICATE KEY UPDATE id=id;`
  await queryDB(query, environments);
}

