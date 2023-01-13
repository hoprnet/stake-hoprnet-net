//import { gql, useQuery } from '@apollo/client';
import { useApolloClient } from "@apollo/client";
import { graphql, buildSchema } from "graphql";
import { request, gql } from 'graphql-request'

export function getSubGraphStakingData () {
    // fetch("https://api.thegraph.com/subgraphs/name/hoprnet/stake-season5", {
    //   "headers": {
    //     "accept": "application/json, multipart/mixed",
    //     "content-type": "application/json",
    //   },
    //   "referrer": "https://thegraph.com/",
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body": "{\"query\":\"{\\n  programs {\\n    totalActualStake\\n    totalUnclaimedRewards\\n    currentRewardPool\\n    lastSyncTimestamp\\n  }\\n}\"}",
    //   "method": "POST",
    //   "mode": "cors",
    //   "credentials": "omit"
    // });

  //  const client = useApolloClient();

    const GET_THEGRAPH = gql`
        query GetStakingData {
            programs {
              totalActualStake
              totalUnclaimedRewards
              currentRewardPool
              lastSyncTimestamp
            }
        }
    `;

    request('https://api.spacex.land/graphql/', query).then((data) => console.log(data))
    
    return GET_THEGRAPH;

  };