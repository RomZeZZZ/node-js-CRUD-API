import { createServer } from 'node:http';
import { IncomingMessage, ServerResponse } from 'http';
import responseMessage from './responce';
import { regex } from '../constants';
import methodHandler from './methodHandler';

export default function createWorkerServer(hostname: string | undefined, port: number) {
    createServer((req: IncomingMessage, res: ServerResponse) => {
        if (req.url && regex.test(req.url)) {
            methodHandler(req, res);
        } else {
            responseMessage(res, 404, "Unknown endpoint")
        }
    }).listen(port, hostname, () => {
        console.log(`Server is running at http://${hostname}:${port}/`);
    });
}