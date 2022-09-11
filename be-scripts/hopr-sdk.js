import fetch  from 'node-fetch'
import { Headers }  from 'node-fetch'
import {
  PublicKey,
} from '@hoprnet/hopr-utils'

function generateHeaders (apiToken, isPost = false) {
    const headers = new Headers();
    if (isPost) {
        headers.set("Content-Type", "application/json");
        headers.set("Accept-Content", "application/json");
    }
    headers.set("Authorization", "Basic " + btoa(apiToken));
    return headers;
};

export async function getPeerId (apiEndpoint, apiToken) {
  let address, status;
  const response = await fetch(`${apiEndpoint}/api/v2/account/addresses`, {
    headers: generateHeaders(apiToken)
  }).then((res) => {
    status = res.status;
    return res.json();
  }).catch((err) => {
    console.log(`Error [HOPR SDK]: getPeerId status ${status}`);
    if(status !== 404) console.error(err);
  });
  address = response?.hoprAddress;
  console.log('getPeerId', address)
  return address;
};

export async function nodeGetInfo (apiEndpoint, apiToken) {
  let status;
  const response = await fetch(`${apiEndpoint}/api/v2/node/info`, {
    headers: generateHeaders(apiToken)
  }).then((res) => {
    status = res.status;
    return res.json();
  }).catch((err) => {
    console.log(`Error [HOPR SDK]: nodeGetInfo status ${status}`);
    if(status !== 404) console.error(err);
  });
  return response;
};

export async function sendMessage (apiEndpoint, apiToken, recipientPeerId, message) {
  let status;
  await fetch(`${apiEndpoint}/api/v2/messages`, {
    method: "POST",
    headers: generateHeaders(apiToken, true),
    body: JSON.stringify({
      recipient: recipientPeerId,
      body: message
    })
  }).then((res) => {
    status = res.status;
  })
  .catch((err) => {
    console.log(`Error [HOPR SDK]: sendMessage status ${status}`);
    if(status !== 404) console.error(err);
  });
};

export async function nodePing (apiEndpoint, apiToken, peerId) {
  let startTime = Date.now();
  console.log(`HOPR SDK: nodePing`, apiEndpoint, apiToken, peerId);
  let status;
  const response = await fetch(`${apiEndpoint}/api/v2/node/ping`, {
    method: "POST",
    headers: generateHeaders(apiToken, true),
    body: JSON.stringify({
      peerId
    })
  }).then((res) => {
    status = res.status;
    return res.json();
  })
  .catch((err) => {
    console.log(`Error [HOPR SDK]: nodePing status ${status}`);
    if(status !== 404) console.error(err);
  });
  console.log(`HOPR SDK: nodePing runtime: ${Date.now()-startTime}ms`);
  return response;
};

export async function nodeGetPeers (apiEndpoint, apiToken) {
  console.log(`HOPR SDK: nodeGetPeers`, apiEndpoint, apiToken);
  let status;
  const response = await fetch(`${apiEndpoint}/api/v2/node/peers`, {
      headers: generateHeaders(apiToken)
    }).then((res) => {
      status = res.status;
      return res.json();
    })
    .catch((err) => {
      console.log(`Error [HOPR SDK]: nodeGetPeers status ${status}`);
      if(status !== 404) console.error(err);
    });
  return response;
};

export async function getPeersFromSubGraph (){
  console.log(`HOPR SDK: getPeersFromSubGraph`);
  let status;
  const response = await fetch("https://api.thegraph.com/subgraphs/name/hoprnet/hopr-channels", {
      "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,el;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
      },
      "referrer": "https://thegraph.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"query\":\"{\\n  accounts {\\n    id\\n    publicKey\\n    multiaddr\\n  }\\n}\",\"variables\":null}",
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
  }).then((res) => {
    status = res.status;
    return res.json();
  }).catch((err) => {
    console.log(`Error [HOPR SDK]: getPeersFromSubGraph status ${status}`);
    if(status !== 404) console.error(err);
  });

  const accounts = response.data.accounts;
  let peers = [];

  for (let i = 0; i < accounts.length; i++ ) {
    const publicKey = PublicKey.fromString(accounts[i].publicKey);
    const peerId = `${publicKey.toPeerId().toString()}`
    peers.push(peerId)
  }

  return peers;
}
