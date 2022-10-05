import { StoreDatabase } from "../data/store";

export interface Item {
  id: string;
  name: string;
}

class StoreProvider {
  storeDatabase: StoreDatabase;

  constructor(storeDatabase: StoreDatabase) {
    this.storeDatabase = storeDatabase;
  }

  getItems(): Item[] {
    return this.storeDatabase.getItems();
  }

  getItem(itemId: string): Item | undefined {
    return this.storeDatabase.getItem(itemId);
  }
}

export { StoreProvider };
