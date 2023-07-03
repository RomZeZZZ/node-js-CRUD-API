import { IUser } from "../types/interfaces";
import { users } from "../variables";
import { v4 as uuidv4 } from 'uuid';
export default function addUser(newUser: IUser) {
    newUser.id = uuidv4();
    users.push(newUser)
}