import { users } from "../variables";
export async function removeUserById (userId: string): Promise<void> {
    const index = users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      users.splice(index, 1);
    } else {
        throw new Error('User not found');
    }
}
  