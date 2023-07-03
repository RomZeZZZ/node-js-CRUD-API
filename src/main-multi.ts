import cluster from 'node:cluster';
import { connect } from 'node:net';
import { cpus } from 'node:os';
import { createServer, request } from 'node:http';
import { IncomingMessage, ServerResponse } from 'http';
import { hostname, port, worker_port } from './constants';
import methodHandler from './utils/methodHandler';
import { env } from 'node:process';




if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    const numCPUs = cpus().length - 1;
    // Fork workers.
    let worker_port = port + 1;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({"worker_port": worker_port++});
    }

    if (worker_port > port + numCPUs) {
        worker_port = port + 1;
    } else {
        worker_port++;
    }
    createServer((req, res) => {
        let endpoint = `http://${hostname}:${worker_port}` + req.url;
        console.log('Reading....', endpoint);
        req.pipe(request(endpoint)).pipe(res);
      }).listen(port);

  } else {
        const server = createServer((req: IncomingMessage, res: ServerResponse) => {
            const regex = /^\/api\/users(\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?$/;
            if (req.url && regex.test(req.url)) {
                methodHandler(req, res);
            } else {
                res.statusCode = 404;
                res.write(JSON.stringify({message: "Unknown endpoint"}));
                res.end();
            }
        });

        server.listen(Number(env.worker_port), hostname, () => {
            console.log(`Server is running at http://${hostname}:${env.worker_port}/`);
        });

  }