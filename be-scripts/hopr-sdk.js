import fetch  from 'node-fetch'
import { Headers }  from 'node-fetch'

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
    console.error(`Error [HOPR SDK]: getPeerId status ${status}`);
    if(status !== 404) console.error(err);
  });
  address = response?.hoprAddress;
  console.log('getPeerId', address)
  return address;
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
    console.error(`Error [HOPR SDK]: sendMessage status ${status}`);
    if(status !== 404) console.error(err);
  });
};

export async function nodePing (apiEndpoint, apiToken, peerId) {
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
    console.error(`Error [HOPR SDK]: nodePing status ${status}`);
    if(status !== 404) console.error(err);
  });
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
      console.error(`Error [HOPR SDK]: nodeGetPeers status ${status}`);
      if(status !== 404) console.error(err);
    });
  return response;
};