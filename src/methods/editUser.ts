import { IUser } from "../types/interfaces";
import { users } from "../variables";
export async function editUser (userId: string, updatedUser:  Partial<Omit<IUser, 'id'>>): Promise<void> {
  const user = users.find((user) => user.id === userId);
  if (user) {
    if ('id' in updatedUser && updatedUser.id !== userId) {
      throw new Error("Updating the 'id' property is not allowed.");
    }
    Object.assign(user, updatedUser);
  } else {
    throw new Error('User not found');
  }
}