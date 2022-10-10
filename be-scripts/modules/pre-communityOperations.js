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
    const graphql = await fetch("https://core-hsr.dune.com/v1/graphql", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-hasura-api-key": "bfda5f52-ac8f-47df-9ac6-ad263bf9eb49"
        },
        "referrer": "https://dune.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"operationName\":\"FindResultDataByResult\",\"variables\":{\"result_id\":\"dd8214d7-05d1-4b01-8dee-4fade45005a7\",\"error_id\":\"00000000-0000-0000-0000-000000000000\"},\"query\":\"query FindResultDataByResult($result_id: uuid!, $error_id: uuid!) {\\n  query_results(where: {id: {_eq: $result_id}}) {\\n    id\\n    job_id\\n    runtime\\n    generated_at\\n    columns\\n    __typename\\n  }\\n  query_errors(where: {id: {_eq: $error_id}}) {\\n    id\\n    job_id\\n    runtime\\n    message\\n    metadata\\n    type\\n    generated_at\\n    __typename\\n  }\\n  get_result_by_result_id(args: {want_result_id: $result_id}) {\\n    data\\n    __typename\\n  }\\n}\\n\"}",
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
