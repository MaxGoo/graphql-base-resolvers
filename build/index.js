"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const cart_provider_1 = require("./cart-provider");
const schema_1 = require("./schema");
const store_provider_1 = require("./store-provider");
const user_provider_1 = require("./user-provider");
const userProvider = new user_provider_1.UserProvider();
const cartProvider = new cart_provider_1.CartProvider();
const storeProvider = new store_provider_1.StoreProvider();
var AuthorizationRole;
(function (AuthorizationRole) {
    AuthorizationRole["ADMIN"] = "ADMIN";
    AuthorizationRole["USER"] = "USER";
    AuthorizationRole["NONE"] = "NONE";
})(AuthorizationRole || (AuthorizationRole = {}));
const anyMatch = (list1, list2) => {
    return true;
};
class BaseResolver {
    requireAuth;
    allowedRoles;
    constructor(args) {
        this.requireAuth = args.requireAuth;
        this.allowedRoles = args.allowedRoles;
    }
    resolve = (parent, args, context) => {
        if (this.requireAuth && !context.userId) {
            throw new Error("You must be logged in to perform this action");
        }
        if (anyMatch(this.allowedRoles, context.roles)) {
            console.log(`${this.constructor.name}: `, {
                userId: context.userId ?? "anonymous",
                parent,
                args,
            });
            return this.resolver(parent, args, context);
        }
        throw new Error("You are not authorized");
    };
    getUserId(context) {
        if (!context.userId) {
            throw new Error("You must be logged in");
        }
        return context.userId;
    }
}
class MeResolver extends BaseResolver {
    constructor() {
        super({ requireAuth: false, allowedRoles: [AuthorizationRole.NONE] });
    }
    async resolver(_, __, context) {
        const user = userProvider.getUser(context.userId ?? "1");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
class UserCartsResolver extends BaseResolver {
    constructor() {
        super({ requireAuth: true, allowedRoles: [AuthorizationRole.USER] });
    }
    async resolver(parent) {
        return cartProvider.getCartsForUser(parent.id);
    }
}
const resolvers = {
    Query: {
        me: new MeResolver().resolve,
    },
    User: {
        carts: new UserCartsResolver().resolve,
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new apollo_server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers,
    // plugins: [loggingPlugin],
    context: ({ req }) => {
        const userId = req.headers.userid;
        const roles = req.headers.roles;
        const context = {};
        if (typeof userId === "string") {
            context.userId = userId;
        }
        else {
            context.userId = "anonymous";
        }
        if (typeof roles === "string") {
            context.roles = [roles];
        }
        else {
            context.roles = roles;
        }
        return context;
    },
    csrfPrevention: true,
    cache: "bounded",
});
// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
//# sourceMappingURL=index.js.map