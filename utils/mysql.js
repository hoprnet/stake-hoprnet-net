import mysql from "serverless-mysql";
import escape from "sql-template-strings";

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE_NAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
  },
});

const queryDB = async (query) => {
  let results = await db.query(query);
  await db.end();
  return results;
};

export async function getEnvironments() {
  console.log("MySQL: getEnvironments");
  let query = await queryDB(escape`
      SELECT *
      FROM \`environments\` 
  `);
  return query;
}

export async function getEnvironmentsAndLastRun() {
  console.log("MySQL: getEnvironmentsAndLastRun");
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
      UNIX_TIMESTAMP(MAX(finishedAt)) * 1000 as lastRun
    FROM 
      runtimes 
    GROUP BY 
      environmentId;
  `);
  transaction.query(escape`
    SELECT UNIX_TIMESTAMP(NOW())*1000 as now
  `);
  const query = await transaction.commit();
  await db.end();
  return query;
}



export async function getNodes (environmentId) {
  console.log('MySQL: getNodes');
  const countPingsSince = 1671627600;
  let query = await queryDB(escape`
      SELECT * FROM
      (SELECT 
        nr.peerId AS peerId, 
        UNIX_TIMESTAMP(MAX(pings.timestamp)) * 1000 AS lastSeen,
        AVG(pings.latency) AS latencyAverage,
        since1667080800.count AS count,
        registered,
        communityId,
        (    since1667080800.count / 
        (    SELECT count(*) FROM runtimes WHERE ( finishedAt ) > nr.addedAt AND environmentId = ${environmentId} AND finishedAt > from_unixtime(${countPingsSince}) ) )    
        AS availability,
        (   last24h.pings / 
        (   SELECT count(*) FROM runtimes WHERE ( finishedAt ) > (NOW() - INTERVAL 24 HOUR) AND environmentId = ${environmentId} ) )    
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
      WHERE 
        nr.environmentId = ${environmentId} 
          AND 
        nr.registered = 1
      GROUP BY nr.peerId  
      ORDER BY availability DESC, peerId ASC) t
      WHERE
      lastSeen > UNIX_TIMESTAMP((NOW() - INTERVAL 30 DAY))*1000
      ORDER BY availability DESC, peerId ASC
  `);
  return query;
}

export async function getRuntimes(environmentId) {
  console.log("MySQL: getRuntimes");
  let runtimes = await queryDB(
    escape`SELECT YEAR(finishedAt) as year, MONTH(finishedAt) as month, count(*) as count FROM runtimes WHERE environmentId = ${environmentId} GROUP BY YEAR(finishedAt), MONTH(finishedAt);`
  );
  return runtimes;
}

export async function getStats(environmentId, year, month) {
  console.log("MySQL: getStats");
  // let atLeastOnePingInYearMonth = await queryDB(escape`SELECT count(DISTINCT(peerId)) as count FROM pings WHERE MONTH(timestamp)=${month} AND YEAR(timestamp)=${year};`);
  let pingCountInYearMonth = await queryDB(escape`SELECT count(*) as count
    FROM pings 
    LEFT JOIN \`node-registry\`
    ON pings.peerId = \`node-registry\`.id
    WHERE 
    MONTH(pings.timestamp)=${month} 
    AND 
    YEAR(pings.timestamp)=${year} 
    AND
    \`node-registry\`.\`environmentId\` = ${environmentId}
    GROUP BY pings.peerId;`);
  let last24hNodes = await queryDB(escape`SELECT count(*) as count
    FROM pings 
    LEFT JOIN \`node-registry\`
    ON pings.peerId = \`node-registry\`.id
    WHERE 
    pings.timestamp >= (NOW() - INTERVAL 24 HOUR) 
    AND
    \`node-registry\`.\`environmentId\` = ${environmentId}
    GROUP BY pings.peerId;`);

  return {
    pingCountInYearMonth,
    last24hNodes,
  };
}

export async function getLast30daysOnlineByHour(environmentId) {
  let getLast30daysOnline = await queryDB(escape` SELECT 
    count(pings.peerId) as count, 
    timestamp, 
    CONCAT(YEAR(timestamp), '-', MONTH(timestamp), '-', DAY(timestamp), ' ',HOUR(timestamp), ':00') as time
  FROM pings
  LEFT JOIN \`node-registry\`
  ON pings.peerId = \`node-registry\`.id
  WHERE 
  pings.timestamp >= (NOW() - INTERVAL 30 DAY)
  AND
  \`node-registry\`.\`environmentId\` = ${environmentId}
  GROUP BY YEAR(timestamp), MONTH(timestamp), DAY(timestamp), HOUR(timestamp);`);

  return getLast30daysOnline;
}

export async function getLast7daysOnlineByPeers(environmentId) {
  console.log("MySQL: getLast7daysOnlineByPeers");
  let query = escape`
    (SELECT
      CONCAT(YEAR(CURDATE()), '-', MONTH(CURDATE()), '-', DAY(CURDATE())) as DAY,
      count(*) as COUNT,
      sum(case when availability >= 0.1 then 1 else 0 end) AS count10,
      sum(case when availability >= 0.2 then 1 else 0 end) AS count20,
      sum(case when availability >= 0.3 then 1 else 0 end) AS count30,
      sum(case when availability >= 0.4 then 1 else 0 end) AS count40,
      sum(case when availability >= 0.5 then 1 else 0 end) AS count50,
      sum(case when availability >= 0.6 then 1 else 0 end) AS count60,
      sum(case when availability >= 0.7 then 1 else 0 end) AS count70,
      sum(case when availability >= 0.8 then 1 else 0 end) AS count80,
      sum(case when availability >= 0.9 then 1 else 0 end) AS count90,
      sum(case when availability >= 1 then 1 else 0 end) AS count100,
      MIN,
      MAX
    FROM
      (SELECT (count(*) /
              (SELECT count(*)
              FROM runtimes
              WHERE DATE(finishedAt) = CURDATE()
                AND environmentId = ${environmentId} )) AS availability,
          MAX(pings.timestamp) AS MAX,
          MIN(pings.timestamp) AS MIN
      FROM pings
      LEFT JOIN \`node-registry\` ON pings.peerId = \`node-registry\`.id
      WHERE DATE(pings.timestamp) = CURDATE()
      AND \`node-registry\`.environmentId = ${environmentId}
      GROUP BY pings.peerId) t)
  UNION
    (SELECT
      CONCAT(YEAR((CURDATE()- INTERVAL 1 DAY)), '-', MONTH((CURDATE()- INTERVAL 1 DAY)), '-', DAY((CURDATE())- INTERVAL 1 DAY)) as DAY,
      count(*) as COUNT,
      sum(case when availability >= 0.1 then 1 else 0 end) AS count10,
      sum(case when availability >= 0.2 then 1 else 0 end) AS count20,
      sum(case when availability >= 0.3 then 1 else 0 end) AS count30,
      sum(case when availability >= 0.4 then 1 else 0 end) AS count40,
      sum(case when availability >= 0.5 then 1 else 0 end) AS count50,
      sum(case when availability >= 0.6 then 1 else 0 end) AS count60,
      sum(case when availability >= 0.7 then 1 else 0 end) AS count70,
      sum(case when availability >= 0.8 then 1 else 0 end) AS count80,
      sum(case when availability >= 0.9 then 1 else 0 end) AS count90,
      sum(case when availability >= 1 then 1 else 0 end) AS count100,
      MIN,
      MAX
    FROM
      (SELECT (count(*) /
              (SELECT count(*)
              FROM runtimes
              WHERE DATE(finishedAt) = CURDATE() - INTERVAL 1 DAY
                AND environmentId = ${environmentId} )) AS availability,
          MAX(pings.timestamp) AS MAX,
          MIN(pings.timestamp) AS MIN
      FROM pings
      LEFT JOIN \`node-registry\` ON pings.peerId = \`node-registry\`.id
      WHERE DATE(pings.timestamp) = CURDATE() - INTERVAL 1 DAY
      AND \`node-registry\`.environmentId = ${environmentId}
      GROUP BY pings.peerId) t)
  UNION
    (SELECT
      CONCAT(YEAR((CURDATE()- INTERVAL 2 DAY)), '-', MONTH((CURDATE()- INTERVAL 2 DAY)), '-', DAY((CURDATE())- INTERVAL 2 DAY)) as DAY,
      count(*) as COUNT,
      sum(case when availability >= 0.1 then 1 else 0 end) AS count10,
      sum(case when availability >= 0.2 then 1 else 0 end) AS count20,
      sum(case when availability >= 0.3 then 1 else 0 end) AS count30,
      sum(case when availability >= 0.4 then 1 else 0 end) AS count40,
      sum(case when availability >= 0.5 then 1 else 0 end) AS count50,
      sum(case when availability >= 0.6 then 1 else 0 end) AS count60,
      sum(case when availability >= 0.7 then 1 else 0 end) AS count70,
      sum(case when availability >= 0.8 then 1 else 0 end) AS count80,
      sum(case when availability >= 0.9 then 1 else 0 end) AS count90,
      sum(case when availability >= 1 then 1 else 0 end) AS count100,
      MIN,
      MAX
    FROM
      (SELECT (count(*) /
              (SELECT count(*)
              FROM runtimes
              WHERE DATE(finishedAt) = CURDATE() - INTERVAL 2 DAY
                AND environmentId = ${environmentId} )) AS availability,
          MAX(pings.timestamp) AS MAX,
          MIN(pings.timestamp) AS MIN
      FROM pings
      LEFT JOIN \`node-registry\` ON pings.peerId = \`node-registry\`.id
      WHERE DATE(pings.timestamp) = CURDATE() - INTERVAL 2 DAY
      AND \`node-registry\`.environmentId = ${environmentId}
      GROUP BY pings.peerId) t)
  UNION
    (SELECT
      CONCAT(YEAR((CURDATE()- INTERVAL 3 DAY)), '-', MONTH((CURDATE()- INTERVAL 3 DAY)), '-', DAY((CURDATE())- INTERVAL 3 DAY)) as DAY,
      count(*) as COUNT,
      sum(case when availability >= 0.1 then 1 else 0 end) AS count10,
      sum(case when availability >= 0.2 then 1 else 0 end) AS count20,
      sum(case when availability >= 0.3 then 1 else 0 end) AS count30,
      sum(case when availability >= 0.4 then 1 else 0 end) AS count40,
      sum(case when availability >= 0.5 then 1 else 0 end) AS count50,
      sum(case when availability >= 0.6 then 1 else 0 end) AS count60,
      sum(case when availability >= 0.7 then 1 else 0 end) AS count70,
      sum(case when availability >= 0.8 then 1 else 0 end) AS count80,
      sum(case when availability >= 0.9 then 1 else 0 end) AS count90,
      sum(case when availability >= 1 then 1 else 0 end) AS count100,
      MIN,
      MAX
    FROM
      (SELECT (count(*) /
              (SELECT count(*)
              FROM runtimes
              WHERE DATE(finishedAt) = CURDATE() - INTERVAL 3 DAY
                AND environmentId = ${environmentId} )) AS availability,
          MAX(pings.timestamp) AS MAX,
          MIN(pings.timestamp) AS MIN
      FROM pings
      LEFT JOIN \`node-registry\` ON pings.peerId = \`node-registry\`.id
      WHERE DATE(pings.timestamp) = CURDATE() - INTERVAL 3 DAY
      AND \`node-registry\`.environmentId = ${environmentId}
      GROUP BY pings.peerId) t)
  UNION
    (SELECT
      CONCAT(YEAR((CURDATE()- INTERVAL 4 DAY)), '-', MONTH((CURDATE()- INTERVAL 4 DAY)), '-', DAY((CURDATE())- INTERVAL 4 DAY)) as DAY,
      count(*) as COUNT,
      sum(case when availability >= 0.1 then 1 else 0 end) AS count10,
      sum(case when availability >= 0.2 then 1 else 0 end) AS count20,
      sum(case when availability >= 0.3 then 1 else 0 end) AS count30,
      sum(case when availability >= 0.4 then 1 else 0 end) AS count40,
      sum(case when availability >= 0.5 then 1 else 0 end) AS count50,
      sum(case when availability >= 0.6 then 1 else 0 end) AS count60,
      sum(case when availability >= 0.7 then 1 else 0 end) AS count70,
      sum(case when availability >= 0.8 then 1 else 0 end) AS count80,
      sum(case when availability >= 0.9 then 1 else 0 end) AS count90,
      sum(case when availability >= 1 then 1 else 0 end) AS count100,
      MIN,
      MAX
    FROM
      (SELECT (count(*) /
              (SELECT count(*)
              FROM runtimes
              WHERE DATE(finishedAt) = CURDATE() - INTERVAL 4 DAY
                AND environmentId = ${environmentId} )) AS availability,
          MAX(pings.timestamp) AS MAX,
          MIN(pings.timestamp) AS MIN
      FROM pings
      LEFT JOIN \`node-registry\` ON pings.peerId = \`node-registry\`.id
      WHERE DATE(pings.timestamp) = CURDATE() - INTERVAL 4 DAY
      AND \`node-registry\`.environmentId = ${environmentId}
      GROUP BY pings.peerId) t)
  UNION
    (SELECT
      CONCAT(YEAR((CURDATE()- INTERVAL 5 DAY)), '-', MONTH((CURDATE()- INTERVAL 5 DAY)), '-', DAY((CURDATE())- INTERVAL 5 DAY)) as DAY,
      count(*) as COUNT,
      sum(case when availability >= 0.1 then 1 else 0 end) AS count10,
      sum(case when availability >= 0.2 then 1 else 0 end) AS count20,
      sum(case when availability >= 0.3 then 1 else 0 end) AS count30,
      sum(case when availability >= 0.4 then 1 else 0 end) AS count40,
      sum(case when availability >= 0.5 then 1 else 0 end) AS count50,
      sum(case when availability >= 0.6 then 1 else 0 end) AS count60,
      sum(case when availability >= 0.7 then 1 else 0 end) AS count70,
      sum(case when availability >= 0.8 then 1 else 0 end) AS count80,
      sum(case when availability >= 0.9 then 1 else 0 end) AS count90,
      sum(case when availability >= 1 then 1 else 0 end) AS count100,
      MIN,
      MAX
    FROM
      (SELECT (count(*) /
              (SELECT count(*)
              FROM runtimes
              WHERE DATE(finishedAt) = CURDATE() - INTERVAL 5 DAY
                AND environmentId = ${environmentId} )) AS availability,
          MAX(pings.timestamp) AS MAX,
          MIN(pings.timestamp) AS MIN
      FROM pings
      LEFT JOIN \`node-registry\` ON pings.peerId = \`node-registry\`.id
      WHERE DATE(pings.timestamp) = CURDATE() - INTERVAL 5 DAY
      AND \`node-registry\`.environmentId = ${environmentId}
      GROUP BY pings.peerId) t)
  UNION
    (SELECT
      CONCAT(YEAR((CURDATE()- INTERVAL 6 DAY)), '-', MONTH((CURDATE()- INTERVAL 6 DAY)), '-', DAY((CURDATE())- INTERVAL 6 DAY)) as DAY,
      count(*) as COUNT,
      sum(case when availability >= 0.1 then 1 else 0 end) AS count10,
      sum(case when availability >= 0.2 then 1 else 0 end) AS count20,
      sum(case when availability >= 0.3 then 1 else 0 end) AS count30,
      sum(case when availability >= 0.4 then 1 else 0 end) AS count40,
      sum(case when availability >= 0.5 then 1 else 0 end) AS count50,
      sum(case when availability >= 0.6 then 1 else 0 end) AS count60,
      sum(case when availability >= 0.7 then 1 else 0 end) AS count70,
      sum(case when availability >= 0.8 then 1 else 0 end) AS count80,
      sum(case when availability >= 0.9 then 1 else 0 end) AS count90,
      sum(case when availability >= 1 then 1 else 0 end) AS count100,
      MIN,
      MAX
    FROM
      (SELECT (count(*) /
              (SELECT count(*)
              FROM runtimes
              WHERE DATE(finishedAt) = CURDATE() - INTERVAL 6 DAY
                AND environmentId = ${environmentId} )) AS availability,
          MAX(pings.timestamp) AS MAX,
          MIN(pings.timestamp) AS MIN
      FROM pings
      LEFT JOIN \`node-registry\` ON pings.peerId = \`node-registry\`.id
      WHERE DATE(pings.timestamp) = CURDATE() - INTERVAL 6 DAY
      AND \`node-registry\`.environmentId = ${environmentId}
      GROUP BY pings.peerId) t)
  `

  let result = await queryDB(query);
  return result;
}