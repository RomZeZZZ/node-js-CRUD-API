import cluster from 'node:cluster';
import { cpus } from 'node:os';
import createWorkerServer from './utils/server';
import createLoadBalancer from './utils/load-balancer';
import { env } from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

const hostname = env.HOST_NAME;

if (cluster.isPrimary) {
    const numWorkers = cpus().length - 1;
    let workerPort = Number(env.PORT) + 1;

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork({"PORT": workerPort++});
    }
    
    createLoadBalancer(hostname, Number(env.PORT), workerPort, numWorkers)

} else {
    createWorkerServer(hostname, Number(env.PORT));
}