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

    const query_id_graphql = await fetch("https://core-hsr.dune.com/v1/graphql", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,pl;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-hasura-api-key": "6d1c2ddc-eb92-4223-ba90-0749e070895f",
        "Referer": "https://dune.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"operationName\":\"GetResult\",\"variables\":{\"query_id\":1347702},\"query\":\"query GetResult($query_id: Int!, $parameters: [Parameter!]) {\\n  get_result_v2(query_id: $query_id, parameters: $parameters) {\\n    job_id\\n    result_id\\n    error_id\\n    __typename\\n  }\\n}\\n\"}",
      "method": "POST"
    });
    const query_id_json = await query_id_graphql.json();
    const query_id = query_id_json.data.get_result_v2.result_id;

    const graphql = await fetch("https://core-hsr.dune.com/v1/graphql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,pl;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-hasura-api-key": "bf30c49e-b8ce-4b5b-be1d-25b7eb529663"
        },
        "referrer": "https://dune.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"operationName\":\"FindResultDataByResult\",\"variables\":{\"result_id\":\"${query_id}\",\"error_id\":\"00000000-0000-0000-0000-000000000000\"},\"query\":\"query FindResultDataByResult($result_id: uuid!, $error_id: uuid!) {\\n  query_results(where: {id: {_eq: $result_id}}) {\\n    id\\n    job_id\\n    runtime\\n    generated_at\\n    columns\\n    __typename\\n  }\\n  query_errors(where: {id: {_eq: $error_id}}) {\\n    id\\n    job_id\\n    runtime\\n    message\\n    metadata\\n    type\\n    generated_at\\n    __typename\\n  }\\n  get_result_by_result_id(args: {want_result_id: $result_id}) {\\n    data\\n    __typename\\n  }\\n}\\n\"}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      });

    const json = await graphql.json();

    var data = json.data.get_result_by_result_id;
    data = data.map( item =>  item.data.hoprPeerId )

    data = data.filter( item => item !== null);

    return data;
}
