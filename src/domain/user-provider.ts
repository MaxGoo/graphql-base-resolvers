import { UsersDatabase } from "../data/users";
import { MyError, Severity } from "./lib/errors";

export interface User {
  id: string;
  name: string;
}

class UserProvider {
  usersDatabase: UsersDatabase;

  constructor(usersDatabase: UsersDatabase) {
    this.usersDatabase = usersDatabase;
  }

  getUser(userId: string): User {
    const user = this.usersDatabase.find(userId);

    if (!user) {
      throw new MyError({
        message: "User not found.",
        severity: Severity.LOW,
        debugInformation: {
          userId,
        },
      });
    }

    return user;
  }
}

export { UserProvider };
