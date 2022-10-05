import { cartProvider, userProvider } from "../configuration/registry";
import { Cart } from "../domain/cart-provider";
import { User } from "../domain/user-provider";
import { BaseReferenceResolver } from "./lib/base-reference-resolver";
import { BaseResolver } from "./lib/base-resolver";
import { BaseContext } from "./lib/context";
import { resolverMap } from "./lib/resolver-map";
import { AuthorizationRole } from "./lib/resolver-utils";

interface AddItemToCartArgs {
  input: {
    cartId?: string;
    item: {
      id: string;
      quantity: number;
    };
  };
}

class MeResolver extends BaseResolver {
  async resolver(_: User, __: any, context: BaseContext): Promise<User> {
    return userProvider.getUser(this.getUserId(context));
  }
}

class AddItemToCartResolver extends BaseResolver {
  async resolver(
    _: {},
    args: AddItemToCartArgs,
    context: BaseContext
  ): Promise<Cart> {
    return cartProvider.addItemToCart({
      userId: this.getUserId(context),
      cartId: args.input.cartId,
      item: args.input.item,
    });
  }
}

class UserReferenceResolver extends BaseReferenceResolver {
  async resolver(parent: User, _: BaseContext): Promise<User> {
    // Note that a reference resolver resolves an entity based on it's unique identifier!
    return userProvider.getUser(parent.id);
  }
}

// Note that we are mapping the BaseResolver instance to it's resolve function in `resolverMap`
const resolvers = resolverMap({
  Query: {
    me: new MeResolver([AuthorizationRole.USER]), // Remember to set the headers in your request! see `src/api/lib/context.ts`
  },
  Mutation: {
    addItemToCart: new AddItemToCartResolver([AuthorizationRole.USER]),
  },
  User: {
    // This is a reference resolver, so either a USER or an ADMIN can resolver a reference to a user
    __resolveReference: new UserReferenceResolver([
      AuthorizationRole.USER,
      AuthorizationRole.ADMIN,
    ]),
  },
});

export { resolvers };
