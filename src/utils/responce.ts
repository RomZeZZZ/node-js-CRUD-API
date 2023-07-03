import { IUser } from "../types/interfaces";
import { ServerResponse } from 'http';
export default function responseMessage(response: ServerResponse, status: number, message: IUser[] | IUser | string)  {
    response.statusCode = status;
    response.write(
        JSON.stringify(typeof message === 'string' ? { message: message } : { message })
    );
    response.end();
} 