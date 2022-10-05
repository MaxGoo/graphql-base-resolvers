"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartProvider = void 0;
class CartProvider {
    carts;
    constructor() {
        this.carts = [];
    }
    getCart(cartId) {
        return this.carts.find((cart) => cart.id === cartId);
    }
    getCartsForUser(userId) {
        return this.carts.filter((cart) => cart.userId === userId);
    }
    addItemToCart(cartId, item) {
        const cart = this.getCart(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        cart.items.push(item);
    }
}
exports.CartProvider = CartProvider;
//# sourceMappingURL=cart-provider.js.map