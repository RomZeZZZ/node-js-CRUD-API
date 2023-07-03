import { IUser } from "../types/interfaces";
import { users } from "../variables";
import { v4 as uuidv4 } from 'uuid';
export default async function addUser(newUser: IUser) {
    newUser.id = uuidv4();
    if (typeof newUser.age !== 'number' 
    || typeof newUser.username !== 'string' 
    || !Array.isArray(newUser.hobbies) 
    || newUser.hobbies.some((hobby) => typeof hobby !== 'string')
    ) {
        throw new Error("Body does not contain required fields");
    } else {
        users.push(newUser);
    }
}