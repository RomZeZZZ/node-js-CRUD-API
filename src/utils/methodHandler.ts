import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, getUser } from '../methods/getUsers';
import addUser from '../methods/addUser';
import responseMessage from './responce';
import { IUser } from '../types/interfaces';
import { regexUUID } from '../constants';
import { removeUserById } from '../methods/delete';
import { editUser } from '../methods/editUser';
export default async function methodHandler (request: IncomingMessage, response: ServerResponse) {
    if (request.url) {
        const reqArr = request.url.split('/');
        const endPoint = reqArr[reqArr.length - 1];
        let users: IUser | IUser[] | undefined | string;
        const data: Buffer[] = [];
        switch (request.method) {
            case 'GET':
                try {
                    if (endPoint === 'users') {
                        users = await getUsers();
                        responseMessage(response, 200, users);
                        break;
                    } else if (regexUUID.test(endPoint)) {
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
                } catch (error) {
                    responseMessage(response, 400, 'Cant get users')
                }
                break;
            case 'PUT':
                if (endPoint !== 'users') {
                    request.on('data', (chunk: Buffer) => {
                        data.push(chunk);
                    });
                    request.on('end', async () => {
                        try {
                            let newUserData;
                            if (data) {
                                newUserData = JSON.parse(Buffer.concat(data).toString());
                            } else {
                                throw new Error('Invalid request');
                            }
                            await editUser(endPoint, newUserData);
                            responseMessage(response, 200, 'User is changed');
                        } catch (error) {
                            if (error instanceof Error) {
                                responseMessage(response, 400, error.message);
                            }
                        }
                    });
                    break;
                } else {
                    responseMessage(response, 400, 'UserId is invalid');
                }
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
                            responseMessage(response, 201, 'User is created');
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
                if (endPoint === 'users') {
                    responseMessage(response, 404, "Invalid endpoint");
                    break;
                } else if (regexUUID.test(endPoint)) {
                    try {
                        await removeUserById(endPoint);
                        responseMessage(response, 204, 'User deleted')
                    } catch (error) {
                        if (error instanceof Error) {
                            responseMessage(response, 404, error.message);
                        }
                    }
                } else {
                    responseMessage(response, 400 , "Invalid ID");
                }
                break;
            default:
                response.statusCode = 404;
                response.write(JSON.stringify({message: "Unknown method"}));
                response.end();
                break;
        }
    }
}