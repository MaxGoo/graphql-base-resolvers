import { Cart } from "../domain/cart-provider";

class CartsDatabase {
  private carts: Cart[] = [];

  find(cartId: string): Cart | undefined {
    return this.carts.find((cart) => cart.id === cartId);
  }

  getCartsForUser(userId: string): Cart[] {
    return this.carts.filter((cart) => cart.userId === userId);
  }
}

export { CartsDatabase };
