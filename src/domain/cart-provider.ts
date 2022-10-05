import { CartsDatabase } from "../data/carts";
import { MyError, Severity } from "./lib/errors";
import { Item, StoreProvider } from "./store-provider";

export interface Cart {
  id: string;
  userId: string;
  items: { item: Item; quantity: number }[];
}

class CartProvider {
  storeProvider: StoreProvider;
  cartsDatabase: CartsDatabase;

  constructor(storeProvider: StoreProvider, cartsDatabase: CartsDatabase) {
    this.storeProvider = storeProvider;
    this.cartsDatabase = cartsDatabase;
  }

  getCart(cartId: string): Cart | undefined {
    return this.cartsDatabase.find(cartId);
  }

  getCartsForUser(userId: string): Cart[] {
    return this.cartsDatabase.getCartsForUser(userId);
  }

  addItemToCart(args: {
    userId: string;
    cartId?: string;
    item: { id: string; quantity: number };
  }): Cart {
    const { cartId, userId, item } = args;

    const storeItem = this.storeProvider.getItem(item.id);

    if (!storeItem) {
      throw new MyError({
        message: "Cart not found.",
        clientMessage: "That item is no longer available.",
        severity: Severity.LOW,
        debugInformation: {
          args,
        },
      });
    }

    if (cartId) {
      const cart = this.getCart(cartId);

      if (!cart) {
        throw new MyError({
          message: "Cart not found.",
          severity: Severity.LOW,
          debugInformation: {
            args,
          },
        });
      }

      if (cart.userId !== userId) {
        throw new MyError({
          message: `User attempted to add an item to another user's`,
          clientMessage: "You do not have permission to perform this action",
          severity: Severity.LOW,
          debugInformation: {
            userId,
            item,
            cart,
          },
        });
      }

      cart.items.push({ item: storeItem, quantity: item.quantity });

      return cart;
    } else {
      const cart: Cart = {
        id: this.cartsDatabase.getCartsForUser(userId).length.toString(),
        userId,
        items: [{ item: storeItem, quantity: item.quantity }],
      };

      return cart;
    }
  }
}

export { CartProvider };
