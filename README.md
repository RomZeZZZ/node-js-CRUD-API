# node-js-CRUD-API

## Installation Process

1. Plase run npm install.

2. Please run npm run start:dev to run application in the development mode with server which is running on the http://HOST:PORT/. 
HOST and PORT could be found in the .env file (applicable in the root directory). 

3. Please run npm run start:prod to run application in the production mode.

By default server is configured to run on the http://127.0.0.1:4000/.

4. Please run npm run start:multi which starts multiple instances of application http://HOST:PORT+n/, where n is number of host machine's CPUs - 1.
HOST and PORT could be found in the .env file (applicable in the root directory). 

5. Please run npm run start:prod-multi to run multiple instances of application in the production mode.


By default load balancer  is configured to run on the http://127.0.0.1:4000/.