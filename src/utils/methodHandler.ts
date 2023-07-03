import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, getUser } from './getUsers';
import addUser from './addUser';
export default function methodHandler (request: IncomingMessage, response: ServerResponse) {
    switch (request.method) {
        case 'GET':
            let users;
            if (request.url) {
                const reqArr = request.url.split('/');
                if (reqArr[reqArr.length - 1] === 'users') {
                    users = getUsers();
                } else {
                    users = getUser(reqArr[reqArr.length - 1]);
                    if (!users?.hasOwnProperty('id')) {
                        response.statusCode = 404;
                        response.write(JSON.stringify({message: 'User doesnt exist'}));
                        response.end();
                        break;
                    }
                }
            }
            response.statusCode = 200;
            response.write(JSON.stringify({users}));
            response.end();
            break;
        case 'PUT':
            console.log('put req')
            break;
        case 'POST':
            let data: Buffer[] = [];
            request.on('data', (chunk: Buffer) => {
                data.push(chunk);
            });
            request.on('end', () => {
                const newUser = JSON.parse(Buffer.concat(data).toString());
                addUser(newUser);
            });
            response.statusCode = 200;
            response.write(JSON.stringify({message: 'user added successfully'}));
            response.end();
            break;
    
        case 'DELETE':
            console.log('DFELETE req')
            break;
    
        default:
            response.statusCode = 404;
            response.write(JSON.stringify({message: "Unknown method"}));
            response.end();
            break;
    }
}