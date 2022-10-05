import { ApolloServer } from "apollo-server";
import { CartProvider } from "./cart-provider";
import { typeDefs } from "./schema";
import { StoreProvider } from "./store-provider";
import { UserProvider } from "./user-provider";

const userProvider = new UserProvider();
const cartProvider = new CartProvider();
const storeProvider = new StoreProvider();

const resolverWrapper =  (parent, args, context, fn) => {
  console.log(`Request: `, {
    userId: context.userId ?? "anonymous",
    parent,
    args,
  });

  if (!context.userId) {
    throw new Error("You must be logged in to perform this action");
  }

  return fn(parent, args, context);
}

const getUserResolver =   (_, __, context) => {
  return userProvider.getUser(context.userId);
}

const resolvers = {
  Query: {
    me: (parent, args, context) => resolverWrapper(parent, args, context, getUserResolver)
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
    carts: (parent, args, context) =>
      resolverWrapper(parent, args, context, cartProvider.getCartsForUser(context.userId))
  },
  User: {
    carts: (_, __, context) => {
      if (!context.userId) {
        throw new Error("You must be logged in to perform this action");
      }

      return cartProvider.getCartsForUser(context.userId);
    }
  },
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [loggingPlugin],
  context: ({ req }) => {
    const userId = req.headers.userid;
    const roles = req.headers.roles;

    const context = {};

    if (typeof userId === "string") {
      context.userId = userId;
    } else {
      context.userId = "anonymous";
    }

    if (typeof roles === "string") {
      context.roles = [roles];
    } else {
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