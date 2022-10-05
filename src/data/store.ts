import { Item } from "../domain/store-provider";

class StoreDatabase {
  items: Item[];

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

  getItem(itemId: string) {
    return this.items.find((item) => item.id === itemId);
  }
}

export { StoreDatabase };
