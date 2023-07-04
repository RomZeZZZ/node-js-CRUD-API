import { createServer, request } from 'node:http';

function getWorkerPort(currentWorkerPort: number, mainPort: number, workersNumber: number) {
    if (currentWorkerPort >= mainPort + workersNumber) {
        return mainPort + 1;
    } else {
        return ++currentWorkerPort;
    }
}

export default function createLoadBalancer(hostname: string | undefined, port: number, workerPort: number, workersNumber: number) {
    createServer((client_req, client_res) => {
        workerPort = getWorkerPort(workerPort, port, workersNumber);

        const options = {
          hostname: hostname,
          port: workerPort,
          path: client_req.url,
          method: client_req.method,
          headers: client_req.headers
        };

        const proxy = request(options, function (res) {
          console.log(`Sending to http://${options.hostname}:${options.port}/`)
          client_res.writeHead(res.statusCode || 400, res.headers)
          res.pipe(client_res, {
            end: true
          });
        });
      
        client_req.pipe(proxy, {
          end: true
        });
    }).listen(port);
}