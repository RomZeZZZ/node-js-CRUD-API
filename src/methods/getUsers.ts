import { IUser } from "../types/interfaces";
import { users } from "../variables";

async function getUsers() {
    return users;
}
async function getUser(id: string) {
    return users.find(user => user.id === id);
}
export { getUsers, getUser };