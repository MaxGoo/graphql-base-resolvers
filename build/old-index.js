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
const resolverWrapper = (parent, args, context, fn) => {
    console.log(`Request: `, {
        userId: context.userId ?? "anonymous",
        parent,
        args,
    });
    if (!context.userId) {
        throw new Error("You must be logged in to perform this action");
    }
    return fn(parent, args, context);
};
// const getUserResolver =   (_, __, context) => {
//   return userProvider.getUser(context.userId);
// }
const getUserCartsResolver = (_, __, context) => {
    return cartProvider.getCartsForUser(context.userId);
};
const resolvers = {
    Query: {
        me: (parent, args, context) => resolverWrapper(parent, args, context, userProvider.getUser(context.userId))
    },
    Mutation: {
        addItemToCart: (_, args, context) => {
            const cart = this.cartProvider.getCart(args.cartId);
            if (cart.userId !== context.userId) {
                throw new Error("You can't add items to this cart");
            }
            return cartProvider.addItemToCart(args.cartId, args.item);
        }
    },
    User: {
        carts: (parent, args, context) => resolverWrapper(parent, args, context, getUserCartsResolver)
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
//# sourceMappingURL=old-index.js.map