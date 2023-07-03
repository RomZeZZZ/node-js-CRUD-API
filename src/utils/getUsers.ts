import { IUser } from "../types/interfaces";
import { users } from "../variables";
function getUsers() {
    return users;
}
function getUser(id: string) {
    return users.find(user => user.id === id);
}
export { getUsers, getUser };