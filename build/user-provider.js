"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProvider = void 0;
class UserProvider {
    users;
    constructor() {
        this.users = [
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Doe" },
            { id: "3", name: "Jack Doe" },
        ];
    }
    getUser(userId) {
        const user = this.users.find((user) => user.id === userId);
        console.log(`user: `, user);
        return user;
    }
}
exports.UserProvider = UserProvider;
//# sourceMappingURL=user-provider.js.map