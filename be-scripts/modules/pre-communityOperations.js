import fetch  from 'node-fetch';
import { 
    updateCommunityMembers
} from "./mysql.js";

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' });

export async function communityOperations(){
    let communityPeerIds = await getCommunityPeerIds();
    await updateCommunityMembers(communityPeerIds, process.env.thegraph_environment);
}

async function getCommunityPeerIds(){
    // Embed url from the Dune Analitics - the API is paid extra...
    // https://dune.com/embeds/1347702/2299460/6d1c2ddc-eb92-4223-ba90-0749e070895f

    const graphql = await fetch("https://core-hsr.dune.com/v1/graphql", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,pl;q=0.8",
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-hasura-api-key": "6d1c2ddc-eb92-4223-ba90-0749e070895f",
        "Referer": "https://dune.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"operationName\":\"GetExecution\",\"variables\":{\"execution_id\":\"01GHVQBBHADAAJ1XYQ7JSHGPBA\",\"query_id\":1347702,\"parameters\":[]},\"query\":\"query GetExecution($execution_id: String!, $query_id: Int!, $parameters: [Parameter!]!) {\\n  get_execution(\\n    execution_id: $execution_id\\n    query_id: $query_id\\n    parameters: $parameters\\n  ) {\\n    execution_queued {\\n      execution_id\\n      execution_user_id\\n      position\\n      execution_type\\n      created_at\\n      __typename\\n    }\\n    execution_running {\\n      execution_id\\n      execution_user_id\\n      execution_type\\n      started_at\\n      created_at\\n      __typename\\n    }\\n    execution_succeeded {\\n      execution_id\\n      runtime_seconds\\n      generated_at\\n      columns\\n      data\\n      __typename\\n    }\\n    execution_failed {\\n      execution_id\\n      type\\n      message\\n      metadata {\\n        line\\n        column\\n        hint\\n        __typename\\n      }\\n      runtime_seconds\\n      generated_at\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
      "method": "POST"
    });

    const json = await graphql.json();

    var data = json.data.get_execution.execution_succeeded.data;
    data = data.map( item =>  item.hoprPeerId )

    data = data.filter( item => item !== null);

    return data;
}
