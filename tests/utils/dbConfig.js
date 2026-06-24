export const dbConfig = {
  user: 'mana0809',
  password: 'mana0809',
  connectString: `(DESCRIPTION=
    (ADDRESS=
      (PROTOCOL=TCP)
      (HOST=exanode-x8m-ijztf-scan.allexadbclients.macomspokevcn.oraclevcn.com)
      (PORT=1521)
    )
    (CONNECT_DATA=
      (SERVER=DEDICATED)
      (SERVICE_NAME=MCPDB.allexadbclients.macomspokevcn.oraclevcn.com)
      (FAILOVER_MODE=
        (TYPE=SELECT)
        (METHOD=BASIC)
      )
    )
  )`
};