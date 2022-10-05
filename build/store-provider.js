"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreProvider = void 0;
class StoreProvider {
    items;
    constructor() {
        this.items = [
            {
                id: "1",
                name: "Knife set",
            },
            {
                id: "2",
                name: "Vacuum cleaner",
            },
        ];
    }
    getItems() {
        return this.items;
    }
}
exports.StoreProvider = StoreProvider;
//# sourceMappingURL=store-provider.js.map