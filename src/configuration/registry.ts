//TODO: Use a proper DI framework

import { CartsDatabase } from "../data/carts";
import { StoreDatabase } from "../data/store";
import { UsersDatabase } from "../data/users";
import { CartProvider } from "../domain/cart-provider";
import { StoreProvider } from "../domain/store-provider";
import { UserProvider } from "../domain/user-provider";

const userProvider = new UserProvider(new UsersDatabase());
const storeProvider = new StoreProvider(new StoreDatabase());
const cartProvider = new CartProvider(storeProvider, new CartsDatabase());

export { userProvider, cartProvider, storeProvider };
