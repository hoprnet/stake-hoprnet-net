import fetch, { AbortError }  from 'node-fetch'
import { Headers }  from 'node-fetch'
import {
  PublicKey,
} from '@hoprnet/hopr-utils'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' });

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
  console.log(`[HOPR SDK] nodeGetInfo:`, apiEndpoint, apiToken);
  let status;
  const response = await fetch(`${apiEndpoint}/api/v2/node/info`, {
    headers: generateHeaders(apiToken)
  }).then((res) => {
    status = res.status;
    return res.json();
  }).catch((err) => {
    console.log(`Error [HOPR SDK] nodeGetInfo status ${status}`);
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
  console.log(`[HOPR SDK] nodePing:`, apiEndpoint, apiToken, peerId);

  const timeoutMs = 10000
  // Aborting fetch longer than XXXX ms
  const AbortController = globalThis.AbortController || await import('abort-controller')
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let response, status;
  try {
    response = await fetch(`${apiEndpoint}/api/v2/node/ping`, {
      method: "POST",
      headers: generateHeaders(apiToken, true),
      signal: controller.signal,
      body: JSON.stringify({
        peerId
      })
    })
    status = response.status;
    response = await response.json();
  } catch (err) {
    if (err instanceof AbortError) {
      console.log(`[HOPR SDK]: nodePing aborted after ${timeoutMs/1000}s`);
    } else {
      console.log(`Error [HOPR SDK]: nodePing status ${status}`);
      if(status !== 404) console.error(err);
    }
  } finally {
    clearTimeout(timeout);
  }

  return response;
};

export async function nodeGetPeers (apiEndpoint, apiToken) {
  console.log(`[HOPR SDK] nodeGetPeers:`, apiEndpoint, apiToken);
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
  console.log(`[HOPR SDK] getPeersFromSubGraph`);
  let status;
  const response = await fetch(process.env.thegraph_url, {
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
      "body": "{\"query\":\"{\\n  accounts {\\npublicKey\\n}\\n}\",\"variables\":null}",
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

export async function getRegisteredPeersFromSubGraph (){
  console.log(`[HOPR SDK] getRegisteredPeersFromSubGraph`);
  const LIMIT = 1000;
  let status;
  let foundEnd = false;
  let index = 0;
  let peers = [];
  while(!foundEnd){
    const response = await fetch(process.env.thegraph_url, {
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
      "body": `{\"query\":\"{networkRegistries(orderBy: id, orderDirection: asc, first: ${LIMIT}, skip: ${index*LIMIT}){registeredPeers}}\"}`,
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
    const networkRegistries = response.data.networkRegistries;
    for (let n = 0; n < networkRegistries.length; n++ ) {
      const registeredPeers = networkRegistries[n].registeredPeers;
      for (let p = 0; p < registeredPeers.length; p++ ) {
        const peerId = registeredPeers[p];
        if (peers.findIndex(peer => peer === peerId) === -1){
          peers.push(peerId);
        }
      }
    }
    index++;
    if(networkRegistries.length === 0 || networkRegistries.length < LIMIT) foundEnd = true;
  }

  return peers;
}
