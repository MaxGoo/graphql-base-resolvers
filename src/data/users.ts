import { User } from "../domain/user-provider";

class UsersDatabase {
  // Seed with a few users for testing purposes
  private users: User[] = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Doe" },
    { id: "3", name: "Jack Doe" },
  ];

  getUsers(): User[] {
    return this.users;
  }

  find(userId: string): User | undefined {
    return this.getUsers().find((user) => user.id === userId);
  }
}

export { UsersDatabase };
