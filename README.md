## Network Registry

A network registry back-end and front-end repository for Hopr Network.

## Development

To run the Back-End:

```
node ./be-scripts/index.js
```

To run the Front-End development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation


### Environment Variables

The both the Back-End and the Front-End need the following variables:


.env
```
MYSQL_HOST=*
MYSQL_DATABASE_NAME=*
MYSQL_USERNAME=*
MYSQL_PASSWORD=*
```

Back-End also needs:
```
api_url_1=*
api_key_1=*
api_url_<number>=*
api_key_<number>=*

thegraph_url=*
thegraph_environment=*

element_home_url=*
element_access_token=*
```


### The Back-End Script

The script creates a list of nodes (`var nodes`) based on the `api_url_<number>` and `api_key_<number>` env variables. If it finds a pair of those, it adds it to a list of nodes that it will use. If you will supply only a key or an url, it will not use it.

After the creation of that list, we go into `main()`:

```
async function main (){

    await getPeersFromDB();
    await checkNodes();
    await saveEnvironments();
    await getPeersFromNetwork();
    prepareData();
    await pingAndSaveResults();

    process.exit()
} 
```

### `getPeersFromDB()`
Function gets all the already known peerIs from the database.


### `checkNodes()`
Function checks if the nodes provided in the environment variables are online. If they are not, another check is run just in case.
When 2 checks fail, the node is removed from current run on the script and a message to Element channel 'Automated' is being sent with info how many nodes are offline. Maxiumum of 1 message per 24h is being sent on Element if the number of offline node is not changing.

### `saveEnvironments()`
First, this function lists all the environment that the provided nodes are running, then adds the environment of the graph provided in the environment variables.
If a new environment is detected, its name is added to the databse.

### `getPeersFromNetwork()`
First, the function requests from all the working nodes the peerId that the nodes have seen on the network.
Secondly, the function requests peerIds from the graph url provided in the environment variables.

If a new peerId is detected, it is begin added to the databse.

### `prepareData()`
The nodes and peerId are being grouped by their environments.

```
var nodes = {
    'monte_rosa': [{peerId: xxx, ...}, ...],
    'paleochora': [{peerId: xxx, ...}, ...]
}
```


### `pingAndSaveResults()`
This function loops over all the nodes to ping and saves the results.

1st degree loop: loop over the environments (e.g.  'monte_rosa', 'paleochora')

2nd degree loop: loop over the peers in each environment 

3rd degree loop: loop over the nodes used to ping (in the same environment as the peerId). 
 - If a ping comes back positive, the loop finishes and we go to the next peerId.
 - If the ping comes back negative, the loop continues until either we get a positive ping, or the avalible nodes run out.

 Each ping has a timeout of 10s. 
 After the 2nd degree loop is finished, it means that we checked all the peerId on the environment and we save to the database: 
  - pings 
  - the runtime

