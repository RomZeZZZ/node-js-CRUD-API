import { createServer } from 'node:http';
import { IncomingMessage, ServerResponse } from 'http';
import { hostname, port } from './constants';
import methodHandler from './utils/methodHandler';
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

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});