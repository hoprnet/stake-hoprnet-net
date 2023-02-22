import mysql from "serverless-mysql";
import escape from "sql-template-strings";
import { lastCountResetEpoch, environment, totalRewards } from '../config'

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

export async function getRewards(address) {
  console.log("MySQL: getRewards", address);
  let transaction = db.transaction();
  transaction.query(escape`
    SET @peerId = (SELECT id from \`node-registry\` WHERE address = ${address} and environmentId = (SELECT id FROM environments WHERE environment = ${environment}));
  `);
  transaction.query(escape`
    SET @totalCommunityPings = (SELECT 
      sum(count) as total
    FROM 
    (SELECT 
      nr.peerId AS peerId,
      COALESCE(sinceLastReset.count, 0) AS count
    FROM \`node-registry\` AS nr
    LEFT JOIN (
        SELECT count(*) as count, peerId FROM pings WHERE pings.timestamp > from_unixtime(${lastCountResetEpoch}) GROUP BY pings.peerId
    ) AS sinceLastReset ON nr.id = sinceLastReset.peerId
    WHERE communityId = 1
    ) as onlyCommunityCountSinceLastReset);
  `);
  transaction.query(escape`
    SET @rewardsToDistribute = ${totalRewards};
  `);
  transaction.query(escape`
    SELECT count(*)/@totalCommunityPings*@rewardsToDistribute as rewards FROM pings WHERE pings.timestamp > from_unixtime(${lastCountResetEpoch}) AND peerId = @peerId GROUP BY pings.peerId;
  `);
  const query = await transaction.commit();
  await db.end();
  return query[3];
}
