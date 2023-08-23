CREATE TABLE staking_hub_safes (
   id serial PRIMARY KEY,
   transactionHash varchar(128),
   safeAddress varchar(128),
   moduleAddress varchar(128),
   ownerAddress varchar(128),
   timestamp TIMESTAMP
);