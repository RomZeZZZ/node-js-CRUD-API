import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, getUser } from './getUsers';
import addUser from './addUser';
import responseMessage from './responce';
import { IUser } from '../types/interfaces';
export default async function methodHandler (request: IncomingMessage, response: ServerResponse) {
    if (request.url) {
        const reqArr = request.url.split('/');
        const endPoint = reqArr[reqArr.length - 1]
        const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        let users: IUser | IUser[] | undefined | string;
        const data: Buffer[] = [];
        switch (request.method) {
            case 'GET':
                if (endPoint === 'users') {
                    users = await getUsers();
                    responseMessage(response, 200, users);
                    break;
                } else if (regex.test(endPoint)) {
                    users = await getUser(endPoint);
                    if (!Object.prototype.hasOwnProperty.call(users, 'id')) {
                        responseMessage(response, 404, 'User doesnt exist');
                        break;
                    } else {
                        if (users) {
                            responseMessage(response, 200, users);
                        }
                        break;
                    }
                }
                responseMessage(response, 400, 'Invaalid Id');
                break;
            case 'PUT':
                console.log('put req')
                break;
            case 'POST':
                if (endPoint === 'users') {
                    request.on('data', (chunk: Buffer) => {
                        data.push(chunk);
                    });
                    request.on('end', async () => {
                        try {
                            let newUser;
                            if (data) {
                                newUser = JSON.parse(Buffer.concat(data).toString());
                            } else {
                                throw new Error('Invalid request');
                            }
                            await addUser(newUser);
                            responseMessage(response, 201, 'User is created')
                        } catch (error) {
                            if (error instanceof Error) {
                                responseMessage(response, 400, error.message);
                            }
                        }
                    });
                    break;
                } else {
                    responseMessage(response, 400, 'Invalid endpoint');
                }
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
}